package com.ssafy.api.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class ProjectDto {
    private Long id;
    private String title;
    private String collectStatus;     // ING, END
    private int size;
    private List<PositionDto> positions;
    private String description;
    private String startDate;
    private String endDate;
    private Long likes;
    private Long hostId;
    private Long hit;

    public ProjectDto(Long id, String title, String collectStatus, int size, List<PositionDto> positions,
                      String description, String startDate, String endDate, Long likes, Long hostId, Long hit) {
        this.id = id;
        this.title = title;
        this.collectStatus = collectStatus;
        this.size = size;
        this.positions = positions;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.likes = likes;
        this.hostId = hostId;
        this.hit = hit;
    }
}
