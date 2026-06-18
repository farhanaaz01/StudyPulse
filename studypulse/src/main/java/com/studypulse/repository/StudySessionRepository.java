package com.studypulse.repository;

import com.studypulse.entity.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface StudySessionRepository
        extends JpaRepository<StudySession, Long> {

    List<StudySession> findByCreatedAtBetween(
            LocalDateTime start,
            LocalDateTime end
    );
}