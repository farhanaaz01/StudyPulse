package com.studypulse.repository;

import com.studypulse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    // Add this line to fix the compilation error:
    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);
}