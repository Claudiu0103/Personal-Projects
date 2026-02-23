package com.example.musify.service;

import com.example.musify.dto.playlist.PlaylistAddDTO;
import com.example.musify.dto.playlist.PlaylistSimpleDTO;
import com.example.musify.dto.playlist.PlaylistSongDTO;
import com.example.musify.dto.song.SongSimpleDTO;
import com.example.musify.model.*;
import com.example.musify.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ExtendWith(MockitoExtension.class)
class PlaylistServiceTest {

    @Mock
    private PlaylistRepository playlistRepo;

    @Mock
    private SongRepository songRepository;

    @Mock
    private AlbumRepository albumRepository;

    @Mock
    private PlaylistSongRepository playlistSongRepo;

    @Mock
    private UserPlaylistRepository userPlaylistRepo;

    @Mock
    private UserRepository userRepo;

    @InjectMocks
    private PlaylistService playlistService;

    @Test
    void getPublicPlaylists_shouldReturnPlaylists() {
        Playlist playlist = Playlist.builder()
                .name("Public Playlist")
                .type(PlaylistType.PUBLIC)
                .owner(new User())
                .build();

        when(playlistRepo.findAllByType(PlaylistType.PUBLIC)).thenReturn(List.of(playlist));

        List<PlaylistSimpleDTO> result = playlistService.getPublicPlaylists();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Public Playlist", result.getFirst().getName());
        assertEquals(PlaylistType.PUBLIC, playlist.getType());
    }

    @Test
    void getPublicPlaylists_shouldThrowWhenNoPlaylistsFound() {
        when(playlistRepo.findAllByType(PlaylistType.PUBLIC)).thenReturn(List.of());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> playlistService.getPublicPlaylists());

        assertEquals("No public playlists found.", exception.getMessage());
    }

    @Test
    void swapSongOrder_shouldSwapSuccessfully() {
        Long playlistId = 1L;
        Long songIdOne = 10L;
        Long songIdTwo = 20L;

        PlaylistSongDTO dtoOne = new PlaylistSongDTO();
        PlaylistSongDTO dtoTwo = new PlaylistSongDTO();

        SongSimpleDTO songSimpleOne = SongSimpleDTO.builder()
                .id(songIdOne)
                .title("Song One")
                .duration("200")
                .build();

        SongSimpleDTO songSimpleTwo = SongSimpleDTO.builder()
                .id(songIdTwo)
                .title("Song Two")
                .duration("180")
                .build();

        dtoOne.setSongSimpleDTO(songSimpleOne);
        dtoOne.setSongOrder(2L);
        dtoTwo.setSongSimpleDTO(songSimpleTwo);
        dtoTwo.setSongOrder(1L);

        Playlist playlist = new Playlist();
        playlist.setId(playlistId);

        SongPlaylist entryOne = new SongPlaylist();
        entryOne.setId(100L);
        entryOne.setSongOrder(1L);
        Song songOne = new Song();
        songOne.setId(songIdOne);
        songOne.setArtists(Collections.emptyList());
        entryOne.setSong(songOne);

        SongPlaylist entryTwo = new SongPlaylist();
        entryTwo.setId(200L);
        entryTwo.setSongOrder(2L);
        Song songTwo = new Song();
        songTwo.setId(songIdTwo);
        songTwo.setArtists(Collections.emptyList());
        entryTwo.setSong(songTwo);

        when(playlistRepo.findById(playlistId)).thenReturn(Optional.of(playlist));
        when(playlistSongRepo.findByPlaylistIdAndSongId(playlistId, songIdOne)).thenReturn(Optional.of(entryOne));
        when(playlistSongRepo.findByPlaylistIdAndSongId(playlistId, songIdTwo)).thenReturn(Optional.of(entryTwo));

        List<PlaylistSongDTO> result = playlistService.swapSongOrder(playlistId, List.of(dtoOne, dtoTwo));

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(dtoOne.getSongOrder(), result.get(0).getSongOrder());
        assertEquals(dtoTwo.getSongOrder(), result.get(1).getSongOrder());

        verify(playlistSongRepo, times(2)).saveAndFlush(any(SongPlaylist.class));

        verify(playlistRepo).saveAndFlush(playlist);
    }

    @Test
    void addItemsToPlaylist_shouldAddSongsByIdsSuccessfully() {
        Long playlistId = 1L;
        Long songId1 = 10L;
        Long songId2 = 20L;

        PlaylistAddDTO addDTO = new PlaylistAddDTO();
        addDTO.setSongIds(List.of(songId1, songId2));

        Playlist playlist = new Playlist();
        playlist.setId(playlistId);
        playlist.setSongs(new ArrayList<>());

        Song song1 = new Song();
        song1.setId(songId1);

        Song song2 = new Song();
        song2.setId(songId2);

        when(playlistRepo.findById(playlistId)).thenReturn(Optional.of(playlist));
        when(songRepository.findAllById(List.of(songId1, songId2)))
                .thenReturn(List.of(song1, song2));

        PlaylistSimpleDTO result = playlistService.addItemsToPlaylist(playlistId, addDTO);

        assertNotNull(result);
        verify(playlistRepo).findById(playlistId);
        verify(songRepository).findAllById(List.of(songId1, songId2));
    }


    @Test
    void addItemsToPlaylist_shouldThrowWhenAlbumNotFound() {
        Long playlistId = 1L;
        Long albumId = 99L;

        PlaylistAddDTO addDTO = new PlaylistAddDTO();
        addDTO.setAlbumId(albumId);

        Playlist playlist = new Playlist();
        playlist.setId(playlistId);

        when(playlistRepo.findById(playlistId)).thenReturn(Optional.of(playlist));
        when(albumRepository.findById(albumId)).thenReturn(Optional.empty());

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class,
                () -> playlistService.addItemsToPlaylist(playlistId, addDTO));

        assertEquals("Album not found with ID: 99", ex.getMessage());
        verify(albumRepository).findById(albumId);
    }

    @Test
    void unfollowPlaylist_shouldDeleteUserPlaylistIfExists() {
        Long playlistId = 1L;
        Long userId = 2L;

        when(playlistRepo.existsById(playlistId)).thenReturn(true);

        playlistService.unfollowPlaylist(userId, playlistId);

        verify(playlistRepo).existsById(playlistId);
        verify(userPlaylistRepo).deleteUserPlaylistByPlaylistIdAndUserId(playlistId, userId);
    }

    @Test
    void unfollowPlaylist_shouldThrowExceptionIfPlaylistDoesNotExist() {
        Long playlistId = 1L;
        Long userId = 2L;

        when(playlistRepo.existsById(playlistId)).thenReturn(false);

        assertThrows(EntityNotFoundException.class, () -> playlistService.unfollowPlaylist(userId, playlistId));

        verify(playlistRepo).existsById(playlistId);
        verifyNoInteractions(userPlaylistRepo);
    }

    @Test
    void followPlaylist_shouldAddUserPlaylistSuccessfully() {
        Long playlistId = 1L;
        Long userId = 2L;

        Playlist playlist = new Playlist();
        playlist.setId(playlistId);
        playlist.setFollowers(new ArrayList<>());

        User user = new User();
        user.setId(userId);

        when(playlistRepo.findById(playlistId)).thenReturn(Optional.of(playlist));
        when(userRepo.findById(userId)).thenReturn(Optional.of(user));

        playlistService.followPlaylist(playlistId, userId);

        verify(playlistRepo).findById(playlistId);
        verify(userRepo).findById(userId);
        verify(userPlaylistRepo).save(any(UserPlaylist.class));

        assertEquals(1, playlist.getFollowers().size());
        assertEquals(userId, playlist.getFollowers().get(0).getUser().getId());
    }

    @Test
    void followPlaylist_shouldThrowIfUserAlreadyFollowsPlaylist() {
        Long playlistId = 1L;
        Long userId = 2L;

        User user = new User();
        user.setId(userId);

        UserPlaylist existingFollow = UserPlaylist.builder()
                .user(user)
                .build();

        Playlist playlist = new Playlist();
        playlist.setId(playlistId);
        playlist.setFollowers(new ArrayList<>(List.of(existingFollow)));

        when(playlistRepo.findById(playlistId)).thenReturn(Optional.of(playlist));
        when(userRepo.findById(userId)).thenReturn(Optional.of(user));

        assertThrows(IllegalStateException.class, () -> playlistService.followPlaylist(playlistId, userId));

        verify(playlistRepo).findById(playlistId);
        verify(userRepo).findById(userId);
        verifyNoInteractions(userPlaylistRepo);
    }

    @Test
    void followPlaylist_shouldThrowIfPlaylistNotFound() {
        Long playlistId = 1L;
        Long userId = 2L;

        when(playlistRepo.findById(playlistId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> playlistService.followPlaylist(playlistId, userId));

        verify(playlistRepo).findById(playlistId);
        verifyNoInteractions(userRepo);
        verifyNoInteractions(userPlaylistRepo);
    }

    @Test
    void followPlaylist_shouldThrowIfUserNotFound() {
        Long playlistId = 1L;
        Long userId = 2L;

        Playlist playlist = new Playlist();
        playlist.setId(playlistId);
        playlist.setFollowers(new ArrayList<>());

        when(playlistRepo.findById(playlistId)).thenReturn(Optional.of(playlist));
        when(userRepo.findById(userId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> playlistService.followPlaylist(playlistId, userId));

        verify(playlistRepo).findById(playlistId);
        verify(userRepo).findById(userId);
        verifyNoInteractions(userPlaylistRepo);
    }

}