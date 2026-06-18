package com.studypulse.service;

import com.studypulse.dto.DashboardStatsResponse;
import com.studypulse.entity.StudySession;
import com.studypulse.repository.StudySessionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DashboardService {

    private final StudySessionRepository studySessionRepository;

    public DashboardService(
            StudySessionRepository studySessionRepository
    ) {
        this.studySessionRepository = studySessionRepository;
    }

    public DashboardStatsResponse getStats() {

        LocalDate today = LocalDate.now();

        LocalDateTime startOfToday =
                today.atStartOfDay();

        LocalDateTime endOfToday =
                today.plusDays(1).atStartOfDay();

        List<StudySession> todaySessions =
                studySessionRepository.findByCreatedAtBetween(
                        startOfToday,
                        endOfToday
                );

        long todayTime =
                todaySessions.stream()
                        .mapToLong(
                                s -> s.getDurationSeconds() == null
                                        ? 0
                                        : s.getDurationSeconds()
                        )
                        .sum();

        LocalDateTime startOfWeek =
                today.minusDays(6).atStartOfDay();

        List<StudySession> weekSessions =
                studySessionRepository.findByCreatedAtBetween(
                        startOfWeek,
                        endOfToday
                );

        long weekTime =
                weekSessions.stream()
                        .mapToLong(
                                s -> s.getDurationSeconds() == null
                                        ? 0
                                        : s.getDurationSeconds()
                        )
                        .sum();

        long totalSessions =
                studySessionRepository.count();

        return new DashboardStatsResponse(
                todayTime,
                weekTime,
                totalSessions
        );
    }
}