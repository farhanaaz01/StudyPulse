package com.studypulse.controller;

import com.studypulse.dto.StartSessionRequest;
import com.studypulse.entity.StudySession;
import com.studypulse.service.StudySessionService;
import org.springframework.web.bind.annotation.*;
import com.studypulse.dto.SessionHistoryResponse;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class StudySessionController {

    private final StudySessionService studySessionService;

    public StudySessionController(
            StudySessionService studySessionService)
    {
        this.studySessionService = studySessionService;
    }

    @PostMapping("/start")
    public StudySession startSession(
            @RequestBody StartSessionRequest request)
    {
        return studySessionService.startSession(request);
    }
    @PostMapping("/stop/{id}")
    public StudySession stopSession(
            @PathVariable Long id)
    {
        return studySessionService.stopSession(id);
    }
    @GetMapping("/history")
    public List<SessionHistoryResponse> getHistory() {
        return studySessionService.getHistory();
    }
}