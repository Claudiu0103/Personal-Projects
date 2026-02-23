package com.example.musify.service;

import com.example.musify.dto.factory.ArtistDTOFactory;
import com.example.musify.dto.mapper.PlaylistMapper;
import com.example.musify.dto.mapper.PlaylistSongMapper;
import com.example.musify.dto.mapper.SongMapper;
import com.example.musify.dto.mapper.UserMapper;
import com.example.musify.dto.playlist.*;
import com.example.musify.dto.song.SongPlaylistDTO;
import com.example.musify.dto.user.UserSimpleDTO;
import com.example.musify.model.*;
import com.example.musify.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static com.example.musify.dto.mapper.PlaylistMapper.toCreateDTO;

@Slf4j
@Service
public class PlaylistService {

    private final PlaylistRepository playlistRepo;
    private final UserRepository userRepo;
    private final PlaylistSongRepository playlistSongRepository;
    private final AlbumRepository albumRepo;
    private final SongRepository songRepo;
    private final ArtistDTOFactory artistDTOFactory;
    private final UserPlaylistRepository userPlaylistRepo;

    public PlaylistService(PlaylistRepository playlistRepository, UserRepository userRepo, PlaylistSongRepository playlistSongRepository, ArtistDTOFactory artistDTOFactory, AlbumRepository albumRepo, SongRepository songRepo, UserPlaylistRepository userPlaylistRepo) {
        this.playlistRepo = playlistRepository;
        this.userRepo = userRepo;
        this.playlistSongRepository = playlistSongRepository;
        this.artistDTOFactory = artistDTOFactory;
        this.albumRepo = albumRepo;
        this.songRepo = songRepo;
        this.userPlaylistRepo = userPlaylistRepo;
    }

    public List<PlaylistSimpleDTO> getFollowedPlaylists(Long userId) {
        // (Optional) verify the user exists
        userRepo.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));

        return playlistRepo
                .findAllByFollowers_User_Id(userId)
                .stream()
                .map(PlaylistMapper::toSimpleDTO)
                .toList();
    }

    public List<PlaylistDTO> getPublicPlaylistsWithSongTitles() {
        return playlistRepo.findAllByType(PlaylistType.PUBLIC).stream()
                .map(PlaylistMapper::toDTO)
                .toList();
    }

    @Transactional
    public List<PlaylistSimpleDTO> getPublicPlaylists() {
        log.info("get all public playlists");
        List<Playlist> publicPlaylists = playlistRepo.findAllByType(PlaylistType.PUBLIC);

        if (publicPlaylists.isEmpty()) {
            throw new RuntimeException("No public playlists found.");
        }
        log.info("public playlists found");
        return publicPlaylists.stream()
                .map(PlaylistMapper::toSimpleDTO)
                .toList();
    }

    public Page<PlaylistSimpleDTO> getPublicPlaylists(Pageable page) {
        Page<Playlist> publicPlaylists = playlistRepo.findAllByType(PlaylistType.PUBLIC, page);

        return publicPlaylists.map(PlaylistMapper::toSimpleDTO);
    }

    public List<SongPlaylistDTO> getSongsFromPlaylist(Long id) {
        Playlist playlist = playlistRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        List<Song> songs = playlist.getSongs().stream()
                .map(SongPlaylist::getSong)
                .toList();
        List<SongPlaylistDTO> songDTOs = new ArrayList<>();
        for (Song song : songs) {
            SongPlaylistDTO songDTO = SongMapper.toPlaylistDTO(song);
            songDTO.setArtists(artistDTOFactory.getArtistSimpleDTOsForSong(song));
            Optional<SongPlaylist> songPlaylist = playlistSongRepository.findByPlaylistIdAndSongId(id, song.getId());

            songPlaylist.ifPresent(value -> songDTO.setSongOrder(value.getSongOrder()));

            songDTOs.add(songDTO);
        }
        return songDTOs;
    }

    public List<UserSimpleDTO> getFollowersOfPlaylist(Long id) {
        Playlist playlist = playlistRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        List<User> followers = playlist.getFollowers().stream()
                .map(UserPlaylist::getUser)
                .toList();

        return followers.stream()
                .map(UserMapper::toSimpleDTO)
                .toList();
    }

    public List<PlaylistSimpleDTO> getPlaylistsByUser(Long userId, PlaylistType playlistType) {
        // (Optional) verify the user exists
        userRepo.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));

        return playlistRepo.findAllByType(playlistType).stream()
                .filter(playlist -> playlist.getOwner().equals(userRepo.findById(userId).get()))
                .map(PlaylistMapper::toSimpleDTO)
                .toList();
    }


    @Transactional
    public List<PlaylistSongDTO> swapSongOrder(Long playlistId, List<PlaylistSongDTO> dtos) {

        if (dtos == null || dtos.size() != 2) {
            throw new IllegalArgumentException("Swap operation requires 2 DTOs of PlaylistSongDTO");
        }

        PlaylistSongDTO dtoOne = dtos.get(0);
        PlaylistSongDTO dtoTwo = dtos.get(1);

        if (dtoOne.getSongSimpleDTO() == null || dtoTwo.getSongSimpleDTO() == null ||
                dtoOne.getSongSimpleDTO().getId() == null || dtoTwo.getSongSimpleDTO().getId() == null) {
            throw new IllegalArgumentException("Song DTO with a valid ID must be provided in each request DTO.");
        }

        Long songIdOne = dtoOne.getSongSimpleDTO().getId();
        Long songIdTwo = dtoTwo.getSongSimpleDTO().getId();

        Long newOrderForOne = dtoOne.getSongOrder();
        Long newOrderForTwo = dtoTwo.getSongOrder();

        if (newOrderForOne == null || newOrderForTwo == null) {
            throw new IllegalArgumentException("A new songOrder must be specified for both DTOs.");
        }

        Playlist playlist = playlistRepo.findById(playlistId)
                .orElseThrow(() -> new EntityNotFoundException("Playlist not found with ID: " + playlistId));

        SongPlaylist entryOne = playlistSongRepository.findByPlaylistIdAndSongId(playlistId, songIdOne)
                .orElseThrow(() -> new EntityNotFoundException("Song Playlist not found with ID: " + songIdOne));

        SongPlaylist entryTwo = playlistSongRepository.findByPlaylistIdAndSongId(playlistId, songIdTwo)
                .orElseThrow(() -> new EntityNotFoundException("Song Playlist not found with ID: " + songIdTwo));

        entryOne.setSongOrder(-1L);
        playlistSongRepository.saveAndFlush(entryOne);

        entryTwo.setSongOrder(newOrderForTwo);
        playlistSongRepository.saveAndFlush(entryTwo);

        entryOne.setSongOrder(newOrderForOne);

        playlist.setLastUpdated(LocalDateTime.now());

        playlistRepo.saveAndFlush(playlist);

        log.info("Successfully swapped songs with ID {} and {} in playlist {}.", songIdOne, songIdTwo, playlistId);

        return List.of(
                PlaylistSongMapper.toDTO(entryOne),
                PlaylistSongMapper.toDTO(entryTwo)
        );
    }

    @Transactional
    public void removeSongFromPlaylist(Long playlistId, Long songId) {
        Playlist playlist = playlistRepo.findPlaylistById(playlistId);

        playlistSongRepository.deleteSongPlaylistBySongIdAndPlaylist(songId, playlist);
    }

    @Transactional
    public PlaylistSimpleDTO createPlaylist(PlaylistCreateDTO request) {
        User ownerEntity = userRepo.findById(request.getOwnerId())
                .orElseThrow(() -> new EntityNotFoundException("Owner not found: " + request.getOwnerId()));

        PlaylistDTO playlistDTO = toCreateDTO(request, UserMapper.toDTO(ownerEntity));
        Playlist playlist = PlaylistMapper.fromDTO(playlistDTO, ownerEntity, List.of());

        Playlist saved = playlistRepo.save(playlist);
        return PlaylistMapper.toSimpleDTO(saved);
    }

    @Transactional
    public PlaylistSimpleDTO addItemsToPlaylist(Long playlistId, @Valid PlaylistAddDTO addItemsDTO) {
        Playlist playlist = playlistRepo.findById(playlistId)
                .orElseThrow(() -> new EntityNotFoundException("Playlist not found with ID: " + playlistId));

        List<Long> songsToAdd;

        if (addItemsDTO.getSongIds() != null) {
            songsToAdd = addItemsDTO.getSongIds();
        } else {
            Album album = albumRepo.findById(addItemsDTO.getAlbumId())
                    .orElseThrow(() -> new EntityNotFoundException("Album not found with ID: " + addItemsDTO.getAlbumId()));

            songsToAdd = album.getSongs().stream().map(Song::getId).toList();
        }

        if (songsToAdd.isEmpty()) {
            return PlaylistMapper.toSimpleDTO(playlist);
        }

        Playlist updatedPlaylist = addSongsToPlaylistHelper(playlist, songsToAdd);

        return PlaylistMapper.toSimpleDTO(updatedPlaylist);
    }

    private Playlist addSongsToPlaylistHelper(Playlist playlist, List<Long> songsToAdd) {
        Set<Long> existingSongIds = playlist.getSongs().stream()
                .map(sp -> sp.getSong().getId())
                .collect(Collectors.toSet());

        List<Long> newUniqueSongIds = songsToAdd.stream()
                .filter(id -> !existingSongIds.contains(id))
                .toList();

        if (newUniqueSongIds.isEmpty()) {
            return playlist;
        }

        List<Song> songsToActuallyAdd = songRepo.findAllById(newUniqueSongIds);

        long currentMaxOrder = playlist.getSongs().stream().mapToLong(SongPlaylist::getSongOrder).max().orElse(0L);

        for (int i = 0; i < songsToActuallyAdd.size(); i++) {
            Song song = songsToActuallyAdd.get(i);
            SongPlaylist newEntry = new SongPlaylist();
            newEntry.setPlaylist(playlist);
            newEntry.setSong(song);
            newEntry.setSongOrder(currentMaxOrder + i + 1);
            playlist.getSongs().add(newEntry);
        }
        playlist.setLastUpdated(LocalDateTime.now());

        log.info("Added {} new songs to playlist {}", songsToActuallyAdd.size(), playlist.getId());

        return playlist;
    }

    @Transactional
    public void deletePlaylist(Long playlistId, Long requesterUserId) throws AccessDeniedException {
        Playlist playlist = playlistRepo.findById(playlistId)
                .orElseThrow(() -> new EntityNotFoundException("Playlist not found with ID: " + playlistId));

        if (!playlist.getOwner().getId().equals(requesterUserId)) {
            throw new AccessDeniedException("Only the owner can delete this playlist.");
        }

        playlistRepo.delete(playlist);
    }

    @Transactional
    public void unfollowPlaylist(Long userId, Long playlistId) {
        if (!playlistRepo.existsById(playlistId)) {
            throw new EntityNotFoundException("Playlist not found with ID: " + playlistId);
        }
        userPlaylistRepo.deleteUserPlaylistByPlaylistIdAndUserId(playlistId, userId);
    }

    @Transactional
    public void followPlaylist(Long playlistId, Long userId) {
        Playlist playlist = playlistRepo.findById(playlistId)
                .orElseThrow(() -> new EntityNotFoundException("Playlist not found with ID: " + playlistId));

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        // Prevent duplicate follow
        boolean alreadyFollowing = playlist.getFollowers().stream()
                .anyMatch(up -> up.getUser().getId().equals(userId));

        if (alreadyFollowing) {
            throw new IllegalStateException("User already follows this playlist.");
        }

        UserPlaylist userPlaylist = UserPlaylist.builder()
                .user(user)
                .playlist(playlist)
                .build();

        playlist.getFollowers().add(userPlaylist); // Maintain bidirectional relationship if needed
        userPlaylistRepo.save(userPlaylist);
    }

    @Transactional(readOnly = true)
    public List<PlaylistSimpleDTO> getMyPlaylists(Long id) {
        if (!userRepo.existsById(id)) {
            throw new EntityNotFoundException("User not found with ID: " + id);
        }

        log.info("Fetching playlists owned by user {}", id);

        return playlistRepo.findAllByOwner_Id(id)
                .stream()
                .map(playlist -> PlaylistMapper.toSimpleDTO((Playlist) playlist))
                .collect(Collectors.toList());
    }

    public void deleteTestPlaylists() {
        List<Playlist> playlists = playlistRepo.findByNameContainingIgnoreCase("Test");
        playlistRepo.deleteAll(playlists);
    }

    public PlaylistDTO findPlaylistById(Long id) {
        Playlist playlist = playlistRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Playlist not found with id: " + id));
        return PlaylistMapper.toDTO(playlist);
    }

}