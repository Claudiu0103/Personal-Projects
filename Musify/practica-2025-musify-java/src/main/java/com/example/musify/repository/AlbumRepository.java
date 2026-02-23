package com.example.musify.repository;

import com.example.musify.model.Album;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Long> {
    List<Album> findAllByArtist_Id(Long artistId);

    List<Album> findAllByTitleContainingIgnoreCase(String title);

    Album findAlbumsById(Long id);

    List<Album> findAllByOrderByIdAsc();

    Page<Album> findAllByOrderByIdAsc(Pageable pageable);

    void deleteByTitleContaining(String test);
}
