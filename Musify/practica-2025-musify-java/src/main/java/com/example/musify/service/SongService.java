package com.example.musify.service;

import com.example.musify.dto.artist.ArtistSimpleDTO;
import com.example.musify.dto.factory.ArtistDTOFactory;
import com.example.musify.dto.mapper.AlternativeTitleMapper;
import com.example.musify.dto.mapper.SongMapper;
import com.example.musify.dto.song.SongDTO;
import com.example.musify.dto.song.SongOperationDTO;
import com.example.musify.dto.song.SongSimpleDTO;
import com.example.musify.model.AlternativeTitle;
import com.example.musify.model.Artist;
import com.example.musify.model.Song;
import com.example.musify.model.SongArtist;
import com.example.musify.repository.ArtistRepository;
import com.example.musify.repository.SongRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
@Slf4j
public class SongService {
    private final SongRepository songRepository;
    private final ArtistDTOFactory artistDTOFactory;
    private final ArtistRepository artistRepository;

    public SongService(SongRepository songRepository, ArtistDTOFactory artistDTOFactory, ArtistRepository artistRepository) {
        this.songRepository = songRepository;
        this.artistDTOFactory = artistDTOFactory;
        this.artistRepository = artistRepository;
    }

    @Transactional(readOnly = true)
    public SongDTO findSongDTOById(Long id) {
        Song song = songRepository.findById(id).orElse(null);

        SongDTO songDTO = SongMapper.toDTO(song);
        assert song != null;
        List<ArtistSimpleDTO> artistSimpleDTOs = song.getArtists().stream()
                .map(SongArtist::getArtist)
                .map(artistDTOFactory::hydrateSimple)
                .toList();

        songDTO.setArtists(artistSimpleDTOs);

        return songDTO;
    }

    public Song retrieveSongById(Long id) {
        return songRepository.findById(id).orElseThrow(() -> new IllegalStateException("The song with id: " + id + " not found"));
    }

    public List<SongSimpleDTO> getMostWantedSongs(int limit) {
        if (limit < 1) {
            throw new EntityNotFoundException("Invalid value for query parameter limit: " + limit);
        }

        List<Song> songs = songRepository.getMostWantedSongs(PageRequest.of(0, limit)).getContent();

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

    public List<SongSimpleDTO> getSongsWithoutAlbum() {
        List<Song> songs = songRepository.getAllByAlbum(null);

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

    @Transactional
    public SongDTO updateSong(Long songId, SongOperationDTO songOperationDTO) {
        if (!songRepository.existsById(songId)) {
            throw new EntityNotFoundException("Song with id: " + songId + " not found");
        }
        log.info("Updating song with id: {}", songId);

        Song existingSong = retrieveSongById(songId);

        existingSong.setTitle(songOperationDTO.getTitle());
        existingSong.setDuration(songOperationDTO.getDuration());
        existingSong.setPlaylists(existingSong.getPlaylists());
        existingSong.setAlbum(existingSong.getAlbum());

        List<AlternativeTitle> newTitles = songOperationDTO.getAlternativeTitles().stream()
                .map(AlternativeTitleMapper::fromDTO)
                .toList();
        List<AlternativeTitle> existing = existingSong.getAlternativeTitles();
        for (AlternativeTitle newAlt : newTitles) {
            newAlt.setSong(existingSong);
            if (!existing.contains(newAlt)) {
                existing.add(newAlt);
            }
        }

        List<Long> newArtistIds = songOperationDTO.getArtistIds();
        System.out.println(newArtistIds);
        existingSong.getArtists().removeIf(sa -> !newArtistIds.contains(sa.getArtist().getId()));
        List<Long> currentArtistIds = existingSong.getArtists().stream()
                .map(sa -> sa.getArtist().getId())
                .toList();
        System.out.println(currentArtistIds);

        for (Long artistId : newArtistIds) {
            if (!currentArtistIds.contains(artistId)) {
                Artist artist = artistRepository.findById(artistId)
                        .orElseThrow(() -> new EntityNotFoundException("Artist not found: " + artistId));

                SongArtist songArtist = new SongArtist();
                songArtist.setSong(existingSong);
                songArtist.setArtist(artist);

                existingSong.getArtists().add(songArtist);
            }
        }

        SongDTO songDTOResult = SongMapper.toDTO(existingSong);
        List<ArtistSimpleDTO> artistSimpleDTOs = existingSong.getArtists().stream()
                .map(SongArtist::getArtist)
                .map(artistDTOFactory::hydrateSimple)
                .toList();

        songDTOResult.setArtists(artistSimpleDTOs);

        songRepository.save(existingSong);
        log.info("Song with id: {} updated", songId);
        return songDTOResult;
    }

    @Transactional(readOnly = true)
    public List<SongSimpleDTO> findAllSongs() {
        return songRepository.findAllByOrderByIdAsc().stream()
                .map(song -> {
                    SongSimpleDTO songSimpleDTO = SongMapper.toSimpleDTO(song);
                    songSimpleDTO.setArtists(
                            song.getArtists().stream()
                                    .map(sa -> artistDTOFactory.hydrateSimple(sa.getArtist()))
                                    .toList()
                    );
                    return songSimpleDTO;
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<SongSimpleDTO> findAllSongs(Pageable pageable) {
        return songRepository.findAllByOrderByIdAsc(pageable)
                .map(song -> {
                    SongSimpleDTO songSimpleDTO = SongMapper.toSimpleDTO(song);
                    songSimpleDTO.setArtists(
                            song.getArtists().stream()
                                    .map(sa -> artistDTOFactory.hydrateSimple(sa.getArtist()))
                                    .toList()
                    );
                    return songSimpleDTO;
                });
    }

    @Transactional
    public SongDTO createSong(SongOperationDTO songDTO) {
        log.info("Creating song");
        Song createdSong = SongMapper.createSongFromDTO(songDTO);
        createdSong.setPlaylists(new ArrayList<>());
        createdSong.setAlbum(null);
        log.info("Creating alternative titles");
        if (createdSong.getAlternativeTitles() != null) {
            createdSong.getAlternativeTitles().forEach(altTitle -> altTitle.setSong(createdSong));
        }
        System.out.println(songDTO.getArtistIds());
        log.info("Saving the song artists");
        if (songDTO.getArtistIds() != null) {
            List<SongArtist> songArtists = songDTO.getArtistIds().stream()
                    .map(artistDTO -> {
                        Artist artist = artistRepository.findById(artistDTO)
                                .orElseThrow(() -> new EntityNotFoundException("Artist not found with id: " + artistDTO));

                        SongArtist songArtist = new SongArtist();
                        songArtist.setArtist(artist);
                        songArtist.setSong(createdSong);
                        return songArtist;
                    })
                    .collect(Collectors.toList());

            createdSong.setArtists(songArtists);
        }
        log.info("Saving the song");
        Song savedSong = songRepository.save(createdSong);
        SongDTO savedSongDTO = SongMapper.toDTO(savedSong);
        savedSongDTO.setArtists(artistDTOFactory.getArtistSimpleDTOsForSong(savedSong));

        return savedSongDTO;
    }

    @Transactional(readOnly = true)
    public List<SongSimpleDTO> searchSongsByTitle(String title) {

        List<Song> foundSongs = songRepository.findByTitleContainingIgnoreCase(title);

        log.info("Found {} matching songs", foundSongs.size());

        return foundSongs.stream()
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

    public void deleteTestSongs() {
        List<Song> songs = songRepository.findByTitleContainingIgnoreCase("TestSongTitle");
        songRepository.deleteAll(songs);
    }

    @Transactional
    public void deleteSongById(Long songId) {
        if (!songRepository.existsById(songId)) {
            throw new EntityNotFoundException("Song with id: " + songId + " not found");
        }

        log.info("Deleting song with id: {}", songId);
        songRepository.deleteById(songId);
    }
}
