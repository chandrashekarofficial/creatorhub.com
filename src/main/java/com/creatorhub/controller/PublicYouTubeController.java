package com.creatorhub.controller;

import com.creatorhub.service.PublicYouTubeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public/youtube")
@RequiredArgsConstructor
public class PublicYouTubeController {

    private final PublicYouTubeService service;

    @GetMapping("/channel")
    public Map<String, Object> getChannel(
            @RequestParam String query) throws Exception {

        return service.getChannel(query);
    }

    @GetMapping("/videos")
    public Map<String, Object> getVideos(
            @RequestParam String channelId) throws Exception {

        return service.getVideos(channelId);
    }
}