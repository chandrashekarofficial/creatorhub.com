package com.creatorhub.dto.content;

import java.time.LocalDate;

public record ContentIdeaResponse(
        Long ideaId,
        String title,
        String hook,
        String category,
        String status,
        LocalDate plannedDate
) {}
