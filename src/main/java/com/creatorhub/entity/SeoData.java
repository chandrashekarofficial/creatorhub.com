package com.creatorhub.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seo_data")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SeoData {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seo_id") private Long seoId;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false) private User user;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "content_id", nullable = false) private ContentIdea content;
    @Column(columnDefinition = "TEXT") private String keywords;
    @Column(columnDefinition = "TEXT") private String hashtags;
    @Column(columnDefinition = "TEXT") private String description;
}
