package com.manji.projectmanagement.dto.task;

import com.manji.projectmanagement.model.TaskStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record TaskCreateRequest(
        @NotBlank @Size(max = 160) String title,
        @NotBlank @Size(max = 1500) String description,
        @NotNull Long projectId,
        @NotNull Long assignedToUserId,
        @NotNull @FutureOrPresent LocalDate dueDate,
        TaskStatus status
) {
}
