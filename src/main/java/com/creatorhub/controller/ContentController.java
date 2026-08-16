package com.creatorhub.controller;

import com.creatorhub.dto.content.ContentIdeaRequest;
import com.creatorhub.dto.content.ContentIdeaResponse;
import com.creatorhub.entity.User;
import com.creatorhub.repository.UserRepository;
import com.creatorhub.service.ContentIdeaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
public class ContentController {

    private final ContentIdeaService contentIdeaService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ContentIdeaResponse> create(
            @Valid @RequestBody ContentIdeaRequest request,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(contentIdeaService.create(request, userId));
    }

    @GetMapping
    public List<ContentIdeaResponse> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        return contentIdeaService.getAll(userId, status, search);
    }

    @GetMapping("/{id}")
    public ContentIdeaResponse getById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        return contentIdeaService.getById(id, userId);
    }

    @PutMapping("/{id}")
    public ContentIdeaResponse update(
            @PathVariable Long id,
            @Valid @RequestBody ContentIdeaRequest request,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        return contentIdeaService.update(id, request, userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        contentIdeaService.delete(id, userId);

        return ResponseEntity.noContent().build();
    }

    private Long getUserId(Authentication authentication) {
        String email = authentication.getName();

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        return user.getUserId();
    }
}