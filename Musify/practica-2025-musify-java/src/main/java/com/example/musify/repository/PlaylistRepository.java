package com.example.musify.repository;

import com.example.musify.model.Playlist;
import com.example.musify.model.PlaylistType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    Playlist findPlaylistById(long id);

    List<Playlist> findAllByType(PlaylistType type);

    List<Playlist> findAllByFollowers_User_Id(Long userId);

    Collection<Object> findAllByOwner_Id(Long ownerId);

    Page<Playlist> findAllByType(PlaylistType type, Pageable pageable);

    List<Playlist> findByNameContainingIgnoreCase(String test);
}
