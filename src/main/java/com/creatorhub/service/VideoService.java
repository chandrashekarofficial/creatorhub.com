package com.creatorhub.service;

import com.creatorhub.dto.video.AnalyticsResponse;
import com.creatorhub.dto.video.VideoRequest;
import com.creatorhub.dto.video.VideoResponse;
import com.creatorhub.entity.Analytics;
import com.creatorhub.entity.User;
import com.creatorhub.entity.Video;
import com.creatorhub.repository.AnalyticsRepository;
import com.creatorhub.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VideoService {

    private final VideoRepository videoRepository;
    private final AnalyticsRepository analyticsRepository;

    @Transactional
    public VideoResponse create(VideoRequest request, Long userId) {

        User user = new User();
        user.setUserId(userId);

        Video video = Video.builder()
                .user(user)
                .title(request.title())
                .views(request.views())
                .likes(request.likes())
                .comments(request.comments())
                .shares(request.shares())
                .watchTime(request.watchTime())
                .ctr(request.ctr())
.subscribers(request.subscribers())
.revenue(request.revenue())
.impressions(request.impressions())
.build();

        Video savedVideo = videoRepository.save(video);

        Analytics analytics = calculateAnalytics(savedVideo);
        analyticsRepository.save(analytics);

        return toVideoResponse(savedVideo);
    }

    @Transactional(readOnly = true)
    public List<VideoResponse> getAll(Long userId) {
        return videoRepository.findByUserUserId(userId)
                .stream()
                .map(this::toVideoResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public VideoResponse getById(Long videoId, Long userId) {
        return toVideoResponse(findOwnedVideo(videoId, userId));
    }

    @Transactional(readOnly = true)
    public AnalyticsResponse getAnalytics(Long videoId, Long userId) {

        Video video = findOwnedVideo(videoId, userId);

        Analytics analytics = analyticsRepository
                .findByVideoVideoId(video.getVideoId())
                .orElseGet(() -> calculateAnalytics(video));

        return toAnalyticsResponse(analytics);
    }

    @Transactional
    public VideoResponse update(
            Long videoId,
            VideoRequest request,
            Long userId
    ) {
        Video video = findOwnedVideo(videoId, userId);

        video.setTitle(request.title());
        video.setViews(request.views());
        video.setLikes(request.likes());
        video.setComments(request.comments());
        video.setShares(request.shares());
        video.setWatchTime(request.watchTime());
        video.setCtr(request.ctr());
video.setSubscribers(request.subscribers());
video.setRevenue(request.revenue());
video.setImpressions(request.impressions());

        Video savedVideo = videoRepository.save(video);

        Analytics analytics = analyticsRepository
                .findByVideoVideoId(videoId)
                .orElseGet(() -> calculateAnalytics(savedVideo));

        updateAnalytics(analytics, savedVideo);
        analyticsRepository.save(analytics);

        return toVideoResponse(savedVideo);
    }

    @Transactional
    public void delete(Long videoId, Long userId) {

        Video video = findOwnedVideo(videoId, userId);

        analyticsRepository.findByVideoVideoId(videoId)
                .ifPresent(analyticsRepository::delete);

        videoRepository.delete(video);
    }

    private Video findOwnedVideo(Long videoId, Long userId) {
        return videoRepository.findById(videoId)
                .filter(video -> video.getUser().getUserId().equals(userId))
                .orElseThrow(() ->
                        new RuntimeException("Video not found"));
    }

    private Analytics calculateAnalytics(Video video) {

        double views = video.getViews();

        double engagementRate = 0;
        double likeRate = 0;
        double commentRate = 0;

        if (views > 0) {
            engagementRate =
                    ((double) (video.getLikes()
                            + video.getComments()
                            + video.getShares()) / views) * 100;

            likeRate =
                    ((double) video.getLikes() / views) * 100;

            commentRate =
                    ((double) video.getComments() / views) * 100;
        }

        double score =
                (engagementRate * 0.5)
                        + (video.getCtr() * 0.3)
                        + (likeRate * 0.2);

        return Analytics.builder()
                .video(video)
                .engagementRate(engagementRate)
                .likeRate(likeRate)
                .commentRate(commentRate)
                .score(score)
                .build();
    }

    private void updateAnalytics(Analytics analytics, Video video) {

        double views = video.getViews();

        double engagementRate = 0;
        double likeRate = 0;
        double commentRate = 0;

        if (views > 0) {
            engagementRate =
                    ((double) (video.getLikes()
                            + video.getComments()
                            + video.getShares()) / views) * 100;

            likeRate =
                    ((double) video.getLikes() / views) * 100;

            commentRate =
                    ((double) video.getComments() / views) * 100;
        }

        double score =
                (engagementRate * 0.5)
                        + (video.getCtr() * 0.3)
                        + (likeRate * 0.2);

        analytics.setEngagementRate(engagementRate);
        analytics.setLikeRate(likeRate);
        analytics.setCommentRate(commentRate);
        analytics.setScore(score);
    }

    private VideoResponse toVideoResponse(Video video) {
        return new VideoResponse(
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

    private AnalyticsResponse toAnalyticsResponse(Analytics analytics) {
        return new AnalyticsResponse(
                analytics.getAnalyticsId(),
                analytics.getVideo().getVideoId(),
                analytics.getEngagementRate(),
                analytics.getLikeRate(),
                analytics.getCommentRate(),
                analytics.getScore()
        );
    }
}