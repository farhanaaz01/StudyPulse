package com.studypulse.controller;

import com.studypulse.dto.PasswordUpdateRequest;
import com.studypulse.dto.ProfileUpdateRequest;
import com.studypulse.dto.UserProfileResponse;
import com.studypulse.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile() {
        return ResponseEntity.ok(userService.getUserProfile());
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @RequestBody ProfileUpdateRequest request
    ) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    @PutMapping("/settings/password")
    public ResponseEntity<Map<String, String>> updatePassword(
            @RequestBody PasswordUpdateRequest request
    ) {
        userService.updatePassword(request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Password updated successfully."));
    }
}
