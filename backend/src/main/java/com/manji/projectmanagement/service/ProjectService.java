package com.manji.projectmanagement.service;

import com.manji.projectmanagement.dto.common.PageResponse;
import com.manji.projectmanagement.dto.project.MemberResponse;
import com.manji.projectmanagement.dto.project.ProjectCreateRequest;
import com.manji.projectmanagement.dto.project.ProjectDetailResponse;
import com.manji.projectmanagement.dto.project.ProjectMemberRequest;
import com.manji.projectmanagement.dto.project.ProjectResponse;
import com.manji.projectmanagement.exception.BadRequestException;
import com.manji.projectmanagement.model.Project;
import com.manji.projectmanagement.model.ProjectMember;
import com.manji.projectmanagement.model.ProjectMemberRole;
import com.manji.projectmanagement.model.User;
import com.manji.projectmanagement.repository.ProjectMemberRepository;
import com.manji.projectmanagement.repository.ProjectRepository;
import com.manji.projectmanagement.repository.TaskRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final TaskRepository taskRepository;
    private final UserService userService;
    private final AccessService accessService;
    private final EntityMapper entityMapper;

    @Transactional
    public ProjectResponse createProject(ProjectCreateRequest request, Long userId) {
        User currentUser = userService.requireUser(userId);
        Project project = Project.builder()
                .name(request.name().trim())
                .description(request.description().trim())
                .createdBy(currentUser)
                .build();

        Project savedProject = projectRepository.save(project);
        projectMemberRepository.save(ProjectMember.builder()
                .project(savedProject)
                .user(currentUser)
                .role(ProjectMemberRole.ADMIN)
                .build());

        return mapProject(savedProject, currentUser);
    }

    @Transactional(readOnly = true)
    public PageResponse<ProjectResponse> getProjects(int page, int size, Long userId) {
        User currentUser = userService.requireUser(userId);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Project> projects = accessService.isGlobalAdmin(currentUser)
                ? projectRepository.findAll(pageable)
                : projectRepository.findAccessibleProjects(currentUser.getId(), pageable);
        return PageResponse.from(projects.map(project -> mapProject(project, currentUser)));
    }

    @Transactional(readOnly = true)
    public ProjectDetailResponse getProjectDetails(Long projectId, Long userId) {
        User currentUser = userService.requireUser(userId);
        Project project = accessService.getAccessibleProject(projectId, currentUser);
        List<MemberResponse> members = projectMemberRepository.findByProjectIdOrderByUser_NameAsc(projectId).stream()
                .map(entityMapper::toMemberResponse)
                .toList();
        return new ProjectDetailResponse(mapProject(project, currentUser), members);
    }

    @Transactional
    public MemberResponse addOrUpdateMember(Long projectId, ProjectMemberRequest request, Long userId) {
        User currentUser = userService.requireUser(userId);
        Project project = accessService.getAccessibleProject(projectId, currentUser);
        accessService.ensureProjectAdmin(project, currentUser);

        User targetUser = userService.requireUser(request.userId());
        if (project.getCreatedBy().getId().equals(targetUser.getId())) {
            return entityMapper.toMemberResponse(targetUser, ProjectMemberRole.ADMIN);
        }

        ProjectMember member = projectMemberRepository.findByProjectIdAndUserId(projectId, targetUser.getId())
                .orElse(ProjectMember.builder().project(project).user(targetUser).build());
        member.setRole(request.role());
        ProjectMember savedMember = projectMemberRepository.save(member);
        return entityMapper.toMemberResponse(savedMember);
    }

    @Transactional
    public void removeMember(Long projectId, Long memberUserId, Long userId) {
        User currentUser = userService.requireUser(userId);
        Project project = accessService.getAccessibleProject(projectId, currentUser);
        accessService.ensureProjectAdmin(project, currentUser);

        if (project.getCreatedBy().getId().equals(memberUserId)) {
            throw new BadRequestException("Project creator cannot be removed");
        }
        if (!projectMemberRepository.existsByProjectIdAndUserId(projectId, memberUserId)) {
            throw new BadRequestException("Member is not part of the project");
        }
        projectMemberRepository.deleteByProjectIdAndUserId(projectId, memberUserId);
    }

    @Transactional
    public void deleteProject(Long projectId, Long userId) {
        User currentUser = userService.requireUser(userId);
        Project project = accessService.getAccessibleProject(projectId, currentUser);
        accessService.ensureProjectAdmin(project, currentUser);
        projectRepository.delete(project);
    }

    ProjectResponse mapProject(Project project, User currentUser) {
        MemberResponse owner = entityMapper.toMemberResponse(project.getCreatedBy(), ProjectMemberRole.ADMIN);
        return entityMapper.toProjectResponse(
                project,
                owner,
                accessService.resolveProjectRole(project, currentUser),
                accessService.isProjectAdmin(project, currentUser),
                projectMemberRepository.countByProjectId(project.getId()),
                taskRepository.countByProjectId(project.getId())
        );
    }
}
