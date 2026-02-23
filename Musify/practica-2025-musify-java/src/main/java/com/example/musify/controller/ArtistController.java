package com.example.musify.controller;

import com.example.musify.dto.album.AlbumDTO;
import com.example.musify.dto.artist.ArtistDTO;
import com.example.musify.dto.artist.ArtistSimpleDTO;
import com.example.musify.dto.artist.CreateArtistDTO;
import com.example.musify.dto.artist.PersonDTO;
import com.example.musify.dto.song.SongSimpleDTO;
import com.example.musify.service.ArtistService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/artists")
@CrossOrigin
public class ArtistController {

    private final ArtistService artistService;

    public ArtistController(ArtistService artistService) {
        this.artistService = artistService;
    }

    /**
     * OLD FUNCTION
     * GET /api/artists
     * Returns all artists, fully hydrated (person or band data included).
     * // @GetMapping
     * public ResponseEntity<List<ArtistDTO>> getAllArtists() {
     * List<ArtistDTO> dtos = artistService.getAllArtists();
     * return ResponseEntity.ok(dtos);
     * }
     */

    ///  Correct function for getting only essential artist data
    @GetMapping
    public ResponseEntity<List<ArtistSimpleDTO>> getAllArtistsSimple() {
        List<ArtistSimpleDTO> dtos = artistService.getAllArtistsSimple();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{artistId}")
    public ResponseEntity<ArtistDTO> getArtistById(@PathVariable Long artistId) {
        ArtistDTO artistDTO = artistService.findArtistById(artistId);

        if (artistDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(artistDTO);
    }

    @GetMapping("/persons")
    public ResponseEntity<List<PersonDTO>> getAllArtistsByPerson() {
        List<PersonDTO> persons = artistService.getAllPersons();
        return ResponseEntity.ok(persons);
    }

    @GetMapping("/paginate")
    public ResponseEntity<List<ArtistSimpleDTO>> getAllArtistsPaginated(@RequestParam int offset, @RequestParam int limit) {
        Pageable pageable = PageRequest.of(offset / limit, limit);
        Page<ArtistSimpleDTO> artists= artistService.getAllArtistsSimple(pageable);
        return ResponseEntity.ok(artists.getContent());
    }


    @PostMapping
    public ResponseEntity<CreateArtistDTO> createArtist(@Valid @RequestBody CreateArtistDTO artistDto) {
        CreateArtistDTO createdArtist = artistService.createArtist(artistDto);
        return ResponseEntity.ok(createdArtist);
    }


    @GetMapping("/search")
    public ResponseEntity<List<ArtistSimpleDTO>> getArtistByName(@Valid @RequestParam String name) {
        log.info("Searching for artist with name {} in controller", name);
        List<ArtistSimpleDTO> artistDTO = artistService.findArtistByName(name);
        return ResponseEntity.ok(artistDTO);
    }


    @GetMapping("/{artistId}/songs")
    public ResponseEntity<List<SongSimpleDTO>> listOfSongs(@PathVariable Long artistId) {
        List<SongSimpleDTO> songDTOList = artistService.ListOfSongsOfArtist(artistId);
        return ResponseEntity.ok(songDTOList);
    }

    @GetMapping("/{artistId}/albums")
    public ResponseEntity<List<AlbumDTO>> getAlbumsOfArtist(@PathVariable Long artistId) {
        return ResponseEntity.ok(artistService.getAlbumsOfArtist(artistId));
    }


    @PutMapping("/{artistId}")
    public ResponseEntity<ArtistDTO> updateArtist(@PathVariable Long artistId, @Valid @RequestBody ArtistDTO artistDTO) {
        log.info("Updating artist with id {} ", artistId);
        ArtistDTO updatedArtist = artistService.updateArtist(artistId, artistDTO);
        return ResponseEntity.ok(updatedArtist);
    }

    @DeleteMapping("/test-artists")
    public ResponseEntity<Void> deleteArtistsForTest() {
        artistService.deleteArtistForTest();
        return ResponseEntity.noContent().build();
    }

}

