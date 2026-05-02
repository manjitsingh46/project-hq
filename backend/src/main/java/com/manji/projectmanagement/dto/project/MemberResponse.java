package com.manji.projectmanagement.dto.project;

import com.manji.projectmanagement.model.ProjectMemberRole;
import com.manji.projectmanagement.model.UserRole;
import java.time.Instant;

public record MemberResponse(
        Long id,
        String name,
        String email,
        UserRole globalRole,
        ProjectMemberRole projectRole,
        Instant joinedAt
) {
}
