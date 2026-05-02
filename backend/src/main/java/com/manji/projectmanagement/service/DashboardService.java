package com.manji.projectmanagement.service;

import com.manji.projectmanagement.dto.common.PageResponse;
import com.manji.projectmanagement.dto.dashboard.DashboardResponse;
import com.manji.projectmanagement.dto.task.TaskResponse;
import com.manji.projectmanagement.model.TaskStatus;
import com.manji.projectmanagement.model.User;
import com.manji.projectmanagement.repository.TaskRepository;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TaskRepository taskRepository;
    private final TaskService taskService;
    private final UserService userService;
    private final AccessService accessService;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(Long userId) {
        User currentUser = userService.requireUser(userId);
        boolean admin = accessService.isGlobalAdmin(currentUser);

        long totalTasks = admin ? taskRepository.count() : taskRepository.countByAssignedToId(currentUser.getId());
        long completedTasks = admin
                ? taskRepository.countByStatus(TaskStatus.DONE)
                : taskRepository.countByStatusAndAssignedToId(TaskStatus.DONE, currentUser.getId());
        long inProgressTasks = admin
                ? taskRepository.countByStatus(TaskStatus.IN_PROGRESS)
                : taskRepository.countByStatusAndAssignedToId(TaskStatus.IN_PROGRESS, currentUser.getId());
        long todoTasks = admin
                ? taskRepository.countByStatus(TaskStatus.TODO)
                : taskRepository.countByStatusAndAssignedToId(TaskStatus.TODO, currentUser.getId());
        long overdueTasks = admin
                ? taskRepository.countByDueDateBeforeAndStatusNot(LocalDate.now(), TaskStatus.DONE)
                : taskRepository.countByDueDateBeforeAndStatusNotAndAssignedToId(LocalDate.now(), TaskStatus.DONE, currentUser.getId());

        List<TaskResponse> recentTasks = PageResponse.from(
                (admin
                        ? taskRepository.search(null, null, null, PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "updatedAt")))
                        : taskRepository.findByAssignedToId(currentUser.getId(), PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "updatedAt"))))
                        .map(task -> taskService.mapTask(task, currentUser))
        ).content();

        return new DashboardResponse(totalTasks, completedTasks, overdueTasks, inProgressTasks, todoTasks, recentTasks);
    }
}
