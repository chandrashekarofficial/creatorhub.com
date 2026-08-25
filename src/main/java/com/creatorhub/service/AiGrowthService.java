package com.creatorhub.service;

import com.creatorhub.dto.ai.AiContentIdeaSummary;
import com.creatorhub.dto.ai.AiGrowthContext;
import com.creatorhub.dto.ai.AiVideoSummary;
import com.creatorhub.entity.ContentIdea;
import com.creatorhub.entity.Video;
import com.creatorhub.repository.ContentIdeaRepository;
import com.creatorhub.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AiGrowthService {

    private final VideoRepository videoRepository;
    private final ContentIdeaRepository contentIdeaRepository;

    @Transactional(readOnly = true)
    public AiGrowthContext buildContext(Long userId) {

        List<Video> videos =
                videoRepository.findByUserUserId(userId);

        List<ContentIdea> contentIdeas =
                contentIdeaRepository
                        .findByUserUserIdOrderByPlannedDateAsc(userId);

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

        long totalSubscribers = videos.stream()
                .mapToLong(Video::getSubscribers)
                .sum();

        double totalRevenue = videos.stream()
                .mapToDouble(Video::getRevenue)
                .sum();

        long totalImpressions = videos.stream()
                .mapToLong(Video::getImpressions)
                .sum();

        double averageWatchTime = videos.stream()
                .mapToDouble(Video::getWatchTime)
                .average()
                .orElse(0.0);

        double averageCtr = videos.stream()
                .mapToDouble(Video::getCtr)
                .average()
                .orElse(0.0);

        List<AiVideoSummary> topVideos = videos.stream()
                .sorted(
                        Comparator.comparingLong(Video::getViews)
                                .reversed()
                )
                .limit(5)
                .map(this::toVideoSummary)
                .toList();

        List<AiVideoSummary> recentVideos = videos.stream()
                .sorted(
                        Comparator.comparing(
                                Video::getVideoId,
                                Comparator.nullsLast(
                                        Comparator.reverseOrder()
                                )
                        )
                )
                .limit(5)
                .map(this::toVideoSummary)
                .toList();

        List<AiContentIdeaSummary> ideaSummaries =
                contentIdeas.stream()
                        .limit(20)
                        .map(this::toContentIdeaSummary)
                        .toList();

        return new AiGrowthContext(
                totalVideos,
                totalViews,
                totalLikes,
                totalComments,
                totalShares,
                averageWatchTime,
                averageCtr,
                totalSubscribers,
                totalRevenue,
                totalImpressions,
                topVideos,
                recentVideos,
                ideaSummaries
        );
    }

    private AiVideoSummary toVideoSummary(Video video) {

        return new AiVideoSummary(
                video.getVideoId(),
                video.getTitle(),
                video.getViews(),
                video.getLikes(),
                video.getComments(),
                video.getShares(),
                video.getWatchTime(),
                video.getCtr(),
                video.getSubscribers(),
                video.getRevenue(),
                video.getImpressions()
        );
    }

    private AiContentIdeaSummary toContentIdeaSummary(
            ContentIdea idea
    ) {

        return new AiContentIdeaSummary(
                idea.getIdeaId(),
                idea.getTitle(),
                idea.getHook(),
                idea.getCategory(),
                idea.getStatus(),
                idea.getPlannedDate()
        );
    }
}
