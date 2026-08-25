package com.creatorhub.dto.ai;

public record AiVideoSummary(
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
) {
}
