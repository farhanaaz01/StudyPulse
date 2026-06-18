package com.studypulse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SessionHistoryResponse {

    private Long id;
    private String subjectName;
    private Long durationSeconds;
    private String date;
}