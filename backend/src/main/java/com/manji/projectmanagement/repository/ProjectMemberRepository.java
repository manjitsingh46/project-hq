package com.manji.projectmanagement.repository;

import com.manji.projectmanagement.model.ProjectMember;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    Optional<ProjectMember> findByProjectIdAndUserId(Long projectId, Long userId);

    boolean existsByProjectIdAndUserId(Long projectId, Long userId);

    List<ProjectMember> findByProjectIdOrderByUser_NameAsc(Long projectId);

    long countByProjectId(Long projectId);

    void deleteByProjectIdAndUserId(Long projectId, Long userId);
}
