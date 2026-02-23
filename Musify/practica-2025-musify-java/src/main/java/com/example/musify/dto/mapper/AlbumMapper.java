package com.example.musify.dto.mapper;

import com.example.musify.dto.album.AlbumDTO;
import com.example.musify.dto.album.AlbumOperationDTO;
import com.example.musify.dto.album.AlbumSimpleDTO;
import com.example.musify.dto.album.AlbumsSimpleSearchDTO;
import com.example.musify.model.Album;

public class AlbumMapper {

    public static AlbumDTO toDTO(Album album) {
        if (album == null) return null;
        AlbumDTO albumDTO = AlbumDTO.builder()
                .id(album.getId())
                .title(album.getTitle())
                .description(album.getDescription())
                .genre(album.getGenre())
                .releaseDate(album.getReleaseDate())
                .label(album.getLabel())
                .artist(ArtistMapper.toSimpleDTO(album.getArtist()))
                .build();
        return albumDTO;
    }

    public static AlbumsSimpleSearchDTO toSimpleSearchDTO(Album album) {
        if (album == null) return null;
        AlbumsSimpleSearchDTO albumDTO = AlbumsSimpleSearchDTO.builder()
                .id(album.getId())
                .title(album.getTitle())
                .genre(album.getGenre())
                .releaseDate(album.getReleaseDate())
                .artist(ArtistMapper.toSimpleDTO(album.getArtist()))
                .build();
        return albumDTO;
    }



    public static Album fromDTO(AlbumDTO albumDTO) {
        if (albumDTO == null) return null;
        return Album.builder()
                .title(albumDTO.getTitle())
                .description(albumDTO.getDescription())
                .genre(albumDTO.getGenre())
                .releaseDate(albumDTO.getReleaseDate())
                .label(albumDTO.getLabel())
                .artist(ArtistMapper.fromSimpleDTO(albumDTO.getArtist()))
                .build();
    }

    public static Album fromDTO(AlbumOperationDTO albumOperationDTO) {
        return Album.builder()
                .title(albumOperationDTO.getTitle())
                .description(albumOperationDTO.getDescription())
                .genre(albumOperationDTO.getGenre())
                .releaseDate(albumOperationDTO.getReleaseDate())
                .label(albumOperationDTO.getLabel())
                .build();
    }

    public static AlbumSimpleDTO toSimpleDTO(Album album) {
        return AlbumSimpleDTO.builder()
                .id(album.getId())
                .title(album.getTitle())
                .build();
    }

}
