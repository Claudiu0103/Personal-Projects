package com.example.musify.dto.song;

import com.example.musify.dto.album.AlbumSimpleDTO;
import com.example.musify.dto.artist.ArtistSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SongSimpleDTO {
    private Long id;
    private String title;
    private String duration;
    private AlbumSimpleDTO album;
    private List<ArtistSimpleDTO> artists;
}
