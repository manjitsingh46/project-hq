package com.manji.projectmanagement.dto.project;

import com.manji.projectmanagement.model.ProjectMemberRole;
import jakarta.validation.constraints.NotNull;

public record ProjectMemberRequest(
        @NotNull Long userId,
        @NotNull ProjectMemberRole role
) {
}
