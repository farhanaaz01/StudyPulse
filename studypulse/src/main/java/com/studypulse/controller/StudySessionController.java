package com.studypulse.controller;

import com.studypulse.dto.SessionHistoryResponse;
import com.studypulse.dto.StartSessionRequest;
import com.studypulse.dto.StopSessionRequest;
import com.studypulse.entity.StudySession;
import com.studypulse.service.StudySessionService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class StudySessionController {

    private final StudySessionService studySessionService;

    public StudySessionController(
            StudySessionService studySessionService
    ) {
        this.studySessionService = studySessionService;
    }

    @PostMapping("/start")
    public StudySession startSession(
            @RequestBody StartSessionRequest request,
            Authentication authentication
    ) {
        return studySessionService.startSession(
                request,
                authentication.getName()
        );
    }

    @PostMapping("/stop/{id}")
    public StudySession stopSession(
            @PathVariable Long id,
            @RequestBody(required = false) StopSessionRequest request,
            Authentication authentication
    ) {
        Long durationSeconds = request != null
                ? request.getDurationSeconds()
                : null;

        return studySessionService.stopSession(
                id,
                authentication.getName(),
                durationSeconds
        );
    }

    @GetMapping("/history")
    public List<SessionHistoryResponse> getHistory(
            Authentication authentication
    ) {
        return studySessionService.getHistory(authentication.getName());
    }
}
