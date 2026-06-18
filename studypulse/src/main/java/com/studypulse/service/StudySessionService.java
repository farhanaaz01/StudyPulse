package com.studypulse.service;

import com.studypulse.dto.StartSessionRequest;
import com.studypulse.entity.StudySession;
import com.studypulse.entity.Subject;
import com.studypulse.repository.StudySessionRepository;
import com.studypulse.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import com.studypulse.dto.SessionHistoryResponse;
import java.util.List;

import java.time.LocalDateTime;

@Service
public class StudySessionService {

    private final StudySessionRepository studySessionRepository;
    private final SubjectRepository subjectRepository;

    public StudySessionService(
            StudySessionRepository studySessionRepository,
            SubjectRepository subjectRepository
    ) {
        this.studySessionRepository = studySessionRepository;
        this.subjectRepository = subjectRepository;
    }

    public StudySession startSession(
            StartSessionRequest request
    ) {

        Subject subject =
                subjectRepository.findById(
                        request.getSubjectId()
                ).orElseThrow();

        StudySession session =
                StudySession.builder()
                        .subject(subject)
                        .startTime(LocalDateTime.now())
                        .createdAt(LocalDateTime.now())
                        .durationSeconds(0L)
                        .build();

        return studySessionRepository.save(session);
    }
    public StudySession stopSession(Long sessionId) {

        StudySession session =
                studySessionRepository.findById(sessionId)
                        .orElseThrow();

        session.setEndTime(LocalDateTime.now());

        long duration =
                java.time.Duration.between(
                        session.getStartTime(),
                        session.getEndTime()
                ).getSeconds();

        session.setDurationSeconds(duration);

        return studySessionRepository.save(session);
    }
    public List<SessionHistoryResponse> getHistory() {

        return studySessionRepository.findAll()
                .stream()
                .map(session -> new SessionHistoryResponse(
                        session.getId(),
                        session.getSubject().getName(),
                        session.getDurationSeconds(),
                        session.getCreatedAt().toLocalDate().toString()
                ))
                .toList();
    }
}