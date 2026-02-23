package com.example.musify.dto.artist;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;


@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PersonDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String stageName;
    private String birthday;      // ISO date string

}