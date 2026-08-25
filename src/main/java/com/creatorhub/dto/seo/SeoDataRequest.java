package com.creatorhub.dto.seo;

import jakarta.validation.constraints.NotNull;

public record SeoDataRequest(
        @NotNull
        Long contentId,

        String keywords,

        String hashtags,

        String description
) {}