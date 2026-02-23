package com.example.musify.dto.artist;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class BandDTO {
    private Long id;
    private String bandName;
    private String location;
    private List<PersonDTO> members;
}