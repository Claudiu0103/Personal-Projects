package com.example.musify.dto.mapper;

import com.example.musify.dto.artist.BandDTO;
import com.example.musify.model.Band;

public class BandMapper {

    public static BandDTO toDTO(Band band) {
        if (band == null) return null;
        BandDTO bandDTO = BandDTO.builder()
                .id(band.getId())
                .bandName(band.getBandName())
                .location(band.getLocation())
                .members(band.getMembers().stream()
                        .map(PersonMapper::toDTO)
                        .toList())
                .build();
        //BaseEntityMapper.mapToDTO(band, bandDTO);
        return bandDTO;
    }

}
