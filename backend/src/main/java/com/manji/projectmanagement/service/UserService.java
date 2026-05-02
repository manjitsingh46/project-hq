package com.manji.projectmanagement.service;

import com.manji.projectmanagement.dto.user.UserResponse;
import com.manji.projectmanagement.exception.ResourceNotFoundException;
import com.manji.projectmanagement.model.User;
import com.manji.projectmanagement.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EntityMapper entityMapper;

    public User requireUser(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public UserResponse getUserResponse(Long id) {
        return entityMapper.toUserResponse(requireUser(id));
    }

    public List<UserResponse> searchUsers(String query) {
        String search = query == null ? "" : query.trim();
        List<User> users = search.isBlank()
                ? userRepository.findAll().stream().sorted(java.util.Comparator.comparing(User::getName)).toList()
                : userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrderByNameAsc(search, search);
        return users.stream().map(entityMapper::toUserResponse).toList();
    }
}
