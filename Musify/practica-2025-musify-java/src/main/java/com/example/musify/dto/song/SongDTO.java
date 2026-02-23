package com.example.musify.dto.song;

import com.example.musify.dto.album.AlbumSimpleDTO;
import com.example.musify.dto.artist.ArtistSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class SongDTO {
    private Long id;
    private String title;
    private String duration;
    private AlbumSimpleDTO album;
    private List<AlternativeTitleDTO> alternativeTitles;
    private List<ArtistSimpleDTO> artists;
}
