package com.creatorhub.controller;

import com.creatorhub.dto.video.AnalyticsResponse;
import com.creatorhub.dto.video.VideoRequest;
import com.creatorhub.dto.video.VideoResponse;
import com.creatorhub.service.VideoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoController {

    private final VideoService videoService;

    @PostMapping
    public ResponseEntity<VideoResponse> create(
            @Valid @RequestBody VideoRequest request,
            Authentication authentication) {

        Long userId = getUserId(authentication);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(videoService.create(request, userId));
    }

    @GetMapping
    public List<VideoResponse> getAll(Authentication authentication) {
        Long userId = getUserId(authentication);
        return videoService.getAll(userId);
    }

    @GetMapping("/{videoId}")
    public VideoResponse getById(
            @PathVariable Long videoId,
            Authentication authentication) {

        Long userId = getUserId(authentication);
        return videoService.getById(videoId, userId);
    }

    @GetMapping("/{videoId}/analytics")
    public AnalyticsResponse getAnalytics(
            @PathVariable Long videoId,
            Authentication authentication) {

        Long userId = getUserId(authentication);
        return videoService.getAnalytics(videoId, userId);
    }

    @PutMapping("/{videoId}")
    public VideoResponse update(
            @PathVariable Long videoId,
            @Valid @RequestBody VideoRequest request,
            Authentication authentication) {

        Long userId = getUserId(authentication);
        return videoService.update(videoId, request, userId);
    }

    @DeleteMapping("/{videoId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long videoId,
            Authentication authentication) {

        Long userId = getUserId(authentication);
        videoService.delete(videoId, userId);

        return ResponseEntity.noContent().build();
    }

    private Long getUserId(Authentication authentication) {
        return Long.valueOf(authentication.getName());
    }
}