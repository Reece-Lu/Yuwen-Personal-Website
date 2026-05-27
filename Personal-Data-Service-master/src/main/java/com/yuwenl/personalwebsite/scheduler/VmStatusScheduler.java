package com.yuwenl.personalwebsite.scheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import com.yuwenl.personalwebsite.service.VmStatusService;

@Component
public class VmStatusScheduler {

    @Autowired
    private VmStatusService vmStatusService;

    @Scheduled(fixedRate = 300000)
    public void scheduleVmStatusRecording() {
        vmStatusService.recordVmStatus();
    }
}
