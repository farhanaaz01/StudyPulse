package com.studypulse.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DashboardStatsResponse {

    private long todayTime;
    private long weekTime;
    private long totalSessions;
}