package com.studypulse.service;

import com.studypulse.dto.ProfileUpdateRequest;
import com.studypulse.dto.UserProfileResponse;
import com.studypulse.entity.User;
import com.studypulse.exception.BadRequestException;
import com.studypulse.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

@Service
public class UserService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User getCurrentAuthenticatedUser() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));
    }

    public UserProfileResponse getUserProfile() {
        User user = getCurrentAuthenticatedUser();
        return new UserProfileResponse(user.getId(), user.getUsername(), user.getEmail(), user.getCreatedAt());
    }

    @Transactional
    public UserProfileResponse updateProfile(ProfileUpdateRequest request) {
        User user = getCurrentAuthenticatedUser();

        if (request.getUsername() != null) {
            String username = request.getUsername().trim();
            if (username.isBlank()) {
                throw new BadRequestException("Username cannot be empty");
            }
            if (username.length() < 2) {
                throw new BadRequestException("Username must be at least 2 characters");
            }
            user.setUsername(username);
        }

        if (request.getEmail() != null) {
            String email = request.getEmail().trim().toLowerCase();
            validateEmail(email);

            if (!email.equalsIgnoreCase(user.getEmail())) {
                requireCurrentPassword(user, request.getCurrentPassword(), "change your email");

                if (userRepository.existsByEmail(email)) {
                    throw new BadRequestException("Email is already in use");
                }

                user.setEmail(email);
            }
        }

        User savedUser = userRepository.save(user);
        return new UserProfileResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getCreatedAt()
        );
    }

    @Transactional
    public void updatePassword(String oldPassword, String newPassword) {
        if (oldPassword == null || oldPassword.isBlank()) {
            throw new BadRequestException("Current password is required");
        }

        if (newPassword == null || newPassword.length() < 6) {
            throw new BadRequestException("New password must be at least 6 characters");
        }

        User user = getCurrentAuthenticatedUser();

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BadRequestException("The old password you entered is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private void validateEmail(String email) {
        if (email.isBlank()) {
            throw new BadRequestException("Email cannot be empty");
        }

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new BadRequestException("Enter a valid email address");
        }
    }

    private void requireCurrentPassword(User user, String currentPassword, String action) {
        if (currentPassword == null || currentPassword.isBlank()) {
            throw new BadRequestException("Current password is required to " + action);
        }

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
    }
}
