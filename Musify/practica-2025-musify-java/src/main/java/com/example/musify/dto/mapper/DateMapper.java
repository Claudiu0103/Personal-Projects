package com.example.musify.dto.mapper;

import com.example.musify.dto.DateDTO;
import com.example.musify.dto.SimpleDateDTO;
import com.example.musify.model.Date;

public class DateMapper {

    public static DateDTO toDTO(Date date) {
        if (date == null) return null;
        return DateDTO.builder()
                .id(date.getId())
                .year(date.getYear())
                .month(date.getMonth())
                .day(date.getDay())
                .build();
    }

    public static Date fromDTO(DateDTO dateDTO) {
        if (dateDTO == null) return null;
        return Date.builder()
                .id(dateDTO.getId())
                .year(dateDTO.getYear())
                .month(dateDTO.getMonth())
                .day(dateDTO.getDay())
                .build();
    }

    public static DateDTO convertSimpleDateDTOToDateDTO(SimpleDateDTO simple) {
        if (simple == null) return null;
        return DateDTO.builder()
                .id(null) // create - nu ai id încă
                .year(simple.getYear())
                .month(simple.getMonth())
                .day(simple.getDay())
                .build();
    }

    public static SimpleDateDTO convertDateDTOToSimpleDateDTO(DateDTO simple) {
        if (simple == null) return null;
        return SimpleDateDTO.builder()
                .year(simple.getYear())
                .month(simple.getMonth())
                .day(simple.getDay())
                .build();
    }

    public static SimpleDateDTO toSimpleDateDTO(Date date) {
        if (date == null) return null;
        return SimpleDateDTO.builder()
                .year(date.getYear())
                .month(date.getMonth())
                .day(date.getDay())
                .build();
    }
}
