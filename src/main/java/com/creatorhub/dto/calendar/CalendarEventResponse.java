package com.creatorhub.dto.calendar;

import java.time.LocalDateTime;

public record CalendarEventResponse(
        Long eventId,
        Long contentId,
        LocalDateTime eventDate,
        String eventType
) {}