package com.yuwenl.personalwebsite.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/serverstatus")
public class ServerStatusController {

    private final Path servicesSnapshot;

    public ServerStatusController(@Value("${app.server-status.services-file}") String servicesFile) {
        this.servicesSnapshot = Path.of(servicesFile);
    }

    // The snapshot is written every minute on the host by server-status/collect_services.py,
    // since this container cannot see host services or the other containers.
    @GetMapping(value = "/services", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getRunningServices() {
        try {
            return ResponseEntity.ok()
                    .cacheControl(CacheControl.noCache())
                    .body(Files.readString(servicesSnapshot));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
    }
}
