package com.manji.projectmanagement.controller;

import com.manji.projectmanagement.dto.dashboard.DashboardResponse;
import com.manji.projectmanagement.security.AppUserDetails;
import com.manji.projectmanagement.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(@AuthenticationPrincipal AppUserDetails userDetails) {
        return ResponseEntity.ok(dashboardService.getDashboard(userDetails.getId()));
    }
}
