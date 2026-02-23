package com.example.musify.controller;


import com.example.musify.dto.playlist.*;
import com.example.musify.dto.song.SongPlaylistDTO;
import com.example.musify.dto.user.UserSimpleDTO;
import com.example.musify.model.User;
import com.example.musify.service.PlaylistService;
import com.example.musify.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/playlists")
@CrossOrigin
public class PlaylistController {

    private final PlaylistService playlistService;
    private final UserService userService;

    public PlaylistController(PlaylistService playlistService, UserService userService) {
        this.playlistService = playlistService;
        this.userService = userService;
    }

    @GetMapping("/public")
    public ResponseEntity<List<PlaylistSimpleDTO>> getPublicPlaylists() {
        log.info("Getting all public playlists");
        List<PlaylistSimpleDTO> playlists = playlistService.getPublicPlaylists();
        return ResponseEntity.ok(playlists);
    }

    @GetMapping("/public/paginate")
    public ResponseEntity<List<PlaylistSimpleDTO>> getPublicPaginatedPlaylists(@RequestParam int offset, @RequestParam int limit) {
        Pageable pageable = PageRequest.of(offset / limit, limit);

        Page<PlaylistSimpleDTO> playlists = playlistService.getPublicPlaylists(pageable);
        return ResponseEntity.ok(playlists.getContent());
    }

    @GetMapping("/{playlistId}/songs")
    public ResponseEntity<List<SongPlaylistDTO>> getSongsInPlaylist(@PathVariable Long playlistId) {
        List<SongPlaylistDTO> songs = playlistService.getSongsFromPlaylist(playlistId);
        return ResponseEntity.ok(songs);
    }

    @GetMapping("me/owned")
    public ResponseEntity<List<PlaylistSimpleDTO>> getOwnedPlaylists() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        String userEmail;

        if (principal instanceof UserDetails) {
            userEmail = ((UserDetails) principal).getUsername();
        } else {
            userEmail = principal.toString();
        }

        User currentUser = userService.findUserByEmail(userEmail);

        log.info("Getting followed playlists for authenticated user: {}", currentUser.getEmail());
        List<PlaylistSimpleDTO> playlists = playlistService.getMyPlaylists(currentUser.getId());
        return ResponseEntity.ok(playlists);
    }

    @GetMapping("/me/followed")
    public ResponseEntity<List<PlaylistSimpleDTO>> getFollowedPlaylists() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Object principal = authentication.getPrincipal();
        String userEmail;

        if (principal instanceof UserDetails) {
            userEmail = ((UserDetails) principal).getUsername();
        } else {
            userEmail = principal.toString();
        }

        User currentUser = userService.findUserByEmail(userEmail);

        log.info("Getting followed playlists for authenticated user: {}", currentUser.getEmail());
        List<PlaylistSimpleDTO> playlists = playlistService.getFollowedPlaylists(currentUser.getId());
        return ResponseEntity.ok(playlists);
    }

    @GetMapping("/{playlistId}/followers")
    public ResponseEntity<List<UserSimpleDTO>> getFollowersOfPlaylist(@PathVariable Long playlistId) {
        List<UserSimpleDTO> followers = playlistService.getFollowersOfPlaylist(playlistId);
        return ResponseEntity.ok(followers);
    }

    @PutMapping("/{playlistId}/songs/swap")
    public ResponseEntity<List<PlaylistSongDTO>> swapSongOrder(
            @PathVariable Long playlistId,
            @RequestBody List<PlaylistSongDTO> dtos) {

        log.info("Request to update song order in playlist {}", playlistId);

        List<PlaylistSongDTO> updatedDtos = playlistService.swapSongOrder(playlistId, dtos);

        return ResponseEntity.ok(updatedDtos);
    }

    @DeleteMapping("{playlistId}/songs/{songId}")
    public ResponseEntity<Void> removeSongFromPlayist(@PathVariable Long playlistId, @PathVariable Long songId) {
        playlistService.removeSongFromPlaylist(playlistId, songId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/create")
    public ResponseEntity<PlaylistSimpleDTO> createPlaylist(@RequestBody PlaylistCreateDTO request) {
        PlaylistSimpleDTO created = playlistService.createPlaylist(request);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/{playlistId}/songs")
    public ResponseEntity<PlaylistSimpleDTO> addItemsToPlaylist(
            @PathVariable Long playlistId,
            @Valid @RequestBody PlaylistAddDTO addItemsDTO) {

        log.info("Request to add items to playlist {}", playlistId);
        PlaylistSimpleDTO updatedPlaylist = playlistService.addItemsToPlaylist(playlistId, addItemsDTO);
        return ResponseEntity.ok(updatedPlaylist);
    }

    @DeleteMapping("/delete/{playlistId}")
    public ResponseEntity<Void> deletePlaylist(@PathVariable Long playlistId) throws AccessDeniedException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Object principal = authentication.getPrincipal();
        String userEmail;

        if (principal instanceof UserDetails) {
            userEmail = ((UserDetails) principal).getUsername();
        } else {
            userEmail = principal.toString();
        }

        User currentUser = userService.findUserByEmail(userEmail);

        playlistService.deletePlaylist(playlistId, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<PlaylistDTO> getPlaylistById(@PathVariable Long id) {
        PlaylistDTO dto = playlistService.findPlaylistById(id);
        return ResponseEntity.ok(dto);
    }


    @DeleteMapping("/test-playlists")
    public ResponseEntity<Void> deleteAllPlaylists() {
        playlistService.deleteTestPlaylists();
        return ResponseEntity.noContent().build();
    }

}
