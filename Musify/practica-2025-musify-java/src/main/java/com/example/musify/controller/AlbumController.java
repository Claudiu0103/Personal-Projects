package com.example.musify.controller;

import com.example.musify.dto.album.*;
import com.example.musify.dto.song.SongSimpleDTO;
import com.example.musify.service.AlbumService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Pageable;
import java.util.List;

@RestController
@RequestMapping("/api/albums")
@CrossOrigin
public class AlbumController {

    private final AlbumService albumService;

    public AlbumController(AlbumService albumService) {
        this.albumService = albumService;
    }

    @GetMapping("/songs/{albumId}")
    public ResponseEntity<List<SongSimpleDTO>> getSongListForAlbum(@PathVariable Long albumId) {
        List<SongSimpleDTO> songList = albumService.getSongListForAlbum(albumId);
        return ResponseEntity.ok(songList);
    }

    /**
     * GET /api/albums
     * -> List of all albums, fully hydrated.
     */
    @GetMapping
    public ResponseEntity<List<AlbumDTO>> getAllAlbums() {
        List<AlbumDTO> dtos = albumService.getAllAlbums();
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/title/{albumId}")
    public ResponseEntity<AlbumDTO> updateAlbumTitle(@PathVariable Long albumId, @Valid @RequestParam("newAlbumTitle") String newAlbumTitle) {
        AlbumDTO updatedAlbum = albumService.updateAlbumTitle(albumId, newAlbumTitle);
        return ResponseEntity.ok(updatedAlbum);
    }

    @PutMapping("/detail/{albumId}")
    public ResponseEntity<AlbumDTO> updateAlbumDetail(@PathVariable Long albumId, @Valid @RequestBody UpdateAlbumDTO updateAlbumDTO) {
        AlbumDTO updatedAlbum = albumService.updateAlbumDetail(albumId, updateAlbumDTO);
        return ResponseEntity.ok(updatedAlbum);
    }

    @PostMapping
    public ResponseEntity<AlbumDTO> createAlbum(@Valid @RequestBody AlbumOperationDTO albumOperationDTO) {
        AlbumDTO createdAlbum = albumService.createAlbum(albumOperationDTO);
        return ResponseEntity.ok(createdAlbum);
    }

    @GetMapping("/search")
    public ResponseEntity<List<AlbumsSimpleSearchDTO>> getAlbumsByName(@Valid @RequestParam String title) {
        List<AlbumsSimpleSearchDTO> foundAlbums = albumService.getAlbumsByTitle(title);
        return ResponseEntity.ok(foundAlbums);
    }

    @GetMapping("/search/{albumId}")
    public ResponseEntity<AlbumDTO> getAlbumsById(@PathVariable  Long albumId) {
        AlbumDTO foundAlbums = albumService.getAlbumById(albumId);
        return ResponseEntity.ok(foundAlbums);
    }

    @GetMapping("/paginate")
    public ResponseEntity<List<AlbumDTO>> getAllAlbumsPaginated(@RequestParam int offset, @RequestParam int limit) {
        Pageable pageable = PageRequest.of(offset / limit, limit);
        Page<AlbumDTO> foundAlbums = albumService.findAllAlbums(pageable);
        return ResponseEntity.ok(foundAlbums.getContent());
    }

    @DeleteMapping("/test-albums")
    public ResponseEntity<Void> deleteAlbumsForTest() {
        albumService.deleteAlbumForTest();
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlbumById(@PathVariable Long id) {
        albumService.deleteAlbumById(id);
        return ResponseEntity.noContent().build();
    }
}
