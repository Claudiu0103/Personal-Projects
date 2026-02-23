package com.example.musify.repository;

import com.example.musify.model.Band;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BandRepository extends JpaRepository<Band, Long> {
    Optional<Band> findByArtistId(Long artistId);

    List<Band> findByBandNameContainingIgnoreCase(String test);
}