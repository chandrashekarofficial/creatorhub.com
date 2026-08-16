package com.creatorhub.repository;

import com.creatorhub.entity.Analytics;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AnalyticsRepository extends JpaRepository<Analytics, Long> {
    Optional<Analytics> findByVideoVideoId(Long videoId);
}
