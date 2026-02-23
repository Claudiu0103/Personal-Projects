package com.example.musify.dto.playlist;

import com.example.musify.dto.song.SongDTO;
import com.example.musify.dto.song.SongSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PlaylistSongDTO {

    private Long id;
    private PlaylistSimpleDTO playlistSimpleDTO;
    private SongSimpleDTO songSimpleDTO;
    private Long songOrder;

}
