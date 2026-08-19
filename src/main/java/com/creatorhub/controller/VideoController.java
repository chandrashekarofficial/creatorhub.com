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

        System.out.println("=================================");
        System.out.println("VIDEO CONTROLLER -> GET ALL");
        System.out.println("AUTH NAME -> " + authentication.getName());
        System.out.println("AUTH AUTHORITIES -> "
                + authentication.getAuthorities());

        Long userId = getUserId(authentication);

        System.out.println("VIDEO USER ID -> " + userId);

        List<VideoResponse> videos =
                videoService.getAll(userId);

        System.out.println("VIDEOS FOUND -> " + videos.size());
        System.out.println("=================================");

        return videos;
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

        return videoService.update(
                videoId,
                request,
                userId
        );
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

        if (authentication == null) {
            throw new IllegalStateException(
                    "Authentication is null"
            );
        }

        return Long.valueOf(authentication.getName());
    }
}