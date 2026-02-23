package com.example.musify.dto.mapper;

import com.example.musify.dto.artist.CreatePersonDTO;
import com.example.musify.dto.artist.PersonDTO;
import com.example.musify.model.Person;

import java.time.format.DateTimeFormatter;

public class PersonMapper {

    public static PersonDTO toDTO(Person person) {
        if (person == null) return null;
        PersonDTO personDTO = PersonDTO.builder()
                .id(person.getId())
                .firstName(person.getFirstName())
                .lastName(person.getLastName())
                .stageName(person.getStageName())
                .birthday(person.getBirthday().format(DateTimeFormatter.ISO_LOCAL_DATE))
                .build();

        //BaseEntityMapper.mapToDTO(person, personDTO);
        return personDTO;
    }

    public static CreatePersonDTO toCreateDTO(Person person) {
        if (person == null) return null;

        return CreatePersonDTO.builder()
                .firstName(person.getFirstName())
                .lastName(person.getLastName())
                .stageName(person.getStageName())
                .birthday(person.getBirthday().format(DateTimeFormatter.ISO_LOCAL_DATE))
                .build();
    }

}
