package com.creatorhub.dto.video;

public record VideoResponse(
        Long videoId,
        String title,
        long views,
        long likes,
        long comments,
        long shares,
        double watchTime,
        double ctr,
        long subscribers,
        double revenue,
        long impressions
) {}