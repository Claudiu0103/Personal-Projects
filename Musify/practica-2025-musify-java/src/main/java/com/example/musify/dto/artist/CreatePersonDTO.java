package com.example.musify.dto.artist;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
public class CreatePersonDTO {
    private String firstName;
    private String lastName;
    private String stageName;
    private String birthday; // ISO String
}