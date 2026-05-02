package com.manji.projectmanagement.service;

import com.manji.projectmanagement.exception.BadRequestException;
import com.manji.projectmanagement.exception.ForbiddenException;
import com.manji.projectmanagement.exception.ResourceNotFoundException;
import com.manji.projectmanagement.model.Project;
import com.manji.projectmanagement.model.ProjectMember;
import com.manji.projectmanagement.model.ProjectMemberRole;
import com.manji.projectmanagement.model.User;
import com.manji.projectmanagement.model.UserRole;
import com.manji.projectmanagement.repository.ProjectMemberRepository;
import com.manji.projectmanagement.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccessService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public boolean isGlobalAdmin(User user) {
        return user.getRole() == UserRole.ADMIN;
    }

    public Project getProject(Long projectId) {
        return projectRepository.findWithMembersById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
    }

    public Project getAccessibleProject(Long projectId, User currentUser) {
        Project project = getProject(projectId);
        if (!isProjectMember(project, currentUser) && !isGlobalAdmin(currentUser)) {
            throw new ForbiddenException("You do not have access to this project");
        }
        return project;
    }

    public void ensureProjectAdmin(Project project, User currentUser) {
        if (!isProjectAdmin(project, currentUser)) {
            throw new ForbiddenException("Only admins can manage this project");
        }
    }

    public boolean isProjectAdmin(Project project, User currentUser) {
        if (isGlobalAdmin(currentUser) || project.getCreatedBy().getId().equals(currentUser.getId())) {
            return true;
        }
        return projectMemberRepository.findByProjectIdAndUserId(project.getId(), currentUser.getId())
                .map(ProjectMember::getRole)
                .filter(role -> role == ProjectMemberRole.ADMIN)
                .isPresent();
    }

    public boolean isProjectMember(Project project, User currentUser) {
        if (project.getCreatedBy().getId().equals(currentUser.getId())) {
            return true;
        }
        return projectMemberRepository.existsByProjectIdAndUserId(project.getId(), currentUser.getId());
    }

    public ProjectMemberRole resolveProjectRole(Project project, User currentUser) {
        if (isGlobalAdmin(currentUser) || project.getCreatedBy().getId().equals(currentUser.getId())) {
            return ProjectMemberRole.ADMIN;
        }
        return projectMemberRepository.findByProjectIdAndUserId(project.getId(), currentUser.getId())
                .map(ProjectMember::getRole)
                .orElse(ProjectMemberRole.MEMBER);
    }

    public void ensureAssigneeBelongsToProject(Project project, User assignee) {
        if (project.getCreatedBy().getId().equals(assignee.getId())) {
            return;
        }
        if (!projectMemberRepository.existsByProjectIdAndUserId(project.getId(), assignee.getId())) {
            throw new BadRequestException("Assigned user must be part of the project");
        }
    }
}
