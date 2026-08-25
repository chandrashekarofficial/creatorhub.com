package com.creatorhub.controller;

import com.creatorhub.dto.calendar.CalendarEventRequest;
import com.creatorhub.dto.calendar.CalendarEventResponse;
import com.creatorhub.service.CalendarEventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
public class CalendarEventController {

    private final CalendarEventService calendarEventService;

    @PostMapping
    public ResponseEntity<CalendarEventResponse> create(
            @Valid @RequestBody CalendarEventRequest request,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(calendarEventService.create(request, userId));
    }

    @GetMapping
    public List<CalendarEventResponse> getAll(
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        return calendarEventService.getAll(userId);
    }

    @GetMapping("/{eventId}")
    public CalendarEventResponse getById(
            @PathVariable Long eventId,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        return calendarEventService.getById(eventId, userId);
    }

    @PutMapping("/{eventId}")
    public CalendarEventResponse update(
            @PathVariable Long eventId,
            @Valid @RequestBody CalendarEventRequest request,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        return calendarEventService.update(
                eventId,
                request,
                userId
        );
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long eventId,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        calendarEventService.delete(eventId, userId);

        return ResponseEntity.noContent().build();
    }

    private Long getUserId(Authentication authentication) {
        return Long.valueOf(authentication.getName());
    }
}