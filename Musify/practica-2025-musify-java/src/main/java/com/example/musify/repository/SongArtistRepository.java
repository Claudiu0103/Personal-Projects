package com.example.musify.repository;
import com.example.musify.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SongArtistRepository extends JpaRepository <SongArtist, Long>{
    List<SongArtist> findAllByArtistId(Long id);

    List<SongArtist> findAllBySongId(Long songId);
}
