import React, { useEffect, useState } from 'react';
import { createTheme } from '@mui/material/styles';
import Typography from '@mui/joy/Typography';
import { fetchRunningServices } from '../../api/ServerStatusApi';
import styles from './RunningServices.module.css';

const theme = createTheme({
    typography: {
        fontFamily: 'Nunito, Arial, sans-serif',
    },
});

// The host refreshes the snapshot every minute; poll at the same pace.
const REFRESH_MS = 60 * 1000;
// Older than this means the collector on the host has stopped.
const STALE_AFTER_MS = 5 * 60 * 1000;

const GROUPS = [
    { kind: 'container', label: 'Site containers' },
    { kind: 'system', label: 'Host services' },
];

const STATE_LABELS = {
    running: 'Running',
    starting: 'Starting',
    restarting: 'Restarting',
    stopping: 'Stopping',
    paused: 'Paused',
    stopped: 'Stopped',
    failed: 'Failed',
};

const formatDuration = (ms) => {
    const minutes = Math.max(0, Math.floor(ms / 60000));
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
};

const formatMemory = (bytes) => {
    const mib = bytes / (1024 * 1024);
    return mib >= 1024 ? `${(mib / 1024).toFixed(1)} GB` : `${Math.round(mib)} MB`;
};

const formatCpu = (percent) => (percent < 0.1 ? '<0.1% CPU' : `${percent.toFixed(1)}% CPU`);

const formatAge = (ms) => (ms < 60000 ? 'just now' : `${formatDuration(ms)} ago`);

const ServiceTile = ({ service, now }) => {
    const details = [];
    if (service.since) details.push(`Up ${formatDuration(now - new Date(service.since))}`);
    if (service.memoryBytes != null) details.push(formatMemory(service.memoryBytes));
    if (service.cpuPercent != null) details.push(formatCpu(service.cpuPercent));

    return (
        <div className={styles.tile}>
            <div className={styles.tileHeader}>
                <span className={`${styles.dot} ${styles[service.state] || styles.stopped}`} />
                <span className={styles.name}>{service.name}</span>
                <span className={styles.state}>{STATE_LABELS[service.state] || service.state}</span>
            </div>
            <div className={styles.description}>{service.description}</div>
            {details.length > 0 && <div className={styles.details}>{details.join(' · ')}</div>}
        </div>
    );
};

const RunningServices = () => {
    const [snapshot, setSnapshot] = useState(null);
    const [failed, setFailed] = useState(false);
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchRunningServices();
                if (!data || !Array.isArray(data.services)) {
                    throw new Error('Unexpected running services response');
                }
                setSnapshot(data);
                setFailed(false);
            } catch (error) {
                setFailed(true);
            }
            setNow(Date.now());
        };

        load();
        const timer = setInterval(load, REFRESH_MS);
        return () => clearInterval(timer);
    }, []);

    const services = snapshot ? snapshot.services : [];
    const runningCount = services.filter(service => service.state === 'running').length;
    const age = snapshot ? now - new Date(snapshot.generatedAt) : 0;

    // Plain divs on purpose: ProjectAPIsPage/styles.css restyles every ul/li globally.
    return (
        <div className={styles.root}>
            <Typography level="h2" sx={{ marginBottom: '0.25rem', fontFamily: theme.typography.fontFamily }}>Running Services</Typography>
            <div className={styles.summary}>
                {snapshot
                    ? `${runningCount} of ${services.length} running · updated ${formatAge(age)}`
                    : failed ? 'Service status is unavailable right now.' : 'Loading…'}
            </div>
            {snapshot && age > STALE_AFTER_MS && (
                <div className={styles.stale}>This snapshot is out of date, so the states below may have changed.</div>
            )}
            {GROUPS.map(group => {
                const members = services.filter(service => service.kind === group.kind);
                if (members.length === 0) return null;
                return (
                    <div key={group.kind} className={styles.group}>
                        <div className={styles.groupLabel}>{group.label}</div>
                        <div className={styles.grid}>
                            {members.map(service => <ServiceTile key={service.id} service={service} now={now} />)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default RunningServices;
