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

        List<Video> videos = videoRepository.findByUserUserId(userId);

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

        double averageCtr = videos.stream()
                .mapToDouble(Video::getCtr)
                .average()
                .orElse(0.0);

        long totalContentIdeas =
                contentIdeaRepository.findByUserUserIdOrderByPlannedDateAsc(userId)
                        .size();

        long totalCalendarEvents =
                calendarEventRepository.findByUserUserIdOrderByEventDateAsc(userId)
                        .size();

        long totalSeoRecords =
                seoDataRepository.findByUserUserIdOrderBySeoIdAsc(userId)
                        .size();

        long totalReports =
                reportRepository.findByUserUserIdOrderByReportMonthDesc(userId)
                        .size();

        double averageEngagement = 0.0;

        if (!videos.isEmpty()) {
            double totalEngagement = videos.stream()
                    .mapToDouble(video -> {
                        if (video.getViews() == 0) {
                            return 0.0;
                        }

                        return (
                                (double) video.getLikes()
                                        + video.getComments()
                                        + video.getShares()
                        ) / video.getViews() * 100.0;
                    })
                    .sum();

            averageEngagement = totalEngagement / videos.size();
        }

        return new DashboardResponse(
                totalVideos,
                totalViews,
                totalLikes,
                totalComments,
                totalShares,
                averageCtr,
                averageEngagement,
                totalContentIdeas,
                totalCalendarEvents,
                totalSeoRecords,
                totalReports
        );
    }
}