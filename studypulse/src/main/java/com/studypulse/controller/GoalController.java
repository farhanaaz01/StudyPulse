package com.studypulse.controller;

import com.studypulse.dto.GoalResponse;
import com.studypulse.entity.Goal;
import com.studypulse.service.GoalService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @PostMapping
    public GoalResponse createGoal(
            @RequestBody Goal goal,
            Authentication authentication
    ) {
        return goalService.createGoal(goal, authentication.getName());
    }

    @GetMapping
    public List<GoalResponse> getGoals(Authentication authentication) {
        return goalService.getGoals(authentication.getName());
    }

    @DeleteMapping("/{id}")
    public void deleteGoal(
            @PathVariable Long id,
            Authentication authentication
    ) {
        goalService.deleteGoal(id, authentication.getName());
    }
}
