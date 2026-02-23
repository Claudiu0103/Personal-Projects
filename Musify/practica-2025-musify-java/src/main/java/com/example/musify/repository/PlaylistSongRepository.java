package com.example.musify.repository;

import com.example.musify.model.Playlist;
import com.example.musify.model.SongPlaylist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlaylistSongRepository extends JpaRepository<SongPlaylist, Long> {

    Optional<SongPlaylist> findByPlaylistIdAndSongId(Long playlistId, Long songId);

    void deleteSongPlaylistBySongIdAndPlaylist(Long songId, Playlist playlist);
}
