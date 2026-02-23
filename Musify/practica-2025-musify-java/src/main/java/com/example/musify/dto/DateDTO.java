package com.example.musify.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DateDTO {
    private Long id;
    private Long year;
    private Long month;
    private Long day;
}
