package com.creatorhub.dto.report;

import java.time.LocalDate;

public record ReportResponse(
        Long reportId,
        LocalDate reportMonth,
        long totalViews,
        double averageEngagement
) {}