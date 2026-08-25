package com.creatorhub.controller;

import com.creatorhub.dto.seo.SeoDataRequest;
import com.creatorhub.dto.seo.SeoDataResponse;
import com.creatorhub.service.SeoDataService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seo")
@RequiredArgsConstructor
public class SeoDataController {

    private final SeoDataService seoDataService;

    @PostMapping
    public ResponseEntity<SeoDataResponse> create(
            @Valid @RequestBody SeoDataRequest request,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(seoDataService.create(request, userId));
    }

    @GetMapping
    public List<SeoDataResponse> getAll(
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        return seoDataService.getAll(userId);
    }

    @GetMapping("/{seoId}")
    public SeoDataResponse getById(
            @PathVariable Long seoId,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        return seoDataService.getById(seoId, userId);
    }

    @PutMapping("/{seoId}")
    public SeoDataResponse update(
            @PathVariable Long seoId,
            @Valid @RequestBody SeoDataRequest request,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        return seoDataService.update(
                seoId,
                request,
                userId
        );
    }

    @DeleteMapping("/{seoId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long seoId,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        seoDataService.delete(seoId, userId);

        return ResponseEntity.noContent().build();
    }

    private Long getUserId(Authentication authentication) {
        return Long.valueOf(authentication.getName());
    }
}