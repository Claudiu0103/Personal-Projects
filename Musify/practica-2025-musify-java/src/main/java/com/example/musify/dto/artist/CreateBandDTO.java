package com.example.musify.dto.artist;

import lombok.*;

import java.util.List;
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
public class CreateBandDTO {
    private String bandName;
    private String location;
    private List<CreatePersonDTO> members;
}