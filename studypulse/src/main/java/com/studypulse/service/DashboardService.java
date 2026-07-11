package com.studypulse.service;

import com.studypulse.dto.DashboardStatsResponse;
import com.studypulse.dto.StreakResponse;
import com.studypulse.dto.WeeklyProgressResponse;
import com.studypulse.entity.StudySession;
import com.studypulse.entity.User;
import com.studypulse.exception.ResourceNotFoundException;
import com.studypulse.repository.StudySessionRepository;
import com.studypulse.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final StudySessionRepository studySessionRepository;
    private final UserRepository userRepository;

    public DashboardService(
            StudySessionRepository studySessionRepository,
            UserRepository userRepository
    ) {
        this.studySessionRepository = studySessionRepository;
        this.userRepository = userRepository;
    }

    public DashboardStatsResponse getStats(String email) {
        User user = resolveUser(email);
        LocalDate today = LocalDate.now();

        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime endOfToday = today.plusDays(1).atStartOfDay();
        LocalDateTime startOfWeek = today.minusDays(6).atStartOfDay();

        List<StudySession> completedSessions =
                getCompletedSessions(user);

        long todayTime = sumDurationBetween(
                completedSessions,
                startOfToday,
                endOfToday
        );

        long weekTime = sumDurationBetween(
                completedSessions,
                startOfWeek,
                endOfToday
        );

        long totalSessions = completedSessions.size();

        return new DashboardStatsResponse(
                todayTime,
                weekTime,
                totalSessions
        );
    }

    public StreakResponse getCurrentStreak(String email) {
        User user = resolveUser(email);

        Set<LocalDate> studiedDays =
                getCompletedSessions(user)
                        .stream()
                        .map(session ->
                                session.getEndTime().toLocalDate()
                        )
                        .collect(Collectors.toSet());

        long streak = 0;
        LocalDate currentDay = LocalDate.now();

        while (studiedDays.contains(currentDay)) {
            streak++;
            currentDay = currentDay.minusDays(1);
        }

        return new StreakResponse(streak);
    }

    public List<WeeklyProgressResponse> getWeeklyProgress(String email) {
        User user = resolveUser(email);
        LocalDate today = LocalDate.now();
        List<WeeklyProgressResponse> result = new ArrayList<>();
        List<StudySession> completedSessions = getCompletedSessions(user);

        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = date.plusDays(1).atStartOfDay();

            long seconds = sumDurationBetween(
                    completedSessions,
                    start,
                    end
            );

            result.add(
                    new WeeklyProgressResponse(
                            date.getDayOfWeek().toString(),
                            seconds
                    )
            );
        }

        return result;
    }

    private User resolveUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    private List<StudySession> getCompletedSessions(User user) {
        return studySessionRepository.findByUserAndEndTimeIsNotNull(user)
                .stream()
                .filter(session ->
                        session.getDurationSeconds() != null
                                && session.getDurationSeconds() > 0
                )
                .toList();
    }

    private long sumDurationBetween(
            List<StudySession> sessions,
            LocalDateTime start,
            LocalDateTime end
    ) {
        return sessions.stream()
                .filter(session ->
                        !session.getEndTime().isBefore(start)
                                && session.getEndTime().isBefore(end)
                )
                .mapToLong(StudySession::getDurationSeconds)
                .sum();
    }
}
