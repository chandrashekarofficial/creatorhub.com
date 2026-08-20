package com.creatorhub.dto.dashboard;

public record DashboardResponse(
        long totalVideos,
        long totalViews,
        long totalLikes,
        long totalComments,
        long totalShares,
        double totalWatchTime,
        long totalSubscribers,
        double totalRevenue,
        long totalImpressions,
        double averageCtr,
        double averageEngagement,
        long totalContentIdeas,
        long totalCalendarEvents,
        long totalSeoRecords,
        long totalReports
) {}