package com.studypulse.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PasswordUpdateRequest {
    // Getters and Setters
    private String oldPassword;
    private String newPassword;

    // Default constructor needed for JSON deserialization
    public PasswordUpdateRequest() {
    }

    public PasswordUpdateRequest(String oldPassword, String newPassword) {
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }

}