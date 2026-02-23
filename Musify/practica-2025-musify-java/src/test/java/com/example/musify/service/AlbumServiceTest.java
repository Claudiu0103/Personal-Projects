package com.example.musify.service;

import com.example.musify.dto.album.AlbumDTO;
import com.example.musify.dto.album.AlbumOperationDTO;
import com.example.musify.dto.album.AlbumSimpleDTO;
import com.example.musify.dto.album.UpdateAlbumDTO;
import com.example.musify.dto.artist.ArtistDTO;
import com.example.musify.dto.artist.ArtistSimpleDTO;
import com.example.musify.dto.factory.AlbumDTOFactory;
import com.example.musify.dto.factory.ArtistDTOFactory;
import com.example.musify.dto.mapper.AlbumMapper;
import com.example.musify.dto.song.SongSimpleDTO;
import com.example.musify.model.Album;
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
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AlbumServiceTest {

    @Mock
    private AlbumRepository albumRepository;
    @Mock
    private SongRepository songRepository;
    @Mock
    private ArtistRepository artistRepository;
    @Mock
    private ArtistDTOFactory artistDTOFactory;
    @Mock
    private AlbumDTOFactory albumDTOFactory;
    @InjectMocks
    private AlbumService albumService;

    @Test
    void getSongListForAlbum_success() throws Exception {
        Long albumId = 1L;
        Album mockAlbum = new Album();
        mockAlbum.setId(albumId);

        Song mockSong = new Song();
        mockSong.setId(10L);
        mockSong.setTitle("Mock song");

        Artist mockArtist = new Artist();
        mockArtist.setId(100L);
        mockArtist.setType(Artist.ArtistType.PERSON);

        SongArtist mockSongArtist = new SongArtist();
        mockSongArtist.setArtist(mockArtist);
        mockSongArtist.setSong(mockSong);

        mockSong.setArtists(List.of(mockSongArtist));

        when(albumRepository.findById(albumId)).thenReturn(Optional.of(mockAlbum));
        when(songRepository.getAllByAlbum(mockAlbum)).thenReturn(List.of(mockSong));
        when(artistDTOFactory.hydrateSimple(mockArtist)).thenReturn(
                ArtistSimpleDTO.builder().id(mockArtist.getId()).type(mockArtist.getType().name()).build()
        );

        List<SongSimpleDTO> result = albumService.getSongListForAlbum(albumId);

        assertEquals(1, result.size());
        assertEquals("Mock song", result.getFirst().getTitle());
        assertEquals(1, result.getFirst().getArtists().size());
        assertEquals(mockArtist.getId(), result.getFirst().getArtists().getFirst().getId());
    }



    @Test
    void getSongListForAlbum_failure() throws Exception {
        Long albumId = 42L;

        when(albumRepository.findById(albumId)).thenReturn(Optional.empty());
        Exception exception = assertThrows(Exception.class, () -> albumService.getSongListForAlbum(albumId));

        assertEquals("Album with id 42 doesn't exist!", exception.getMessage());
    }

    @Test
    void createAlbum_success() {
        Long artistId = 1L;
        Long songId = 1L;

        Artist artist = new Artist();
        artist.setId(artistId);
        artist.setType(Artist.ArtistType.PERSON);

        Song song = new Song();
        song.setId(songId);
        song.setTitle("Mock song");

        Album album = new Album();
        album.setId(10L);
        album.setTitle("Mock album");
        album.setArtist(artist);
        album.setSongs(List.of(song));

        AlbumOperationDTO albumOperationDTO = AlbumOperationDTO.builder()
                .title("Mock album")
                .artistId(artistId)
                .songIdList(List.of(songId))
                .build();

        ArtistSimpleDTO artistSimpleDTO = ArtistSimpleDTO.builder()
                .id(artistId)
                .type("PERSON")
                .build();

        when(artistRepository.findById(artistId)).thenReturn(Optional.of(artist));
        when(songRepository.findAllById(List.of(songId))).thenReturn(List.of(song));
        when(albumRepository.save(any(Album.class))).thenReturn(album);
        when(artistDTOFactory.hydrateSimple(any(Artist.class))).thenReturn(artistSimpleDTO);

        AlbumDTO result = albumService.createAlbum(albumOperationDTO);

        assertNotNull(result);
        assertEquals(album.getId(), result.getId());
        assertEquals("Mock album", result.getTitle());
        assertNotNull(result.getArtist());
        assertEquals(artistId, result.getArtist().getId());
    }



    @Test
    void createAlbum_failure() {
        Long artistId = 42L;
        AlbumOperationDTO albumOperationDTO = AlbumOperationDTO.builder()
                .artistId(artistId)
                .songIdList(List.of())
                .build();

        when(artistRepository.findById(artistId)).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class,
                () -> albumService.createAlbum(albumOperationDTO));

        assertEquals("Artist not found", exception.getMessage());
    }

    @Test
    void getAlbumsOfArtistFound() {
        Long artistId = 1L;

        Artist artist = new Artist();
        artist.setId(artistId);
        artist.setType(Artist.ArtistType.PERSON);

        Album album = new Album();
        album.setId(10L);
        album.setTitle("Mock album");
        album.setArtist(artist);
        album.setSongs(new ArrayList<>());

        when(albumRepository.findAllByArtist_Id(artistId)).thenReturn(List.of(album));

        List<AlbumSimpleDTO> result = albumService.getAlbumsOfArtist(artistId);

        assertNotNull(result);
        assertEquals(1, result.size());

        AlbumSimpleDTO resultAlbum = result.getFirst();
        assertEquals(10L, resultAlbum.getId());
        assertEquals("Mock album", resultAlbum.getTitle());
    }


    @Test
    void getAlbumsOfArtistEmpty() {
        Long artistId = 42L;

        when(albumRepository.findAllByArtist_Id(artistId)).thenReturn(List.of());

        List<AlbumSimpleDTO> result = albumService.getAlbumsOfArtist(artistId);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }


    @Test
    void updateAlbumDetail_Successfully() {
        Long albumId = 1L;

        UpdateAlbumDTO updateAlbumDTO = UpdateAlbumDTO.builder()
                .description("New description")
                .genre("Rock")
                .label("Universal")
                .releaseDate(LocalDate.of(2024, 5, 10))
                .build();

        Artist mockArtist = Artist.builder()
                .id(100L)
                .type(Artist.ArtistType.PERSON)
                .startDate(new com.example.musify.model.Date())
                .build();

        Album existingAlbum = new Album();
        existingAlbum.setId(albumId);
        existingAlbum.setDescription("Old description");
        existingAlbum.setGenre("Pop");
        existingAlbum.setLabel("Sony");
        existingAlbum.setReleaseDate(LocalDate.of(2020, 1, 1));
        existingAlbum.setArtist(mockArtist);
        existingAlbum.setSongs(new ArrayList<>());

        Album updatedAlbum = new Album();
        updatedAlbum.setId(albumId);
        updatedAlbum.setDescription(updateAlbumDTO.getDescription());
        updatedAlbum.setGenre(updateAlbumDTO.getGenre());
        updatedAlbum.setLabel(updateAlbumDTO.getLabel());
        updatedAlbum.setReleaseDate(updateAlbumDTO.getReleaseDate());
        updatedAlbum.setArtist(mockArtist);
        updatedAlbum.setSongs(new ArrayList<>());

        Mockito.when(albumRepository.findById(albumId)).thenReturn(Optional.of(existingAlbum));
        Mockito.when(albumRepository.save(any(Album.class))).thenReturn(updatedAlbum);
        Mockito.when(albumDTOFactory.hydrate(updatedAlbum)).thenReturn(AlbumMapper.toDTO(updatedAlbum));

        AlbumDTO result = albumService.updateAlbumDetail(albumId, updateAlbumDTO);

        assertEquals("New description", result.getDescription());
        assertEquals("Rock", result.getGenre());
        assertEquals("Universal", result.getLabel());
        assertEquals(LocalDate.of(2024, 5, 10), result.getReleaseDate());
    }



    @Test
    void updateAlbumDetail_AlbumNotFound() {
        Long albumId = 99L;

        UpdateAlbumDTO updateAlbumDTO = UpdateAlbumDTO.builder()
                .description("Doesn't matter")
                .build();

        Mockito.when(albumRepository.findById(albumId)).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class,
                () -> albumService.updateAlbumDetail(albumId, updateAlbumDTO));

        assertEquals("Album not found", exception.getMessage());
    }

    @Test
    void updateAlbumTitle_Successfully() {
        Long albumId = 1L;
        String newTitle = "New Album Title";

        Album existingAlbum = new Album();
        existingAlbum.setId(albumId);
        existingAlbum.setTitle("Old Title");

        Album updatedAlbum = new Album();
        updatedAlbum.setId(albumId);
        updatedAlbum.setTitle(newTitle);

        AlbumDTO updatedAlbumDTO = AlbumDTO.builder()
                .id(albumId)
                .title(newTitle)
                .build();

        Mockito.when(albumRepository.findById(albumId)).thenReturn(Optional.of(existingAlbum));
        Mockito.when(albumRepository.save(existingAlbum)).thenReturn(updatedAlbum);
        Mockito.when(albumDTOFactory.hydrate(updatedAlbum)).thenReturn(updatedAlbumDTO);

        AlbumDTO result = albumService.updateAlbumTitle(albumId, newTitle);

        assertNotNull(result);
        assertEquals(albumId, result.getId());
        assertEquals(newTitle, result.getTitle());
    }

    @Test
    void updateAlbumTitle_AlbumNotFound() {
        Long albumId = 99L;
        String newTitle = "New Title";

        Mockito.when(albumRepository.findById(albumId)).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class,
                () -> albumService.updateAlbumTitle(albumId, newTitle));

        assertEquals("Album not found", exception.getMessage());
    }

}
