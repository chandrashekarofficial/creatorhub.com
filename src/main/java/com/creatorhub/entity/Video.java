package com.creatorhub.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "videos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Video {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "video_id") private Long videoId;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false) private User user;
    @Column(nullable = false, length = 255) private String title;
    @Column(nullable = false) private long views;
    @Column(nullable = false) private long likes;
    @Column(nullable = false) private long comments;
    @Column(nullable = false) private long shares;
    @Column(name = "watch_time", nullable = false) private double watchTime;
    @Column(nullable = false) private double ctr;
}
