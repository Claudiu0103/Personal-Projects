package com.example.musify.dto.mapper;

import com.example.musify.dto.song.SongDTO;
import com.example.musify.dto.song.SongOperationDTO;
import com.example.musify.dto.song.SongPlaylistDTO;
import com.example.musify.dto.song.SongSimpleDTO;
import com.example.musify.model.Song;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.stream.Collectors;

public class SongMapper {

    public static SongDTO toDTO(Song song) {
        if (song == null) return null;
        SongDTO songDTO = SongDTO.builder()
                .id(song.getId())
                .title(song.getTitle())
                .duration(song.getDuration())
                .build();
        if (song.getAlternativeTitles() != null) {
            songDTO.setAlternativeTitles(song.getAlternativeTitles().stream()
                    .map(AlternativeTitleMapper::toDTO)
                    .toList());
        }
        if (song.getAlbum() != null) {
            songDTO.setAlbum(AlbumMapper.toSimpleDTO(song.getAlbum()));
        }

        return songDTO;
    }

    public static Song fromDTO(SongDTO songDTO) {
        Song song = Song.builder()
                .title(songDTO.getTitle())
                .duration(songDTO.getDuration())
                .build();
        song.setId(songDTO.getId());

        return song;
    }

    public static Song createSongFromDTO(SongOperationDTO songDTO) {
        Song song = Song.builder()
                .title(songDTO.getTitle())
                .duration(songDTO.getDuration())
                .alternativeTitles(
                        songDTO.getAlternativeTitles() != null
                                ? songDTO.getAlternativeTitles().stream()
                                .map(AlternativeTitleMapper::fromDTO)
                                .collect(Collectors.toList())
                                : Collections.emptyList()
                )
                .build();
        song.setCreationDate(LocalDateTime.now());
        return song;

    }

    public static SongSimpleDTO toSimpleDTO(Song song) {
        SongSimpleDTO songSimpleDTO = SongSimpleDTO.builder()
                .id(song.getId())
                .title(song.getTitle())
                .duration(song.getDuration())
                .artists(song.getArtists().stream()
                        .map(a -> ArtistMapper.toSimpleDTO(a.getArtist()))
                        .toList())
                .build();

        if (song.getAlbum() != null) {
            songSimpleDTO.setAlbum(AlbumMapper.toSimpleDTO(song.getAlbum()));
        }

        return songSimpleDTO;
    }

    public static Song fromSimpleDTO(SongSimpleDTO songSimpleDTO) {
        Song song = Song.builder()
                .title(songSimpleDTO.getTitle())
                .duration(songSimpleDTO.getDuration())
                .build();
        song.setId(songSimpleDTO.getId());

        return song;
    }

    public static SongPlaylistDTO toPlaylistDTO(Song song) {
        SongPlaylistDTO songPlaylistDTO = SongPlaylistDTO.builder()
                .id(song.getId())
                .title(song.getTitle())
                .duration(song.getDuration())
                .artists(song.getArtists().stream()
                        .map(a -> ArtistMapper.toSimpleDTO(a.getArtist()))
                        .toList())
                .build();

        if (song.getAlbum() != null) {
            songPlaylistDTO.setAlbum(AlbumMapper.toSimpleDTO(song.getAlbum()));
        }

        return songPlaylistDTO;
    }

}
