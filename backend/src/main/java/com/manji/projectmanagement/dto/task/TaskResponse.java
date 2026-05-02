package com.manji.projectmanagement.dto.task;

import com.manji.projectmanagement.dto.project.ProjectResponse;
import com.manji.projectmanagement.dto.user.UserResponse;
import com.manji.projectmanagement.model.TaskStatus;
import java.time.Instant;
import java.time.LocalDate;

public record TaskResponse(
        Long id,
        String title,
        String description,
        TaskStatus status,
        LocalDate dueDate,
        UserResponse assignedTo,
        UserResponse createdBy,
        ProjectResponse project,
        boolean overdue,
        boolean canEdit,
        boolean canDelete,
        Instant createdAt,
        Instant updatedAt
) {
}
