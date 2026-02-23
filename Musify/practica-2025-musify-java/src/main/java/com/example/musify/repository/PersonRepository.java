package com.example.musify.repository;

import com.example.musify.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PersonRepository extends JpaRepository<Person, Long> {
    Optional<Person> findFirstByArtistId(Long artistId);

    Optional<Person> findByStageNameAndBirthday(String stageName, LocalDate birthday);

    List<Person> findByFirstNameContainingIgnoreCase(String test);
}