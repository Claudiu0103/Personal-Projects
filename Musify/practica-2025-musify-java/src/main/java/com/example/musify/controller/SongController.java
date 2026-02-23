package com.example.musify.controller;

import com.example.musify.dto.song.SongDTO;
import com.example.musify.dto.song.SongOperationDTO;
import com.example.musify.dto.song.SongSimpleDTO;
import com.example.musify.service.SongService;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/songs")
@CrossOrigin
public class SongController {

    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    @GetMapping("/{songId}")
    public ResponseEntity<SongDTO> findSongById(@PathVariable Long songId) {
        SongDTO song = songService.findSongDTOById(songId);
        if (song == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(song);
    }

    @PutMapping("/{songId}")
    public ResponseEntity<SongDTO> updateSong(@PathVariable Long songId, @Valid @RequestBody SongOperationDTO songOperationDTO) {
        SongDTO songDTOResult = songService.updateSong(songId, songOperationDTO);
        return ResponseEntity.ok(songDTOResult);
    }


    @PostMapping
    public ResponseEntity<SongDTO> createSong(@Valid @RequestBody SongOperationDTO songDTO) {
        SongDTO createdSongDTO = songService.createSong(songDTO);
        return ResponseEntity.ok(createdSongDTO);
    }

    @GetMapping("/most-wanted")
    public ResponseEntity<List<SongSimpleDTO>> getMostWantedSongs(@Valid @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(songService.getMostWantedSongs(limit));
    }

    @GetMapping("/no-album")
    public ResponseEntity<List<SongSimpleDTO>> getSongsWithoutAlbum() {
        return ResponseEntity.ok(songService.getSongsWithoutAlbum());
    }

    @GetMapping
    public ResponseEntity<List<SongSimpleDTO>> getAllSongs() {
        List<SongSimpleDTO> songs = songService.findAllSongs();
        return ResponseEntity.ok(songs);
    }

    @GetMapping("/paginate")
    public ResponseEntity<List<SongSimpleDTO>> getAllSongsPaginated(@RequestParam int offset, @RequestParam int limit) {
        Pageable pageable = PageRequest.of(offset / limit, limit);
        Page<SongSimpleDTO> songs = songService.findAllSongs(pageable);
        return ResponseEntity.ok(songs.getContent());
    }

    @GetMapping("/search")
    public ResponseEntity<List<SongSimpleDTO>> getSongByName(@Valid @RequestParam String title) {
        List<SongSimpleDTO> foundSongs = songService.searchSongsByTitle(title);
        return ResponseEntity.ok(foundSongs);
    }

    @DeleteMapping("/test-songs")
    public ResponseEntity<Void> deleteAllSongs() {
        songService.deleteTestSongs();
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{songId}")
    public ResponseEntity<Void> deleteSongById(@PathVariable Long songId) {
        songService.deleteSongById(songId);
        return ResponseEntity.noContent().build();
    }
}