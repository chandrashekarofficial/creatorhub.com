package com.creatorhub.dto.video;

public record AnalyticsResponse(
        Long analyticsId,
        Long videoId,
        double engagementRate,
        double likeRate,
        double commentRate,
        double score
) {}