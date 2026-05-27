package com.yuwenl.personalwebsite.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.yuwenl.personalwebsite.entity.VmStatus;
import com.yuwenl.personalwebsite.entity.DailyPerformance;
import com.yuwenl.personalwebsite.service.VmStatusService;

import java.util.List;

@RestController
@RequestMapping("/vmstatus")
public class VmStatusController {

    @Autowired
    private VmStatusService vmStatusService;

    @GetMapping("/last60days-performance")
    public List<DailyPerformance> getLast60DaysPerformanceScores() {
        return vmStatusService.getLast60DaysPerformanceScores();
    }

    @GetMapping("/last3days")
    public List<VmStatus> getLast3DaysVmStatus() {
        return vmStatusService.getLast3DaysVmStatus();
    }
}
