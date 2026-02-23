package com.example.musify.dto.album;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AlbumOperationDTO {
    private String title;
    private String description;
    private String genre;
    private LocalDate releaseDate;
    private String label;
    private Long artistId;
    private List<Long> songIdList;
}
