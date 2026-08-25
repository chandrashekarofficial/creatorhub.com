package com.creatorhub.dto.report;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;

public record ReportRequest(
        @NotNull
        LocalDate reportMonth,

        @PositiveOrZero
        long totalViews,

        @PositiveOrZero
        double averageEngagement
) {}