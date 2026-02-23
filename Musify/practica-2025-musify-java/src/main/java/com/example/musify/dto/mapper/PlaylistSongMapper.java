package com.example.musify.dto.mapper;

import com.example.musify.dto.playlist.PlaylistSongDTO;
import com.example.musify.model.SongPlaylist;

public class PlaylistSongMapper {
    public static PlaylistSongDTO toDTO(SongPlaylist songPlaylist) {
        if (songPlaylist == null) {
            return null;
        }

        PlaylistSongDTO dto = new PlaylistSongDTO();
        dto.setId(songPlaylist.getId());
        dto.setSongOrder(songPlaylist.getSongOrder());

        dto.setPlaylistSimpleDTO(PlaylistMapper.toSimpleDTO(songPlaylist.getPlaylist()));
        dto.setSongSimpleDTO(SongMapper.toSimpleDTO(songPlaylist.getSong()));

        return dto;
    }
}
