package com.studypulse.controller;

import com.studypulse.dto.DashboardStatsResponse;
import com.studypulse.dto.StreakResponse;
import com.studypulse.dto.WeeklyProgressResponse;
import com.studypulse.service.DashboardService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService
    ) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public DashboardStatsResponse getStats(Authentication authentication) {
        return dashboardService.getStats(authentication.getName());
    }

    @GetMapping("/weekly-progress")
    public List<WeeklyProgressResponse> getWeeklyProgress(
            Authentication authentication
    ) {
        return dashboardService.getWeeklyProgress(authentication.getName());
    }

    @GetMapping("/streak")
    public StreakResponse getCurrentStreak(Authentication authentication) {
        return dashboardService.getCurrentStreak(authentication.getName());
    }
}
