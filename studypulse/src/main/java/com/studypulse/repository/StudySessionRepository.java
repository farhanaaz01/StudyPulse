package com.studypulse.repository;

import com.studypulse.entity.StudySession;
import com.studypulse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface StudySessionRepository
        extends JpaRepository<StudySession, Long> {

    List<StudySession> findByUser(User user);

    List<StudySession> findByUserAndEndTimeBetween(
            User user,
            LocalDateTime start,
            LocalDateTime end
    );

    List<StudySession> findByUserAndEndTimeIsNotNull(User user);

    List<StudySession> findByUserAndEndTimeIsNotNullOrderByEndTimeDesc(User user);

    long countByUserAndEndTimeIsNotNull(User user);
}
