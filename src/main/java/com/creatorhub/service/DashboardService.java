package com.creatorhub.service;

import com.creatorhub.dto.dashboard.DashboardResponse;
import com.creatorhub.entity.Video;
import com.creatorhub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final VideoRepository videoRepository;
    private final ContentIdeaRepository contentIdeaRepository;
    private final CalendarEventRepository calendarEventRepository;
    private final SeoDataRepository seoDataRepository;
    private final ReportRepository reportRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(Long userId) {

        List<Video> videos =
                videoRepository.findByUserUserId(userId);

        long totalVideos = videos.size();

        long totalViews = videos.stream()
                .mapToLong(Video::getViews)
                .sum();

        long totalLikes = videos.stream()
                .mapToLong(Video::getLikes)
                .sum();

        long totalComments = videos.stream()
                .mapToLong(Video::getComments)
                .sum();

        long totalShares = videos.stream()
                .mapToLong(Video::getShares)
                .sum();

        double totalWatchTime = videos.stream()
                .mapToDouble(Video::getWatchTime)
                .sum();

        long totalSubscribers = videos.stream()
                .mapToLong(Video::getSubscribers)
                .sum();

        double totalRevenue = videos.stream()
                .mapToDouble(Video::getRevenue)
                .sum();

        long totalImpressions = videos.stream()
                .mapToLong(Video::getImpressions)
                .sum();

        double averageCtr = videos.stream()
                .mapToDouble(Video::getCtr)
                .average()
                .orElse(0.0);

        /*
         * Engagement rate =
         * (Likes + Comments + Shares) / Views × 100
         */
        double averageEngagement = videos.stream()
                .filter(video -> video.getViews() > 0)
                .mapToDouble(video ->
                        ((double) video.getLikes()
                                + video.getComments()
                                + video.getShares())
                                / video.getViews() * 100.0
                )
                .average()
                .orElse(0.0);

        long totalContentIdeas =
                contentIdeaRepository
                        .findByUserUserIdOrderByPlannedDateAsc(userId)
                        .size();

        long totalCalendarEvents =
                calendarEventRepository
                        .findByUserUserIdOrderByEventDateAsc(userId)
                        .size();

        long totalSeoRecords =
                seoDataRepository
                        .findByUserUserIdOrderBySeoIdAsc(userId)
                        .size();

        long totalReports =
                reportRepository
                        .findByUserUserIdOrderByReportMonthDesc(userId)
                        .size();

        return new DashboardResponse(
                totalVideos,
                totalViews,
                totalLikes,
                totalComments,
                totalShares,
                totalWatchTime,
                totalSubscribers,
                totalRevenue,
                totalImpressions,
                averageCtr,
                averageEngagement,
                totalContentIdeas,
                totalCalendarEvents,
                totalSeoRecords,
                totalReports
        );
    }
}