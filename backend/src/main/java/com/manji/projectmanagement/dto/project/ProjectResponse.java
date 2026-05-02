package com.manji.projectmanagement.dto.project;

import com.manji.projectmanagement.model.ProjectMemberRole;
import java.time.Instant;

public record ProjectResponse(
        Long id,
        String name,
        String description,
        Instant createdAt,
        MemberResponse createdBy,
        ProjectMemberRole currentUserRole,
        boolean canManage,
        long memberCount,
        long taskCount
) {
}
