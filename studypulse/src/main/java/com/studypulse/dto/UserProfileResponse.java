package com.studypulse.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class UserProfileResponse {
    // Getters and Setters
    private Long id;
    private String username;
    private String email;
    private LocalDateTime createdAt;
    // You can add tracking metrics here later (e.g., currentStreak, totalStudyHours)

    public UserProfileResponse(Long id, String username, String email, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.createdAt = createdAt;
    }

}