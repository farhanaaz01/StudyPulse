package com.studypulse.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WeeklyProgressResponse {

    private String day;
    private long seconds;
}

