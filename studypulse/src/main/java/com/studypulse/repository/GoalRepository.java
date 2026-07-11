package com.studypulse.repository;

import com.studypulse.entity.Goal;
import com.studypulse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRepository
        extends JpaRepository<Goal, Long> {

    List<Goal> findByUser(User user);
}
