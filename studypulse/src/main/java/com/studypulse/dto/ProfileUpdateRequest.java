package com.studypulse.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileUpdateRequest {

    private String username;
    private String email;
    private String currentPassword;
}
