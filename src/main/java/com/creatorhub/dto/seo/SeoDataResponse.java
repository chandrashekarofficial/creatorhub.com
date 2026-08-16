package com.creatorhub.dto.seo;

public record SeoDataResponse(
        Long seoId,
        Long contentId,
        String keywords,
        String hashtags,
        String description
) {}