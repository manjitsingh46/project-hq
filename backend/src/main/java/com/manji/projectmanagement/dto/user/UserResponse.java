package com.manji.projectmanagement.dto.user;

import com.manji.projectmanagement.model.UserRole;

public record UserResponse(
        Long id,
        String name,
        String email,
        UserRole role
) {
}
