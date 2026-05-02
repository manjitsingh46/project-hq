package com.manji.projectmanagement.repository;

import com.manji.projectmanagement.model.ProjectTask;
import com.manji.projectmanagement.model.TaskStatus;
import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<ProjectTask, Long> {

    @Query("""
            select t
            from ProjectTask t
            where (:projectId is null or t.project.id = :projectId)
              and (:status is null or t.status = :status)
              and (:assignedToId is null or t.assignedTo.id = :assignedToId)
            """)
    Page<ProjectTask> search(
            @Param("projectId") Long projectId,
            @Param("status") TaskStatus status,
            @Param("assignedToId") Long assignedToId,
            Pageable pageable
    );

    long countByStatus(TaskStatus status);

    long countByAssignedToId(Long assignedToId);

    long countByStatusAndAssignedToId(TaskStatus status, Long assignedToId);

    long countByProjectId(Long projectId);

    long countByDueDateBeforeAndStatusNot(LocalDate dueDate, TaskStatus status);

    long countByDueDateBeforeAndStatusNotAndAssignedToId(LocalDate dueDate, TaskStatus status, Long assignedToId);

    Page<ProjectTask> findByAssignedToId(Long assignedToId, Pageable pageable);
}
