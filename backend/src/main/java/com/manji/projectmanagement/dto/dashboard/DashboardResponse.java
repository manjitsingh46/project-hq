package com.manji.projectmanagement.dto.dashboard;

import com.manji.projectmanagement.dto.task.TaskResponse;
import java.util.List;

public record DashboardResponse(
        long totalTasks,
        long completedTasks,
        long overdueTasks,
        long inProgressTasks,
        long todoTasks,
        List<TaskResponse> recentTasks
) {
}
