package com.studypulse.repository;

import com.studypulse.entity.Subject;
import com.studypulse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubjectRepository
        extends JpaRepository<Subject, Long> {

    List<Subject> findByUser(User user);



}