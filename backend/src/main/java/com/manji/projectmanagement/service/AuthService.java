package com.manji.projectmanagement.service;

import com.manji.projectmanagement.dto.auth.AuthResponse;
import com.manji.projectmanagement.dto.auth.LoginRequest;
import com.manji.projectmanagement.dto.auth.SignupRequest;
import com.manji.projectmanagement.exception.BadRequestException;
import com.manji.projectmanagement.model.User;
import com.manji.projectmanagement.model.UserRole;
import com.manji.projectmanagement.repository.UserRepository;
import com.manji.projectmanagement.security.AppUserDetails;
import com.manji.projectmanagement.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final EntityMapper entityMapper;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new BadRequestException("Email is already in use");
        }

        User user = User.builder()
                .name(request.name().trim())
                .email(request.email().trim().toLowerCase())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role() == null ? UserRole.MEMBER : request.role())
                .build();

        User savedUser = userRepository.save(user);
        AppUserDetails userDetails = AppUserDetails.fromUser(savedUser);
        return new AuthResponse(jwtService.generateToken(userDetails), entityMapper.toUserResponse(savedUser));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        User user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));
        return new AuthResponse(jwtService.generateToken(AppUserDetails.fromUser(user)), entityMapper.toUserResponse(user));
    }
}
