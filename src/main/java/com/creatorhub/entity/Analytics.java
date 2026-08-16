package com.creatorhub.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "analytics")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Analytics {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "analytics_id") private Long analyticsId;
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "video_id", nullable = false, unique = true) private Video video;
    @Column(name = "engagement_rate", nullable = false) private double engagementRate;
    @Column(name = "like_rate", nullable = false) private double likeRate;
    @Column(name = "comment_rate", nullable = false) private double commentRate;
    @Column(nullable = false) private double score;
}
