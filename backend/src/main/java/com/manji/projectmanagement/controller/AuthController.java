package com.manji.projectmanagement.controller;

import com.manji.projectmanagement.dto.auth.AuthResponse;
import com.manji.projectmanagement.dto.auth.LoginRequest;
import com.manji.projectmanagement.dto.auth.SignupRequest;
import com.manji.projectmanagement.dto.user.UserResponse;
import com.manji.projectmanagement.security.AppUserDetails;
import com.manji.projectmanagement.service.AuthService;
import com.manji.projectmanagement.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal AppUserDetails userDetails) {
        return ResponseEntity.ok(userService.getUserResponse(userDetails.getId()));
    }
}
