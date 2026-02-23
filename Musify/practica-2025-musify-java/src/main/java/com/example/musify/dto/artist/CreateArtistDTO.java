package com.example.musify.dto.artist;

import com.example.musify.dto.SimpleDateDTO;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
public class CreateArtistDTO {
    private String type; // "PERSON" sau "BAND"
    private SimpleDateDTO startDate;
    private SimpleDateDTO endDate;
    private CreatePersonDTO person;
    private CreateBandDTO band;
}