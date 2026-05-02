package com.manji.projectmanagement.dto.project;

import java.util.List;

public record ProjectDetailResponse(
        ProjectResponse project,
        List<MemberResponse> members
) {
}
