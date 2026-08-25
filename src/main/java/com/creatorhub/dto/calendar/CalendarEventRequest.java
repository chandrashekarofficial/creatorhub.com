package com.creatorhub.dto.calendar;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record CalendarEventRequest(
        Long contentId,

        @NotNull
        LocalDateTime eventDate,

        @NotBlank
        String eventType
) {}