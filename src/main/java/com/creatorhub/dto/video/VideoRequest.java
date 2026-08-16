package com.creatorhub.dto.video;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

public record VideoRequest(
        @NotBlank(message = "Title is required")
        String title,

        @PositiveOrZero(message = "Views cannot be negative")
        long views,

        @PositiveOrZero(message = "Likes cannot be negative")
        long likes,

        @PositiveOrZero(message = "Comments cannot be negative")
        long comments,

        @PositiveOrZero(message = "Shares cannot be negative")
        long shares,

        @PositiveOrZero(message = "Watch time cannot be negative")
        double watchTime,

        @PositiveOrZero(message = "CTR cannot be negative")
        double ctr
) {}