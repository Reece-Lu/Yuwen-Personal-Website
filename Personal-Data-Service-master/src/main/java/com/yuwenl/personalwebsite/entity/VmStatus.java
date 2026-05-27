package com.yuwenl.personalwebsite.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Entity
public class VmStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double diskUsed;
    private long memoryUsed;
    private double cpuUsage;
    private LocalDateTime timestamp;

    @Transient
    private double memoryUsagePercentage;

    public void setMemoryUsagePercentage(double memoryUsagePercentage) {
        this.memoryUsagePercentage = memoryUsagePercentage;
    }

    public double getMemoryUsagePercentage() {
        return memoryUsagePercentage;
    }
}

