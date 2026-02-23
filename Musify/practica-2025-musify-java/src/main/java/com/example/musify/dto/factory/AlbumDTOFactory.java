package com.example.musify.dto.factory;

import com.example.musify.dto.album.AlbumDTO;
import com.example.musify.dto.album.AlbumsSimpleSearchDTO;
import com.example.musify.dto.artist.ArtistSimpleDTO;
import com.example.musify.dto.mapper.AlbumMapper;
import com.example.musify.dto.mapper.ArtistMapper;
import com.example.musify.model.Album;
import com.example.musify.model.Artist;
import com.example.musify.model.Band;
import com.example.musify.model.Person;
import com.example.musify.repository.BandRepository;
import com.example.musify.repository.PersonRepository;
import org.springframework.stereotype.Service;

@Service
public class AlbumDTOFactory {

    private final PersonRepository personRepository;
    private final BandRepository bandRepository;
    private final ArtistDTOFactory artistDTOFactory;

    public AlbumDTOFactory(PersonRepository personRepository, BandRepository bandRepository, ArtistDTOFactory artistDTOFactory) {
        this.personRepository = personRepository;
        this.bandRepository = bandRepository;
        this.artistDTOFactory = artistDTOFactory;
    }

    public AlbumDTO hydrate(Album album) {
        // 1) base fields + raw mappings
        AlbumDTO dto = AlbumMapper.toDTO(album);

        // 2) hydrate the artist (with person or band inside)
        Artist raw = album.getArtist();
        ArtistSimpleDTO artistSimpleDTO = ArtistMapper.toSimpleDTO(raw);
        if (raw.getType() == Artist.ArtistType.PERSON) {
            Person p = personRepository.findFirstByArtistId(raw.getId())
                    .orElseThrow(() ->
                            new RuntimeException("Person not found for artist " + raw.getId()));
            artistSimpleDTO.setName(p.getStageName());
        } else {
            Band b = bandRepository.findByArtistId(raw.getId())
                    .orElseThrow(() ->
                            new RuntimeException("Band not found for artist " + raw.getId()));
            artistSimpleDTO.setName(b.getBandName());
        }
        dto.setArtist(artistSimpleDTO);

        return dto;
    }

    public AlbumsSimpleSearchDTO simplehHydrate(Album album) {
        AlbumsSimpleSearchDTO dto = AlbumMapper.toSimpleSearchDTO(album);

        Artist raw = album.getArtist();
        ArtistSimpleDTO artistSimpleDTO = ArtistMapper.toSimpleDTO(raw);
        if (raw.getType() == Artist.ArtistType.PERSON) {
            Person p = personRepository.findFirstByArtistId(raw.getId())
                    .orElseThrow(() ->
                            new RuntimeException("Person not found for artist " + raw.getId()));
            artistSimpleDTO.setName(p.getStageName());
        } else {
            Band b = bandRepository.findByArtistId(raw.getId())
                    .orElseThrow(() ->
                            new RuntimeException("Band not found for artist " + raw.getId()));
            artistSimpleDTO.setName(b.getBandName());
        }
        dto.setArtist(artistSimpleDTO);

        return dto;
    }
}
