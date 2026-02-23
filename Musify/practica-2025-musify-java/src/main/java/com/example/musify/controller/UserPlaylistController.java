package com.example.musify.controller;

import com.example.musify.dto.playlist.PlaylistSimpleDTO;
import com.example.musify.model.PlaylistType;
import com.example.musify.service.PlaylistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/playlists")
@CrossOrigin
public class UserPlaylistController {

    private final PlaylistService service;

    public UserPlaylistController(PlaylistService service) {
        this.service = service;
    }


    @GetMapping
    public ResponseEntity<List<PlaylistSimpleDTO>> getUserPlaylists(
            @PathVariable Long userId,
            @RequestParam(name = "public") Boolean isPublic
    ) {
        PlaylistType playlistType = isPublic ? PlaylistType.PUBLIC : PlaylistType.PRIVATE;
        List<PlaylistSimpleDTO> playlistSimpleDTOs = service.getPlaylistsByUser(userId, playlistType);
        return ResponseEntity.ok(playlistSimpleDTOs);
    }


    @GetMapping("/followed")
    public ResponseEntity<List<PlaylistSimpleDTO>> listFollowed(@PathVariable Long userId) {
        List<PlaylistSimpleDTO> dtos = service.getFollowedPlaylists(userId);
        return ResponseEntity.ok(dtos);
    }

    @DeleteMapping("/unfollow/{playlistId}")
    public ResponseEntity<Void> unfollowPlaylist(
            @PathVariable Long userId,
            @PathVariable Long playlistId) {
        service.unfollowPlaylist(userId, playlistId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/follow/{playlistId}")
    public ResponseEntity<Void> followPlaylist(
            @PathVariable Long userId,
            @PathVariable Long playlistId
    ) {
        service.followPlaylist(playlistId, userId);
        return ResponseEntity.ok().build();
    }

}
