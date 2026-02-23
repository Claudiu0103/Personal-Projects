package com.example.musify.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
public class SimpleDateDTO {
    private Long year;
    private Long month;
    private Long day;
}
