package com.example.musify.dto.mapper;

import com.example.musify.dto.song.AlternativeTitleDTO;
import com.example.musify.model.AlternativeTitle;

public class AlternativeTitleMapper {

    public static AlternativeTitleDTO toDTO(AlternativeTitle alternativeTitle) {
        return AlternativeTitleDTO.builder()
                .title(alternativeTitle.getTitle())
                .language(alternativeTitle.getLanguage())
                .build();
    }

    public static AlternativeTitle fromDTO(AlternativeTitleDTO alternativeTitleDTO) {
        return AlternativeTitle.builder()
                .title(alternativeTitleDTO.getTitle())
                .language(alternativeTitleDTO.getLanguage())
                .build();
    }

}
