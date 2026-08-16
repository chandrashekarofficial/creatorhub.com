package com.creatorhub.repository;

import com.creatorhub.entity.ContentIdea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContentIdeaRepository extends JpaRepository<ContentIdea, Long> {

    List<ContentIdea> findByUserUserIdOrderByPlannedDateAsc(Long userId);

    List<ContentIdea> findByUserUserIdAndStatusOrderByPlannedDateAsc(
            Long userId,
            String status
    );

    List<ContentIdea> findByUserUserIdAndTitleContainingIgnoreCaseOrderByPlannedDateAsc(
            Long userId,
            String title
    );

    Optional<ContentIdea> findByIdeaIdAndUserUserId(Long ideaId, Long userId);
}