package com.manji.projectmanagement.service;

import com.manji.projectmanagement.dto.common.PageResponse;
import com.manji.projectmanagement.dto.project.ProjectResponse;
import com.manji.projectmanagement.dto.task.TaskCreateRequest;
import com.manji.projectmanagement.dto.task.TaskResponse;
import com.manji.projectmanagement.dto.task.TaskUpdateRequest;
import com.manji.projectmanagement.exception.BadRequestException;
import com.manji.projectmanagement.exception.ForbiddenException;
import com.manji.projectmanagement.exception.ResourceNotFoundException;
import com.manji.projectmanagement.model.Project;
import com.manji.projectmanagement.model.ProjectTask;
import com.manji.projectmanagement.model.TaskStatus;
import com.manji.projectmanagement.model.User;
import com.manji.projectmanagement.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserService userService;
    private final AccessService accessService;
    private final ProjectService projectService;
    private final EntityMapper entityMapper;

    @Transactional
    public TaskResponse createTask(TaskCreateRequest request, Long userId) {
        User currentUser = userService.requireUser(userId);
        Project project = accessService.getAccessibleProject(request.projectId(), currentUser);
        accessService.ensureProjectAdmin(project, currentUser);

        User assignee = userService.requireUser(request.assignedToUserId());
        accessService.ensureAssigneeBelongsToProject(project, assignee);

        ProjectTask task = ProjectTask.builder()
                .title(request.title().trim())
                .description(request.description().trim())
                .project(project)
                .assignedTo(assignee)
                .createdBy(currentUser)
                .dueDate(request.dueDate())
                .status(request.status() == null ? TaskStatus.TODO : request.status())
                .build();

        ProjectTask savedTask = taskRepository.save(task);
        return mapTask(savedTask, currentUser);
    }

    @Transactional(readOnly = true)
    public PageResponse<TaskResponse> getTasks(Long projectId, TaskStatus status, int page, int size, Long userId) {
        User currentUser = userService.requireUser(userId);
        Long assigneeFilter = null;

        if (projectId != null) {
            Project project = accessService.getAccessibleProject(projectId, currentUser);
            if (!accessService.isProjectAdmin(project, currentUser) && !accessService.isGlobalAdmin(currentUser)) {
                assigneeFilter = currentUser.getId();
            }
        } else if (!accessService.isGlobalAdmin(currentUser)) {
            assigneeFilter = currentUser.getId();
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.asc("dueDate"), Sort.Order.desc("updatedAt")));
        Page<ProjectTask> tasks = taskRepository.search(projectId, status, assigneeFilter, pageable);
        return PageResponse.from(tasks.map(task -> mapTask(task, currentUser)));
    }

    @Transactional
    public TaskResponse updateTask(Long taskId, TaskUpdateRequest request, Long userId) {
        User currentUser = userService.requireUser(userId);
        ProjectTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        Project project = accessService.getAccessibleProject(task.getProject().getId(), currentUser);
        boolean canManage = accessService.isProjectAdmin(project, currentUser);
        boolean isAssignee = task.getAssignedTo().getId().equals(currentUser.getId());

        if (!canManage && !isAssignee) {
            throw new ForbiddenException("You cannot update this task");
        }

        if (!canManage) {
            if (request.title() != null || request.description() != null || request.assignedToUserId() != null || request.dueDate() != null) {
                throw new ForbiddenException("Members can only update task status");
            }
        }

        if (request.title() != null) {
            String title = request.title().trim();
            if (title.isBlank() || title.length() > 160) {
                throw new BadRequestException("Title must be between 1 and 160 characters");
            }
            task.setTitle(title);
        }

        if (request.description() != null) {
            String description = request.description().trim();
            if (description.isBlank() || description.length() > 1500) {
                throw new BadRequestException("Description must be between 1 and 1500 characters");
            }
            task.setDescription(description);
        }

        if (request.assignedToUserId() != null) {
            User assignee = userService.requireUser(request.assignedToUserId());
            accessService.ensureAssigneeBelongsToProject(project, assignee);
            task.setAssignedTo(assignee);
        }

        if (request.dueDate() != null) {
            task.setDueDate(request.dueDate());
        }

        if (request.status() != null) {
            task.setStatus(request.status());
        }

        ProjectTask savedTask = taskRepository.save(task);
        return mapTask(savedTask, currentUser);
    }

    @Transactional
    public void deleteTask(Long taskId, Long userId) {
        User currentUser = userService.requireUser(userId);
        ProjectTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        Project project = accessService.getAccessibleProject(task.getProject().getId(), currentUser);
        accessService.ensureProjectAdmin(project, currentUser);
        taskRepository.delete(task);
    }

    @Transactional(readOnly = true)
    TaskResponse mapTask(ProjectTask task, User currentUser) {
        ProjectResponse projectResponse = projectService.mapProject(task.getProject(), currentUser);
        boolean canManage = accessService.isProjectAdmin(task.getProject(), currentUser);
        boolean isAssignee = task.getAssignedTo().getId().equals(currentUser.getId());
        return entityMapper.toTaskResponse(task, projectResponse, canManage || isAssignee, canManage);
    }
}
