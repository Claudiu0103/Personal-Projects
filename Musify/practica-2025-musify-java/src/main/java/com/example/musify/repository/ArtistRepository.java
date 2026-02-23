package com.example.musify.repository;

import com.example.musify.model.Artist;
import com.example.musify.model.Song;
import com.example.musify.model.SongArtist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArtistRepository extends JpaRepository<Artist, Long> {

    @Query("SELECT DISTINCT a FROM Artist a " +
            "LEFT JOIN Person p ON p.artist.id = a.id " +
            "LEFT JOIN Band b ON b.artist.id = a.id " +
            "WHERE LOWER(p.stageName) LIKE LOWER(CONCAT('%', :name, '%')) " +
            "OR LOWER(b.bandName) LIKE LOWER(CONCAT('%', :name, '%'))")

    List<Artist> findArtistsByNameContainingIgnoreCase(String name);
    List <Artist> findAllByOrderByIdAsc();
    Page<Artist> findAllByOrderByIdAsc(Pageable pageable);

}
