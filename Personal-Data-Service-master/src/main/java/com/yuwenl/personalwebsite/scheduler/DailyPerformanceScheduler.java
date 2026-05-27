package com.yuwenl.personalwebsite.scheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import com.yuwenl.personalwebsite.service.VmStatusService;

import java.time.LocalDateTime;

@Component
public class DailyPerformanceScheduler {

    @Autowired
    private VmStatusService vmStatusService;

    @Scheduled(cron = "0 0 0 * * ?") // run every 12:00:00 AM
    public void scheduleDailyPerformanceReview() {
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
        double performanceScore = vmStatusService.getDailyPerformanceScore(yesterday);
        System.out.println("Performance score for " + yesterday.toLocalDate() + " is: " + performanceScore);
    }
}
