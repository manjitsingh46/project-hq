package com.manji.projectmanagement.service;

import com.manji.projectmanagement.dto.project.MemberResponse;
import com.manji.projectmanagement.dto.project.ProjectResponse;
import com.manji.projectmanagement.dto.task.TaskResponse;
import com.manji.projectmanagement.dto.user.UserResponse;
import com.manji.projectmanagement.model.Project;
import com.manji.projectmanagement.model.ProjectMember;
import com.manji.projectmanagement.model.ProjectMemberRole;
import com.manji.projectmanagement.model.ProjectTask;
import com.manji.projectmanagement.model.User;
import java.time.LocalDate;
import org.springframework.stereotype.Component;

@Component
public class EntityMapper {

    public UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    public MemberResponse toMemberResponse(ProjectMember member) {
        return new MemberResponse(
                member.getUser().getId(),
                member.getUser().getName(),
                member.getUser().getEmail(),
                member.getUser().getRole(),
                member.getRole(),
                member.getJoinedAt()
        );
    }

    public MemberResponse toMemberResponse(User user, ProjectMemberRole role) {
        return new MemberResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), role, user.getCreatedAt());
    }

    public ProjectResponse toProjectResponse(
            Project project,
            MemberResponse createdBy,
            ProjectMemberRole currentRole,
            boolean canManage,
            long memberCount,
            long taskCount
    ) {
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getCreatedAt(),
                createdBy,
                currentRole,
                canManage,
                memberCount,
                taskCount
        );
    }

    public TaskResponse toTaskResponse(ProjectTask task, ProjectResponse project, boolean canEdit, boolean canDelete) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getDueDate(),
                toUserResponse(task.getAssignedTo()),
                toUserResponse(task.getCreatedBy()),
                project,
                task.getDueDate().isBefore(LocalDate.now()) && task.getStatus() != com.manji.projectmanagement.model.TaskStatus.DONE,
                canEdit,
                canDelete,
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}
