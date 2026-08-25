package com.creatorhub.dto.ai;

import java.util.List;

public record AiGrowthContext(
        long totalVideos,
        long totalViews,
        long totalLikes,
        long totalComments,
        long totalShares,
        double averageWatchTime,
        double averageCtr,
        long totalSubscribers,
        double totalRevenue,
        long totalImpressions,
        List<AiVideoSummary> topVideos,
        List<AiVideoSummary> recentVideos,
        List<AiContentIdeaSummary> contentIdeas
) {
}
