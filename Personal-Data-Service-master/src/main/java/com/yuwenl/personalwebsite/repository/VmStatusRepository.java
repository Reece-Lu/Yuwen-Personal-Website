package com.yuwenl.personalwebsite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.yuwenl.personalwebsite.entity.VmStatus;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VmStatusRepository extends JpaRepository<VmStatus, Long> {
    List<VmStatus> findAllByTimestampBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);
}
