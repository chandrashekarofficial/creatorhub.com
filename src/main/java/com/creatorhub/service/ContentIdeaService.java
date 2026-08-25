package com.creatorhub.service;

import com.creatorhub.dto.content.ContentIdeaRequest;
import com.creatorhub.dto.content.ContentIdeaResponse;
import com.creatorhub.entity.ContentIdea;
import com.creatorhub.entity.User;
import com.creatorhub.repository.ContentIdeaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContentIdeaService {

    private final ContentIdeaRepository contentIdeaRepository;

    @Transactional
    public ContentIdeaResponse create(ContentIdeaRequest request, Long userId) {
        User user = new User();
        user.setUserId(userId);

        ContentIdea idea = ContentIdea.builder()
                .user(user)
                .title(request.title())
                .hook(request.hook())
                .category(request.category())
                .status(request.status())
                .plannedDate(request.plannedDate())
                .build();

        return toResponse(contentIdeaRepository.save(idea));
    }

    @Transactional(readOnly = true)
    public List<ContentIdeaResponse> getAll(Long userId, String status, String search) {

        List<ContentIdea> ideas;

        if (status != null && !status.isBlank()) {
            ideas = contentIdeaRepository
                    .findByUserUserIdAndStatusOrderByPlannedDateAsc(userId, status);
        } else if (search != null && !search.isBlank()) {
            ideas = contentIdeaRepository
                    .findByUserUserIdAndTitleContainingIgnoreCaseOrderByPlannedDateAsc(userId, search);
        } else {
            ideas = contentIdeaRepository
                    .findByUserUserIdOrderByPlannedDateAsc(userId);
        }

        return ideas.stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ContentIdeaResponse getById(Long ideaId, Long userId) {
        return toResponse(findOwnedIdea(ideaId, userId));
    }

    @Transactional
    public ContentIdeaResponse update(
            Long ideaId,
            ContentIdeaRequest request,
            Long userId
    ) {
        ContentIdea idea = findOwnedIdea(ideaId, userId);

        idea.setTitle(request.title());
        idea.setHook(request.hook());
        idea.setCategory(request.category());
        idea.setStatus(request.status());
        idea.setPlannedDate(request.plannedDate());

        return toResponse(contentIdeaRepository.save(idea));
    }

    @Transactional
    public void delete(Long ideaId, Long userId) {
        ContentIdea idea = findOwnedIdea(ideaId, userId);
        contentIdeaRepository.delete(idea);
    }

    private ContentIdea findOwnedIdea(Long ideaId, Long userId) {
        return contentIdeaRepository
                .findByIdeaIdAndUserUserId(ideaId, userId)
                .orElseThrow(() ->
                        new RuntimeException("Content idea not found"));
    }

    private ContentIdeaResponse toResponse(ContentIdea idea) {
        return new ContentIdeaResponse(
                idea.getIdeaId(),
                idea.getTitle(),
                idea.getHook(),
                idea.getCategory(),
                idea.getStatus(),
                idea.getPlannedDate()
        );
    }
}