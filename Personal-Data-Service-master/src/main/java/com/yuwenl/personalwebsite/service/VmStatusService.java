package com.yuwenl.personalwebsite.service;

import java.nio.file.FileStore;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.lang.management.ManagementFactory;
import com.sun.management.OperatingSystemMXBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.yuwenl.personalwebsite.entity.VmStatus;
import com.yuwenl.personalwebsite.entity.DailyPerformance;
import com.yuwenl.personalwebsite.repository.VmStatusRepository;
import com.yuwenl.personalwebsite.repository.DailyPerformanceRepository;

import java.lang.management.RuntimeMXBean;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VmStatusService {

    @Autowired
    private VmStatusRepository vmStatusRepository;

    @Autowired
    private DailyPerformanceRepository dailyPerformanceRepository;

    private final OperatingSystemMXBean osBean;
    private final RuntimeMXBean runtimeMXBean;

    public VmStatusService() {
        this.osBean = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();
        this.runtimeMXBean = ManagementFactory.getRuntimeMXBean();
    }

    public void recordVmStatus() {
        long memoryUsed = osBean.getTotalMemorySize() - osBean.getFreeMemorySize();
        double cpuUsage = osBean.getCpuLoad() * 100;
        double diskUsed = getDiskUsed();

        VmStatus vmStatus = new VmStatus();
        vmStatus.setMemoryUsed(memoryUsed);
        vmStatus.setCpuUsage(cpuUsage);
        vmStatus.setDiskUsed(diskUsed);
        vmStatus.setTimestamp(LocalDateTime.now());
        vmStatusRepository.save(vmStatus);
    }

    private double getDiskUsed() {
        try {
            for (Path root : FileSystems.getDefault().getRootDirectories()) {
                FileStore store = Files.getFileStore(root);
                long totalSpace = store.getTotalSpace(); // total disk space
                long usableSpace = store.getUsableSpace(); // free disk space
                long usedSpace = totalSpace - usableSpace; // used disk space

                return ((double) usedSpace / totalSpace) * 100; // disk usage percentage
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    public double getDailyPerformanceScore(LocalDateTime day) {
        LocalDateTime startOfDay = day.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        List<VmStatus> dailyRecords = vmStatusRepository.findAllByTimestampBetween(startOfDay, endOfDay);

        double totalCpuUsage = 0;
        double totalMemoryUsagePercentage = 0;

        for (VmStatus record : dailyRecords) {
            totalCpuUsage += record.getCpuUsage();
            totalMemoryUsagePercentage += getMemoryUsagePercentage(record.getMemoryUsed(), getTotalMemory());
        }

        int recordCount = dailyRecords.size();
        double averageCpuUsage = totalCpuUsage / recordCount;
        double averageMemoryUsagePercentage = totalMemoryUsagePercentage / recordCount;

        // calculate performance score
        double performanceScore = averageCpuUsage * 0.6 + averageMemoryUsagePercentage * 0.4;

        // save daily performance score
        DailyPerformance dailyPerformance = new DailyPerformance();
        dailyPerformance.setDate(day.toLocalDate());
        dailyPerformance.setPerformanceScore(performanceScore);
        dailyPerformanceRepository.save(dailyPerformance);

        return performanceScore;
    }

    private double getMemoryUsagePercentage(long usedMemory, long totalMemory) {
        if (totalMemory <= 0) {
            return 0;
        }
        return ((double) usedMemory / totalMemory) * 100;
    }

    private long getTotalMemory() {
        return osBean.getTotalMemorySize();
    }

    public List<DailyPerformance> getLast60DaysPerformanceScores() {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(60);
        return dailyPerformanceRepository.findAllByDateBetween(startDate, today);
    }

    public List<VmStatus> getLast3DaysVmStatus() {
        LocalDateTime today = LocalDateTime.now();
        LocalDateTime startDate = today.minusDays(3);
        List<VmStatus> vmStatuses = vmStatusRepository.findAllByTimestampBetween(startDate, today);
        long totalMemory = getTotalMemory();

        return vmStatuses.stream().map(status -> {
            double memoryUsagePercentage = getMemoryUsagePercentage(status.getMemoryUsed(), totalMemory);
            status.setMemoryUsagePercentage(memoryUsagePercentage);
            return status;
        }).collect(Collectors.toList());
    }
}
