package com.example.musify.service;

import com.example.musify.dto.album.*;
import com.example.musify.dto.factory.AlbumDTOFactory;
import com.example.musify.dto.factory.ArtistDTOFactory;
import com.example.musify.dto.mapper.AlbumMapper;
import com.example.musify.dto.mapper.SongMapper;
import com.example.musify.dto.song.SongSimpleDTO;
import com.example.musify.model.Album;
import com.example.musify.model.Artist;
import com.example.musify.model.Song;
import com.example.musify.repository.AlbumRepository;
import com.example.musify.repository.ArtistRepository;
import com.example.musify.repository.SongRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AlbumService {

    private final AlbumRepository albumRepository;
    private final SongRepository songRepository;
    private final ArtistRepository artistRepository;
    private final ArtistDTOFactory artistDTOFactory;
    private final AlbumDTOFactory albumDTOFactory;

    public AlbumService(AlbumRepository albumRepository, SongRepository songRepository, ArtistRepository artistRepository, ArtistDTOFactory artistDTOFactory, AlbumDTOFactory albumDTOFactory) {
        this.albumRepository = albumRepository;
        this.songRepository = songRepository;
        this.artistRepository = artistRepository;
        this.artistDTOFactory = artistDTOFactory;
        this.albumDTOFactory = albumDTOFactory;
    }

    /**
     * Fetch and hydrate all albums.
     */
    public List<AlbumDTO> getAllAlbums() {
        return albumRepository.findAllByOrderByIdAsc().stream()
                .map(albumDTOFactory::hydrate)
                .collect(Collectors.toList());
    }


    public List<SongSimpleDTO> getSongListForAlbum(Long albumId) {
        Album album = albumRepository.findById(albumId).orElseThrow(() -> new EntityNotFoundException("Album with id " + albumId + " doesn't exist!"));

        List<Song> songs = songRepository.getAllByAlbum(album);

        return songs.stream()
                .map(song -> {
                    SongSimpleDTO songSimpleDTO = SongMapper.toSimpleDTO(song);
                    songSimpleDTO.setArtists(
                            song.getArtists().stream()
                                    .map(sa -> artistDTOFactory.hydrateSimple(sa.getArtist()))
                                    .collect(Collectors.toList())
                    );
                    return songSimpleDTO;
                })
                .toList();
    }


    public AlbumDTO createAlbum(AlbumOperationDTO albumOperationDTO) {
        Album album = AlbumMapper.fromDTO(albumOperationDTO);
        Artist artist = artistRepository.findById(albumOperationDTO.getArtistId())
                .orElseThrow(() -> new EntityNotFoundException("Artist not found"));
        List<Song> songs = songRepository.findAllById(albumOperationDTO.getSongIdList());

        album.setArtist(artist);
        album.setSongs(songs);

        for (Song song : songs) {
            song.setAlbum(album);
        }
        Album createdAlbum = albumRepository.save(album);

        AlbumDTO createdAlbumDTO = AlbumMapper.toDTO(createdAlbum);
        createdAlbumDTO.setArtist(artistDTOFactory.hydrateSimple(createdAlbum.getArtist()));

        return createdAlbumDTO;
    }

    public List<AlbumSimpleDTO> getAlbumsOfArtist(Long artistId) {

        List<Album> albums = albumRepository.findAllByArtist_Id(artistId);
        return albums.stream().map(AlbumMapper::toSimpleDTO).toList();
    }

    //method for updating the title of an album
    @Transactional
    public AlbumDTO updateAlbumTitle(Long albumId, String newTitle) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new EntityNotFoundException("Album not found"));

        album.setTitle(newTitle);
        Album updatedAlbum = albumRepository.save(album);

        return albumDTOFactory.hydrate(updatedAlbum);
    }

    @Transactional
    public AlbumDTO updateAlbumDetail(Long albumId, UpdateAlbumDTO updateAlbumDTO) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new EntityNotFoundException("Album not found"));

        album.setDescription(updateAlbumDTO.getDescription());
        album.setGenre(updateAlbumDTO.getGenre());
        album.setReleaseDate(updateAlbumDTO.getReleaseDate());
        album.setLabel(updateAlbumDTO.getLabel());

        Album updatedAlbum = albumRepository.save(album);

        return albumDTOFactory.hydrate(updatedAlbum);
    }

    public List<AlbumsSimpleSearchDTO> getAlbumsByTitle(String title) {
        List<Album> foundAlbums = albumRepository.findAllByTitleContainingIgnoreCase(title);

        log.info("Found {} matching albums", foundAlbums.size());

        return foundAlbums.stream()
                .map(albumDTOFactory::simplehHydrate)
                .toList();
    }

    public AlbumDTO getAlbumById(Long id) {
        Album foundAlbum = albumRepository.findAlbumsById(id);

        if (foundAlbum == null) {
            throw new EntityNotFoundException("Album not found with id " + id);
        }

        return albumDTOFactory.hydrate(foundAlbum);
    }

    @Transactional(readOnly = true)
    public Page<AlbumDTO> findAllAlbums(Pageable pageable) {
        return albumRepository.findAllByOrderByIdAsc(pageable)
                .map(albumDTOFactory::hydrate);
    }

    @Transactional
    public void deleteAlbumForTest() {
        albumRepository.deleteByTitleContaining("Test");
    }

    public void deleteAlbumById(Long id) {
        albumRepository.deleteById(id);
    }
}
