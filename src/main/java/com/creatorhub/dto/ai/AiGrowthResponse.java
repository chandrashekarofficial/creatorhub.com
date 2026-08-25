package com.creatorhub.dto.ai;

import java.util.List;

public record AiGrowthResponse(
        String summary,
        List<String> whatIsWorking,
        List<String> whatIsNotWorking,
        List<String> recommendations,
        List<String> nextContentIdeas
) {
}
