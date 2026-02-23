package com.example.musify.dto.album;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateAlbumDTO {

    private String description;
    private String genre;
    private LocalDate releaseDate;
    private String label;

}
