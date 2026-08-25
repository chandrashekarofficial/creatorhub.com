package com.creatorhub.service;

import com.creatorhub.dto.report.ReportRequest;
import com.creatorhub.dto.report.ReportResponse;
import com.creatorhub.entity.Report;
import com.creatorhub.entity.User;
import com.creatorhub.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    @Transactional
    public ReportResponse create(ReportRequest request, Long userId) {

        User user = new User();
        user.setUserId(userId);

        Report report = Report.builder()
                .user(user)
                .reportMonth(request.reportMonth())
                .totalViews(request.totalViews())
                .averageEngagement(request.averageEngagement())
                .build();

        return toResponse(reportRepository.save(report));
    }

    @Transactional(readOnly = true)
    public List<ReportResponse> getAll(Long userId) {

        return reportRepository
                .findByUserUserIdOrderByReportMonthDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ReportResponse getById(Long reportId, Long userId) {

        return toResponse(findOwnedReport(reportId, userId));
    }

    @Transactional
    public ReportResponse update(
            Long reportId,
            ReportRequest request,
            Long userId
    ) {

        Report report = findOwnedReport(reportId, userId);

        report.setReportMonth(request.reportMonth());
        report.setTotalViews(request.totalViews());
        report.setAverageEngagement(request.averageEngagement());

        return toResponse(reportRepository.save(report));
    }

    @Transactional
    public void delete(Long reportId, Long userId) {

        Report report = findOwnedReport(reportId, userId);

        reportRepository.delete(report);
    }

    private Report findOwnedReport(Long reportId, Long userId) {

        return reportRepository
                .findByReportIdAndUserUserId(reportId, userId)
                .orElseThrow(() ->
                        new RuntimeException("Report not found"));
    }

    private ReportResponse toResponse(Report report) {

        return new ReportResponse(
                report.getReportId(),
                report.getReportMonth(),
                report.getTotalViews(),
                report.getAverageEngagement()
        );
    }
}