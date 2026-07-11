package com.studypulse.service;

import com.studypulse.dto.GoalResponse;
import com.studypulse.entity.Goal;
import com.studypulse.entity.StudySession;
import com.studypulse.entity.User;
import com.studypulse.exception.ResourceNotFoundException;
import com.studypulse.repository.GoalRepository;
import com.studypulse.repository.StudySessionRepository;
import com.studypulse.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final StudySessionRepository studySessionRepository;

    public GoalService(
            GoalRepository goalRepository,
            UserRepository userRepository,
            StudySessionRepository studySessionRepository
    ) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
        this.studySessionRepository = studySessionRepository;
    }

    public GoalResponse createGoal(Goal goal, String email) {
        User user = resolveUser(email);
        goal.setUser(user);
        normalizeGoalUnit(goal);
        Goal savedGoal = goalRepository.save(goal);
        List<StudySession> sessions = getCompletedSessions(user);
        return toResponse(savedGoal, sessions);
    }

    public List<GoalResponse> getGoals(String email) {
        User user = resolveUser(email);
        List<StudySession> sessions = getCompletedSessions(user);

        return goalRepository.findByUser(user).stream()
                .map(goal -> toResponse(goal, sessions))
                .toList();
    }

    public void deleteGoal(Long goalId, String email) {
        User user = resolveUser(email);
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Goal not found");
        }

        goalRepository.delete(goal);
    }

    private GoalResponse toResponse(Goal goal, List<StudySession> sessions) {
        long currentValue = computeCurrentValue(goal, sessions);
        int percentage = computePercentage(goal, currentValue);
        Long currentValueSeconds = "STREAK".equals(goal.getType()) ? null : currentValue;

        return new GoalResponse(
                goal.getId(),
                goal.getTitle(),
                goal.getType(),
                goal.getTargetValue(),
                resolveTargetUnit(goal),
                goal.getSubjectName(),
                currentValue,
                currentValueSeconds,
                percentage
        );
    }

    private long computeCurrentValue(Goal goal, List<StudySession> sessions) {
        return switch (goal.getType()) {
            case "WEEKLY" -> sumDurationBetween(
                    sessions,
                    weekStart(),
                    dayEndExclusive(LocalDate.now())
            );
            case "SUBJECT" -> sumSubjectDurationBetween(
                    sessions,
                    weekStart(),
                    dayEndExclusive(LocalDate.now()),
                    goal.getSubjectName()
            );
            case "STREAK" -> calculateCurrentStreak(sessions);
            default -> 0;
        };
    }

    private int computePercentage(Goal goal, long currentValue) {
        if (goal.getTargetValue() == null || goal.getTargetValue() <= 0) {
            return 0;
        }

        if ("STREAK".equals(goal.getType())) {
            return (int) Math.min(
                    100,
                    Math.round((currentValue * 100.0) / goal.getTargetValue())
            );
        }

        long targetSeconds = targetToSeconds(goal);
        if (targetSeconds <= 0) {
            return 0;
        }

        return (int) Math.min(100, Math.round((currentValue * 100.0) / targetSeconds));
    }

    private long targetToSeconds(Goal goal) {
        if (goal.getTargetValue() == null || goal.getTargetValue() <= 0) {
            return 0;
        }

        return switch (resolveTargetUnit(goal)) {
            case "MINUTES" -> goal.getTargetValue() * 60L;
            default -> goal.getTargetValue() * 3600L;
        };
    }

    private String resolveTargetUnit(Goal goal) {
        if ("STREAK".equals(goal.getType())) {
            return "DAYS";
        }

        if (goal.getTargetUnit() == null || goal.getTargetUnit().isBlank()) {
            return "HOURS";
        }

        return goal.getTargetUnit();
    }

    private void normalizeGoalUnit(Goal goal) {
        if ("STREAK".equals(goal.getType())) {
            goal.setTargetUnit("DAYS");
            return;
        }

        if (goal.getTargetUnit() == null || goal.getTargetUnit().isBlank()) {
            goal.setTargetUnit("HOURS");
        }
    }

    private long calculateCurrentStreak(List<StudySession> sessions) {
        Set<LocalDate> studiedDays = sessions.stream()
                .map(session -> session.getEndTime().toLocalDate())
                .collect(Collectors.toSet());

        long streak = 0;
        LocalDate currentDay = LocalDate.now();

        while (studiedDays.contains(currentDay)) {
            streak++;
            currentDay = currentDay.minusDays(1);
        }

        return streak;
    }

    private long sumSubjectDurationBetween(
            List<StudySession> sessions,
            LocalDateTime start,
            LocalDateTime end,
            String subjectName
    ) {
        if (subjectName == null || subjectName.isBlank()) {
            return 0;
        }

        String normalizedSubject = subjectName.trim();

        return sessions.stream()
                .filter(session ->
                        !session.getEndTime().isBefore(start)
                                && session.getEndTime().isBefore(end)
                )
                .filter(session ->
                        session.getSubject() != null
                                && session.getSubject().getName() != null
                                && session.getSubject().getName()
                                .equalsIgnoreCase(normalizedSubject)
                )
                .mapToLong(StudySession::getDurationSeconds)
                .sum();
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

    private LocalDateTime weekStart() {
        return LocalDate.now().minusDays(6).atStartOfDay();
    }

    private LocalDateTime dayEndExclusive(LocalDate date) {
        return date.plusDays(1).atStartOfDay();
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

    private User resolveUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
