package com.creatorhub.repository;

import com.creatorhub.entity.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {

    List<CalendarEvent> findByUserUserIdOrderByEventDateAsc(Long userId);

    Optional<CalendarEvent> findByEventIdAndUserUserId(Long eventId, Long userId);
}