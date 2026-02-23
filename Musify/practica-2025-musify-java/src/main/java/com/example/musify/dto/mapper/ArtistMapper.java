package com.example.musify.dto.mapper;

import com.example.musify.dto.artist.ArtistDTO;
import com.example.musify.dto.artist.ArtistSimpleDTO;
import com.example.musify.model.Artist;

public class ArtistMapper {

    public static ArtistDTO toDTO(Artist a) {
        return ArtistDTO.builder()
                .id(a.getId())
                .type(a.getType().name())
                .startDate(DateMapper.toDTO(a.getStartDate()))
                .endDate(DateMapper.toDTO(a.getEndDate()))
                .build();
    }

    public static Artist fromDTO(ArtistDTO artistDTO) {
        return Artist.builder()
                .id(artistDTO.getId())
                .type(Artist.ArtistType.valueOf(artistDTO.getType()))
                .startDate(DateMapper.fromDTO(artistDTO.getStartDate()))
                .endDate(DateMapper.fromDTO(artistDTO.getStartDate()))
                .build();
    }

    public static ArtistSimpleDTO toSimpleDTO(Artist artist) {
        return ArtistSimpleDTO.builder()
                .id(artist.getId())
                .type(artist.getType().name())
                .build();
    }

    public static Artist fromSimpleDTO(ArtistSimpleDTO artistSimpleDTO) {
        return Artist.builder()
                .id(artistSimpleDTO.getId())
                .type(Artist.ArtistType.valueOf(artistSimpleDTO.getType()))
                .build();
    }

}
