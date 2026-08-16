package com.creatorhub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "content_ideas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ContentIdea {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idea_id") private Long ideaId;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false) private User user;
    @Column(nullable = false, length = 255) private String title;
    @Column(columnDefinition = "TEXT") private String hook;
    @Column(nullable = false, length = 100) private String category;
    @Column(nullable = false, length = 30) private String status;
    @Column(name = "planned_date") private LocalDate plannedDate;
}
