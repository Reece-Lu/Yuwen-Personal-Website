package com.yuwenl.personalwebsite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.yuwenl.personalwebsite.entity.DailyPerformance;

import java.time.LocalDate;
import java.util.List;

public interface DailyPerformanceRepository extends JpaRepository<DailyPerformance, Long> {
    List<DailyPerformance> findAllByDateBetween(LocalDate startDate, LocalDate endDate);
}
