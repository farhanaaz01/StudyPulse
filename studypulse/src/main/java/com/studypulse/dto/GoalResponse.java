package com.studypulse.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class GoalResponse {

    private Long id;
    private String title;
    private String type;
    private Integer targetValue;
    private String targetUnit;
    private String subjectName;
    private long currentValue;
    private Long currentValueSeconds;
    private int percentage;
}
