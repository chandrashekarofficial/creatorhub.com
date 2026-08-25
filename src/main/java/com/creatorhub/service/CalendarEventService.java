package com.creatorhub.service;

import com.creatorhub.dto.calendar.CalendarEventRequest;
import com.creatorhub.dto.calendar.CalendarEventResponse;
import com.creatorhub.entity.CalendarEvent;
import com.creatorhub.entity.ContentIdea;
import com.creatorhub.entity.User;
import com.creatorhub.repository.CalendarEventRepository;
import com.creatorhub.repository.ContentIdeaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CalendarEventService {

    private final CalendarEventRepository calendarEventRepository;
    private final ContentIdeaRepository contentIdeaRepository;

    @Transactional
    public CalendarEventResponse create(CalendarEventRequest request, Long userId) {

        User user = new User();
        user.setUserId(userId);

        ContentIdea content = null;

        if (request.contentId() != null) {
            content = contentIdeaRepository
                    .findByIdeaIdAndUserUserId(request.contentId(), userId)
                    .orElseThrow(() ->
                            new RuntimeException("Content idea not found"));
        }

        CalendarEvent event = CalendarEvent.builder()
                .user(user)
                .content(content)
                .eventDate(request.eventDate())
                .eventType(request.eventType())
                .build();

        return toResponse(calendarEventRepository.save(event));
    }

    @Transactional(readOnly = true)
    public List<CalendarEventResponse> getAll(Long userId) {

        return calendarEventRepository
                .findByUserUserIdOrderByEventDateAsc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CalendarEventResponse getById(Long eventId, Long userId) {

        return toResponse(findOwnedEvent(eventId, userId));
    }

    @Transactional
    public CalendarEventResponse update(
            Long eventId,
            CalendarEventRequest request,
            Long userId
    ) {

        CalendarEvent event = findOwnedEvent(eventId, userId);

        ContentIdea content = null;

        if (request.contentId() != null) {
            content = contentIdeaRepository
                    .findByIdeaIdAndUserUserId(request.contentId(), userId)
                    .orElseThrow(() ->
                            new RuntimeException("Content idea not found"));
        }

        event.setContent(content);
        event.setEventDate(request.eventDate());
        event.setEventType(request.eventType());

        return toResponse(calendarEventRepository.save(event));
    }

    @Transactional
    public void delete(Long eventId, Long userId) {

        CalendarEvent event = findOwnedEvent(eventId, userId);

        calendarEventRepository.delete(event);
    }

    private CalendarEvent findOwnedEvent(Long eventId, Long userId) {

        return calendarEventRepository
                .findByEventIdAndUserUserId(eventId, userId)
                .orElseThrow(() ->
                        new RuntimeException("Calendar event not found"));
    }

    private CalendarEventResponse toResponse(CalendarEvent event) {

        Long contentId = event.getContent() != null
                ? event.getContent().getIdeaId()
                : null;

        return new CalendarEventResponse(
                event.getEventId(),
                contentId,
                event.getEventDate(),
                event.getEventType()
        );
    }
}