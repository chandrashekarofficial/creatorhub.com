package com.creatorhub.controller;

import com.creatorhub.dto.dashboard.DashboardResponse;
import com.creatorhub.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardResponse getDashboard(Principal principal) {
        Long userId = Long.valueOf(principal.getName());

        return dashboardService.getDashboard(userId);
    }
}