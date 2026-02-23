package com.example.musify.dto.song;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class SongOperationDTO {
    private String title;
    private String duration;
    private List<AlternativeTitleDTO> alternativeTitles;
    private List<Long> artistIds;
}
