package com.creatorhub.dto.ai;

import java.time.LocalDate;

public record AiContentIdeaSummary(
        Long ideaId,
        String title,
        String hook,
        String category,
        String status,
        LocalDate plannedDate
) {
}
