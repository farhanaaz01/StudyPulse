package com.studypulse.service;

import com.studypulse.dto.SessionHistoryResponse;
import com.studypulse.dto.StartSessionRequest;
import com.studypulse.entity.StudySession;
import com.studypulse.entity.Subject;
import com.studypulse.entity.User;
import com.studypulse.exception.ForbiddenAccessException;
import com.studypulse.exception.ResourceNotFoundException;
import com.studypulse.repository.StudySessionRepository;
import com.studypulse.repository.SubjectRepository;
import com.studypulse.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StudySessionService {

    private final StudySessionRepository studySessionRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public StudySessionService(
            StudySessionRepository studySessionRepository,
            SubjectRepository subjectRepository,
            UserRepository userRepository
    ) {
        this.studySessionRepository = studySessionRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
    }

    public StudySession startSession(
            StartSessionRequest request,
            String email
    ) {
        User user = resolveUser(email);

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Subject not found"));

        if (!subject.getUser().getId().equals(user.getId())) {
            throw new ForbiddenAccessException(
                    "You cannot start a session for this subject"
            );
        }

        StudySession session = StudySession.builder()
                .subject(subject)
                .user(user)
                .startTime(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .durationSeconds(0L)
                .build();

        return studySessionRepository.save(session);
    }

    public StudySession stopSession(
            Long sessionId,
            String email,
            Long clientDurationSeconds
    ) {
        User user = resolveUser(email);

        StudySession session = studySessionRepository.findById(sessionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Session not found"));

        if (session.getUser() == null
                || !session.getUser().getId().equals(user.getId())) {
            throw new ForbiddenAccessException(
                    "You cannot stop this session"
            );
        }

        if (session.getEndTime() != null) {
            return session;
        }

        session.setEndTime(LocalDateTime.now());

        long wallClockDuration = java.time.Duration.between(
                session.getStartTime(),
                session.getEndTime()
        ).getSeconds();

        long duration = resolveDuration(wallClockDuration, clientDurationSeconds);

        session.setDurationSeconds(duration);

        return studySessionRepository.save(session);
    }

    private long resolveDuration(
            long wallClockDuration,
            Long clientDurationSeconds
    ) {
        if (clientDurationSeconds == null || clientDurationSeconds <= 0) {
            return wallClockDuration;
        }

        return Math.min(clientDurationSeconds, wallClockDuration);
    }

    public List<SessionHistoryResponse> getHistory(String email) {
        User user = resolveUser(email);

        return studySessionRepository
                .findByUserAndEndTimeIsNotNullOrderByEndTimeDesc(user)
                .stream()
                .filter(this::isCompletedSession)
                .map(this::toHistoryResponse)
                .toList();
    }

    private SessionHistoryResponse toHistoryResponse(StudySession session) {
        return new SessionHistoryResponse(
                session.getId(),
                session.getSubject().getName(),
                session.getDurationSeconds(),
                session.getStartTime() != null
                        ? session.getStartTime().toString()
                        : "-",
                session.getEndTime() != null
                        ? session.getEndTime().toString()
                        : "-",
                session.getEndTime().toLocalDate().toString()
        );
    }

    private User resolveUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    private boolean isCompletedSession(StudySession session) {
        return session.getEndTime() != null
                && session.getDurationSeconds() != null
                && session.getDurationSeconds() > 0;
    }
}
