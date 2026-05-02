package com.manji.projectmanagement.repository;

import com.manji.projectmanagement.model.Project;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Override
    @EntityGraph(attributePaths = {"createdBy"})
    Page<Project> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"createdBy"})
    @Query("""
            select distinct p
            from Project p
            left join p.members m
            where p.createdBy.id = :userId or m.user.id = :userId
            """)
    Page<Project> findAccessibleProjects(@Param("userId") Long userId, Pageable pageable);

    @EntityGraph(attributePaths = {"createdBy", "members", "members.user"})
    Optional<Project> findWithMembersById(Long id);
}
