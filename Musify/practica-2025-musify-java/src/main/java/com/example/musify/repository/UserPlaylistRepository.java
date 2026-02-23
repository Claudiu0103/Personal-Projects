package com.example.musify.repository;
import com.example.musify.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPlaylistRepository  extends JpaRepository <UserPlaylist , Long>{
    void deleteUserPlaylistByPlaylistIdAndUserId(Long playlistId, Long userId);
}

