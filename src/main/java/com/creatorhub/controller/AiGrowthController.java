package com.creatorhub.controller;

import com.creatorhub.dto.ai.AiGrowthContext;
import com.creatorhub.service.AiGrowthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiGrowthController {

    private final AiGrowthService aiGrowthService;

    @GetMapping("/growth/context")
    public AiGrowthContext getGrowthContext(Principal principal) {

        Long userId = Long.valueOf(principal.getName());

        return aiGrowthService.buildContext(userId);
    }
}
