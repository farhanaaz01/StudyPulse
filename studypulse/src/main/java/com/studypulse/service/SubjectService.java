package com.studypulse.service;

import com.studypulse.dto.SubjectRequest;
import com.studypulse.entity.Subject;
import com.studypulse.entity.User;
import com.studypulse.exception.BadRequestException;
import com.studypulse.repository.SubjectRepository;
import com.studypulse.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public SubjectService(
            SubjectRepository subjectRepository,
            UserRepository userRepository
    ) {
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
    }

    public Subject createSubject(
            SubjectRequest request,
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        String subjectName = request.getName().trim();

        if (
                subjectRepository.existsByNameIgnoreCaseAndUser(
                        subjectName,
                        user
                )
        ) {
            throw new BadRequestException("Subject already exists");
        }

        Subject subject = Subject.builder()
                .name(subjectName)
                .user(user)
                .build();

        return subjectRepository.save(subject);
    }

    public List<Subject> getSubjects(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow();

        return subjectRepository.findByUser(user);
    }
}