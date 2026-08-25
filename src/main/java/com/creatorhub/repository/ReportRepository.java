package com.creatorhub.repository;

import com.creatorhub.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByUserUserIdOrderByReportMonthDesc(Long userId);

    Optional<Report> findByReportIdAndUserUserId(Long reportId, Long userId);
}