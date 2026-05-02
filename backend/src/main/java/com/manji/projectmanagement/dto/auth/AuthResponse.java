package com.manji.projectmanagement.dto.auth;

import com.manji.projectmanagement.dto.user.UserResponse;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
