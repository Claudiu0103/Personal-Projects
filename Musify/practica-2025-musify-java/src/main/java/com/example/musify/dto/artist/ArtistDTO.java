package com.example.musify.dto.artist;

import com.example.musify.dto.DateDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArtistDTO {
    private Long id;
    private String type;
    private DateDTO startDate;
    private DateDTO endDate;

    private PersonDTO person;
    private BandDTO band;
}
