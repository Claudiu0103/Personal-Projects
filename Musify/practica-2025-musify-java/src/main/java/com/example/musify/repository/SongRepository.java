package com.example.musify.repository;

import com.example.musify.model.Album;
import com.example.musify.model.Song;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {

    List<Song> getAllByAlbum(Album album);

    @Query("""
                SELECT s
                FROM Song s
                LEFT JOIN s.playlists sp
                GROUP BY s
                ORDER BY COUNT(sp) DESC
            """)
    Page<Song> getMostWantedSongs(Pageable pageable);

    List<Song> findByTitleContainingIgnoreCase(String title);

    List<Song> findAllByOrderByIdAsc();

    Page<Song> findAllByOrderByIdAsc(Pageable pageable);
}

