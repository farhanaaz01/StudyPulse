package com.studypulse.controller;

import com.studypulse.dto.SubjectRequest;
import com.studypulse.entity.Subject;
import com.studypulse.service.SubjectService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(
            SubjectService subjectService
    ) {
        this.subjectService = subjectService;
    }

    @PostMapping
    public Subject createSubject(
            @RequestBody SubjectRequest request,
            Authentication authentication
    ) {

        return subjectService.createSubject(
                request,
                authentication.getName()
        );
    }
    @GetMapping
    public List<Subject> getSubjects(
            Authentication authentication
    ) {
        return subjectService.getSubjects(
                authentication.getName()
        );
    }
}