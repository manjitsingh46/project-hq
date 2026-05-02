package com.manji.projectmanagement.controller;

import com.manji.projectmanagement.dto.common.MessageResponse;
import com.manji.projectmanagement.dto.common.PageResponse;
import com.manji.projectmanagement.dto.task.TaskCreateRequest;
import com.manji.projectmanagement.dto.task.TaskResponse;
import com.manji.projectmanagement.dto.task.TaskUpdateRequest;
import com.manji.projectmanagement.model.TaskStatus;
import com.manji.projectmanagement.security.AppUserDetails;
import com.manji.projectmanagement.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody TaskCreateRequest request,
            @AuthenticationPrincipal AppUserDetails userDetails
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(request, userDetails.getId()));
    }

    @GetMapping
    public ResponseEntity<PageResponse<TaskResponse>> getTasks(
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal AppUserDetails userDetails
    ) {
        return ResponseEntity.ok(taskService.getTasks(projectId, status, page, size, userDetails.getId()));
    }

    @GetMapping("/project/{id}")
    public ResponseEntity<PageResponse<TaskResponse>> getProjectTasks(
            @PathVariable Long id,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal AppUserDetails userDetails
    ) {
        return ResponseEntity.ok(taskService.getTasks(id, status, page, size, userDetails.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @RequestBody TaskUpdateRequest request,
            @AuthenticationPrincipal AppUserDetails userDetails
    ) {
        return ResponseEntity.ok(taskService.updateTask(id, request, userDetails.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal AppUserDetails userDetails
    ) {
        taskService.deleteTask(id, userDetails.getId());
        return ResponseEntity.ok(new MessageResponse("Task deleted successfully"));
    }
}
