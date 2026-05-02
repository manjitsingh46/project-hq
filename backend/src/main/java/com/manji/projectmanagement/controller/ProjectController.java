package com.manji.projectmanagement.controller;

import com.manji.projectmanagement.dto.common.MessageResponse;
import com.manji.projectmanagement.dto.common.PageResponse;
import com.manji.projectmanagement.dto.project.MemberResponse;
import com.manji.projectmanagement.dto.project.ProjectCreateRequest;
import com.manji.projectmanagement.dto.project.ProjectDetailResponse;
import com.manji.projectmanagement.dto.project.ProjectMemberRequest;
import com.manji.projectmanagement.dto.project.ProjectResponse;
import com.manji.projectmanagement.security.AppUserDetails;
import com.manji.projectmanagement.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody ProjectCreateRequest request,
            @AuthenticationPrincipal AppUserDetails userDetails
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(request, userDetails.getId()));
    }

    @GetMapping
    public ResponseEntity<PageResponse<ProjectResponse>> getProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal AppUserDetails userDetails
    ) {
        return ResponseEntity.ok(projectService.getProjects(page, size, userDetails.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDetailResponse> getProject(
            @PathVariable Long id,
            @AuthenticationPrincipal AppUserDetails userDetails
    ) {
        return ResponseEntity.ok(projectService.getProjectDetails(id, userDetails.getId()));
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<MemberResponse> addOrUpdateMember(
            @PathVariable Long id,
            @Valid @RequestBody ProjectMemberRequest request,
            @AuthenticationPrincipal AppUserDetails userDetails
    ) {
        return ResponseEntity.ok(projectService.addOrUpdateMember(id, request, userDetails.getId()));
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<MessageResponse> removeMember(
            @PathVariable Long id,
            @PathVariable Long userId,
            @AuthenticationPrincipal AppUserDetails userDetails
    ) {
        projectService.removeMember(id, userId, userDetails.getId());
        return ResponseEntity.ok(new MessageResponse("Member removed successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteProject(
            @PathVariable Long id,
            @AuthenticationPrincipal AppUserDetails userDetails
    ) {
        projectService.deleteProject(id, userDetails.getId());
        return ResponseEntity.ok(new MessageResponse("Project deleted successfully"));
    }
}
