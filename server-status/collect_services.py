#!/usr/bin/env python3
"""Snapshot of what is running on this host, for the "Running Services" panel.

Runs on the host (meetyuwen-services.timer, every minute) because the site
containers cannot see host services or each other. Writes a small JSON file
that personal-data-service serves at /springapp/serverstatus/services.

Only the services listed in CONTAINERS and HOST_SERVICES are published;
anything else on the host is never written to the snapshot.
"""
import json
import os
import subprocess
import sys
import tempfile
import time
from datetime import datetime, timezone
from pathlib import Path

DEFAULT_OUTPUT = "/opt/meetyuwen/data/server-status/services.json"
COMPOSE_PROJECT = "meetyuwen"
CGROUP_ROOT = Path("/sys/fs/cgroup")
CPU_SAMPLE_SECONDS = 5

# Compose service -> (display name, description). Shown in this order.
CONTAINERS = {
    "gateway": ("Gateway", "Nginx reverse proxy for every site route"),
    "react-frontend": ("Portfolio Site", "React frontend you are looking at"),
    "personal-data-service": ("Personal Data API", "Spring Boot: notes, server stats, exchange rates"),
    "fastapi-service": ("ML API", "FastAPI: ML model and quant data endpoints"),
    "streamlit-service": ("Quant Monitor", "Streamlit: QQQ SMA dashboard"),
    "vue-frontend": ("Property Management UI", "Vue frontend of the residential complex project"),
    "pms-server": ("Property Management API", "Spring Boot backend of the residential complex project"),
    "learning-journey-hub": ("Learning Notes", "Writerside notes site"),
}

# systemd unit -> (display name, description). Shown in this order.
HOST_SERVICES = {
    "nginx.service": ("Nginx", "HTTPS entry point for meetyuwen.com"),
    "docker.service": ("Docker Engine", "Runs the site containers"),
    "mysql.service": ("MySQL", "Database for site and project data"),
    "ssh.service": ("OpenSSH", "Remote administration"),
    "fail2ban.service": ("Fail2ban", "Blocks SSH brute-force attempts"),
}

CONTAINER_STATES = {
    "running": "running",
    "restarting": "restarting",
    "paused": "paused",
    "created": "stopped",
    "exited": "stopped",
    "dead": "failed",
}

SYSTEMD_STATES = {
    "active": "running",
    "reloading": "running",
    "activating": "starting",
    "deactivating": "stopping",
    "inactive": "stopped",
    "failed": "failed",
}


def run(*cmd):
    return subprocess.run(cmd, check=True, capture_output=True, text=True).stdout


def read_stat(path, key):
    """Value of `key` in a cgroup "key value" file such as cpu.stat."""
    try:
        for line in path.read_text().splitlines():
            name, value = line.split()
            if name == key:
                return int(value)
    except (OSError, ValueError):
        pass
    return None


def memory_bytes(cgroup):
    """Memory in use, computed like `docker stats`: usage minus inactive page cache."""
    try:
        current = int((cgroup / "memory.current").read_text())
    except (OSError, ValueError):
        return None
    return max(0, current - (read_stat(cgroup / "memory.stat", "inactive_file") or 0))


def utc_iso(dt):
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def container_entries():
    ids = run("docker", "ps", "-aq", "--filter", f"label=com.docker.compose.project={COMPOSE_PROJECT}").split()
    found = {}
    for container in json.loads(run("docker", "inspect", *ids)) if ids else []:
        service = container["Config"]["Labels"].get("com.docker.compose.service")
        if service not in CONTAINERS:
            continue
        status = container["State"]["Status"]
        running = status == "running"
        name, description = CONTAINERS[service]
        found[service] = {
            "id": service,
            "name": name,
            "description": description,
            "kind": "container",
            "state": CONTAINER_STATES.get(status, status),
            # StartedAt carries nanoseconds ("...:34.123456789Z"); seconds are enough.
            "since": container["State"]["StartedAt"][:19] + "Z" if running else None,
            "_cgroup": CGROUP_ROOT / "system.slice" / f"docker-{container['Id']}.scope" if running else None,
        }
    return [found[service] for service in CONTAINERS if service in found]


def host_service_entries():
    entries = []
    for unit, (name, description) in HOST_SERVICES.items():
        output = run("systemctl", "show", unit, "--timestamp=unix",
                     "-p", "LoadState,ActiveState,ActiveEnterTimestamp,ControlGroup")
        props = dict(line.split("=", 1) for line in output.splitlines() if "=" in line)
        if props.get("LoadState") != "loaded":
            continue
        running = props["ActiveState"] in ("active", "reloading")
        started = props.get("ActiveEnterTimestamp", "")
        entries.append({
            "id": unit.removesuffix(".service"),
            "name": name,
            "description": description,
            "kind": "system",
            "state": SYSTEMD_STATES.get(props["ActiveState"], props["ActiveState"]),
            "since": utc_iso(datetime.fromtimestamp(int(started[1:]), timezone.utc))
                     if running and started.startswith("@") else None,
            "_cgroup": CGROUP_ROOT / props["ControlGroup"].lstrip("/")
                       if running and props.get("ControlGroup") else None,
        })
    return entries


def add_resource_usage(entries):
    """Fill cpuPercent (share of the whole machine) and memoryBytes for running entries."""
    sampled = [e for e in entries if e["_cgroup"]]
    before = {e["id"]: read_stat(e["_cgroup"] / "cpu.stat", "usage_usec") for e in sampled}
    started = time.monotonic()
    time.sleep(CPU_SAMPLE_SECONDS)
    elapsed_usec = (time.monotonic() - started) * 1_000_000 * os.cpu_count()

    for entry in entries:
        cgroup = entry.pop("_cgroup")
        entry["cpuPercent"] = None
        entry["memoryBytes"] = None
        if cgroup is None:
            continue
        after = read_stat(cgroup / "cpu.stat", "usage_usec")
        if before.get(entry["id"]) is not None and after is not None:
            entry["cpuPercent"] = round(max(0, after - before[entry["id"]]) / elapsed_usec * 100, 2)
        entry["memoryBytes"] = memory_bytes(cgroup)


def write_atomically(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=path.parent, prefix=".services-", suffix=".json")
    try:
        with os.fdopen(fd, "w") as f:
            json.dump(data, f, indent=2)
        os.chmod(tmp, 0o644)
        os.replace(tmp, path)
    except BaseException:
        os.unlink(tmp)
        raise


def main():
    output = Path(sys.argv[1] if len(sys.argv) > 1 else DEFAULT_OUTPUT)
    entries = container_entries() + host_service_entries()
    add_resource_usage(entries)
    write_atomically(output, {
        "generatedAt": utc_iso(datetime.now(timezone.utc)),
        "services": entries,
    })


if __name__ == "__main__":
    main()
