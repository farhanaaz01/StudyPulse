package com.studypulse.controller;

import com.studypulse.dto.UserProfileResponse;
import com.studypulse.entity.User;
import com.studypulse.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(
            UserRepository userRepository
    ) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public UserProfileResponse getCurrentUser(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
}