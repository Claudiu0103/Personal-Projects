package com.example.musify.dto.album;

import com.example.musify.dto.artist.ArtistSimpleDTO;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AlbumsSimpleSearchDTO {
    private Long id;
    private String title;
    private String genre;
    private LocalDate releaseDate;
    private ArtistSimpleDTO artist;
}
