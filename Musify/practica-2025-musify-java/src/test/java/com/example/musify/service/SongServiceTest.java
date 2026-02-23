package com.example.musify.service;

import com.example.musify.dto.artist.ArtistSimpleDTO;
import com.example.musify.dto.factory.ArtistDTOFactory;
import com.example.musify.dto.song.SongDTO;
import com.example.musify.dto.song.SongOperationDTO;
import com.example.musify.dto.song.SongSimpleDTO;
import com.example.musify.model.Artist;
import com.example.musify.model.Song;
import com.example.musify.model.SongArtist;
import com.example.musify.repository.AlbumRepository;
import com.example.musify.repository.ArtistRepository;
import com.example.musify.repository.SongRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SongServiceTest {

    @Mock
    private SongRepository songRepository;

    @Mock
    private ArtistRepository artistRepository;

    @Mock
    private AlbumRepository albumRepository;

    @Mock
    private ArtistDTOFactory artistDTOFactory;

    @InjectMocks
    private SongService songService;

    @Test
    void updateSong_success() {
        Long songId = 1L;

        SongOperationDTO songOperationDTO = new SongOperationDTO();
        songOperationDTO.setTitle("Updated Title");
        songOperationDTO.setArtistIds(List.of(10L));
        songOperationDTO.setDuration("4:20");
        songOperationDTO.setAlternativeTitles(List.of());

        Artist artist = new Artist();
        artist.setId(10L);
        artist.setType(Artist.ArtistType.PERSON);

        SongArtist songArtist = new SongArtist();
        songArtist.setArtist(artist);

        Song existingSong = new Song();
        existingSong.setId(songId);
        existingSong.setTitle("Old Title");
        existingSong.setDuration("3:30");
        List<SongArtist> existingSongArtists = new ArrayList<>();
        existingSongArtists.add(songArtist);
        existingSong.setArtists(existingSongArtists);
        existingSong.setAlternativeTitles(List.of());

        ArtistSimpleDTO artistSimpleDTO = ArtistSimpleDTO.builder()
                .id(10L)
                .type("PERSON")
                .build();

        when(songRepository.existsById(songId)).thenReturn(true);
        when(songRepository.findById(songId)).thenReturn(Optional.of(existingSong));
        when(artistDTOFactory.hydrateSimple(artist)).thenReturn(artistSimpleDTO);
        when(songRepository.save(any(Song.class))).thenReturn(existingSong);

        SongDTO result = songService.updateSong(songId, songOperationDTO);

        assertNotNull(result);
        assertEquals("Updated Title", result.getTitle());
        assertEquals("4:20", result.getDuration());
        assertEquals(1, result.getArtists().size());
        assertEquals(10L, result.getArtists().getFirst().getId());
    }

    @Test
    void updateSong_shouldThrowIfNotFound() {
        Long songId = 99L;
        SongOperationDTO operationDTO = new SongOperationDTO();
        operationDTO.setTitle("New Title");
        operationDTO.setDuration("3:45");

        when(songRepository.existsById(songId)).thenReturn(true);
        when(songRepository.findById(songId)).thenReturn(Optional.empty());

        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> songService.updateSong(songId, operationDTO));

        assertEquals("The song with id: 99 not found", ex.getMessage());
    }

    @Test
    void createSong_shouldCreateSuccessfully() {
        SongOperationDTO songOperationDTO = new SongOperationDTO();
        songOperationDTO.setTitle("Test Song");
        songOperationDTO.setDuration("3:45");
        songOperationDTO.setArtistIds(List.of(1L, 2L));

        Artist artist1 = new Artist();
        artist1.setId(1L);
        Artist artist2 = new Artist();
        artist2.setId(2L);

        when(artistRepository.findById(1L)).thenReturn(Optional.of(artist1));
        when(artistRepository.findById(2L)).thenReturn(Optional.of(artist2));
        when(songRepository.save(any(Song.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(artistDTOFactory.getArtistSimpleDTOsForSong(any(Song.class))).thenReturn(new ArrayList<>());

        SongDTO result = songService.createSong(songOperationDTO);

        assertNotNull(result);
        assertEquals("Test Song", result.getTitle());
        assertEquals("3:45", result.getDuration());
        verify(songRepository, times(1)).save(any(Song.class));
    }

    @Test
    void createSong_shouldThrowWhenArtistNotFound() {
        SongOperationDTO songOperationDTO = new SongOperationDTO();
        songOperationDTO.setTitle("Test Song");
        songOperationDTO.setDuration("3:45");
        songOperationDTO.setArtistIds(List.of(1L));

        when(artistRepository.findById(1L)).thenReturn(Optional.empty());

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class,
                () -> songService.createSong(songOperationDTO));

        assertEquals("Artist not found with id: 1", ex.getMessage());
        verify(songRepository, never()).save(any(Song.class));
    }

    @Test
    void searchSongsByTitle_shouldReturnMatchingSongs() {
        String title = "Love";

        Artist artist = new Artist();
        artist.setId(1L);
        artist.setType(Artist.ArtistType.PERSON);

        Song song = new Song();
        song.setId(10L);
        song.setTitle("Love Song");

        SongArtist songArtist = new SongArtist();
        songArtist.setSong(song);
        songArtist.setArtist(artist);
        song.setArtists(List.of(songArtist));

        ArtistSimpleDTO artistSimpleDTO = ArtistSimpleDTO.builder()
                .id(1L)
                .type("PERSON")
                .build();

        when(songRepository.findByTitleContainingIgnoreCase(title)).thenReturn(List.of(song));
        when(artistDTOFactory.hydrateSimple(artist)).thenReturn(artistSimpleDTO);

        List<SongSimpleDTO> result = songService.searchSongsByTitle(title);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Love Song", result.get(0).getTitle());
        assertEquals(1, result.get(0).getArtists().size());
        assertEquals(1L, result.get(0).getArtists().get(0).getId());
    }


}
