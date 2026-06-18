package com.studypulse.controller;

import com.studypulse.dto.AuthResponse;
import com.studypulse.dto.LoginRequest;
import com.studypulse.dto.SignupRequest;
import com.studypulse.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController
{

    private final AuthService authService;

    public AuthController(
            AuthService authService
    ) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(
            @RequestBody SignupRequest request
    ) {
        return ResponseEntity.ok(
                authService.signup(request)
        );
    }
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request
    ) {
        System.out.println("LOGIN API HIT");
        return ResponseEntity.ok(
                authService.login(request)
        );
    }
}