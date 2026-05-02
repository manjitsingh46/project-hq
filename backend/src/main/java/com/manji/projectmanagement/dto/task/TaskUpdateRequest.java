package com.manji.projectmanagement.dto.task;

import com.manji.projectmanagement.model.TaskStatus;
import java.time.LocalDate;

public record TaskUpdateRequest(
        String title,
        String description,
        Long assignedToUserId,
        LocalDate dueDate,
        TaskStatus status
) {
}
