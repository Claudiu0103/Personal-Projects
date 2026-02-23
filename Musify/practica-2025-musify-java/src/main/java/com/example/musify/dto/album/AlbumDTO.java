package com.example.musify.dto.album;

import com.example.musify.dto.artist.ArtistSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AlbumDTO {
    private Long id;
    private String title;
    private String description;
    private String genre;
    private LocalDate releaseDate;
    private String label;
    private ArtistSimpleDTO artist;
}