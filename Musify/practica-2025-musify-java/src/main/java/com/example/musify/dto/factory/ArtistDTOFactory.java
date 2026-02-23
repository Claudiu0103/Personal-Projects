package com.example.musify.dto.factory;

import com.example.musify.dto.SimpleDateDTO;
import com.example.musify.dto.artist.*;
import com.example.musify.dto.mapper.ArtistMapper;
import com.example.musify.dto.mapper.PersonMapper;
import com.example.musify.model.Artist;
import com.example.musify.model.Band;
import com.example.musify.model.Person;
import com.example.musify.model.Song;
import com.example.musify.repository.BandRepository;
import com.example.musify.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.example.musify.dto.mapper.DateMapper.toSimpleDateDTO;

@Service
public class ArtistDTOFactory {
    private final PersonRepository personRepository;
    private final BandRepository bandRepository;

    public ArtistDTOFactory(PersonRepository personRepository, BandRepository bandRepository) {
        this.personRepository = personRepository;
        this.bandRepository = bandRepository;
    }

    public List<ArtistSimpleDTO> getArtistSimpleDTOsForSong(Song song) {
        return song.getArtists().stream()
                .map(sa -> this.hydrateSimple(sa.getArtist()))
                .toList();
    }

    public ArtistDTO hydrate(Artist artist) {
        ArtistDTO dto = ArtistMapper.toDTO(artist);

        if (artist.getType() == Artist.ArtistType.PERSON) {
            Person p = personRepository.findFirstByArtistId(artist.getId())
                    .orElseThrow(() -> new RuntimeException("Person not found for artist " + artist.getId()));
            dto.setPerson(PersonMapper.toDTO(p));
        } else if (artist.getType() == Artist.ArtistType.BAND) {
            Band b = bandRepository.findByArtistId(artist.getId())
                    .orElseThrow(() -> new RuntimeException("Band not found for artist " + artist.getId()));
            List<PersonDTO> members = b.getMembers().stream()
                    .map(PersonMapper::toDTO)
                    .toList();
            dto.setBand(new BandDTO(b.getId(), b.getBandName(), b.getLocation(), members));
        }

        return dto;
    }

    public ArtistSimpleDTO hydrateSimple(Artist artist) {
        ArtistSimpleDTO dto = ArtistMapper.toSimpleDTO(artist);

        if (artist.getType() == Artist.ArtistType.PERSON) {
            Person p = personRepository.findFirstByArtistId(artist.getId())
                    .orElseThrow(() -> new RuntimeException("Person not found for artist " + artist.getId()));
            dto.setName(p.getStageName());
        } else if (artist.getType() == Artist.ArtistType.BAND) {
            Band b = bandRepository.findByArtistId(artist.getId())
                    .orElseThrow(() -> new RuntimeException("Band not found for artist " + artist.getId()));
            dto.setName(b.getBandName());
        }

        return dto;
    }

    public CreateArtistDTO hydrateCreateDTO(Artist artist) {
        CreateArtistDTO dto = new CreateArtistDTO();
        dto.setType(artist.getType().name());
        dto.setStartDate(toSimpleDateDTO(artist.getStartDate()));
        dto.setEndDate(toSimpleDateDTO(artist.getEndDate()));

        if (artist.getType() == Artist.ArtistType.PERSON) {
            Person p = personRepository.findFirstByArtistId(artist.getId())
                    .orElseThrow(() -> new RuntimeException("Person not found for artist " + artist.getId()));
            dto.setPerson(PersonMapper.toCreateDTO(p));
        } else if (artist.getType() == Artist.ArtistType.BAND) {
            Band b = bandRepository.findByArtistId(artist.getId())
                    .orElseThrow(() -> new RuntimeException("Band not found for artist " + artist.getId()));

            List<CreatePersonDTO> members = b.getMembers().stream()
                    .map(PersonMapper::toCreateDTO)
                    .toList();

            CreateBandDTO createBandDTO = CreateBandDTO.builder()
                    .bandName(b.getBandName())
                    .location(b.getLocation())
                    .members(members)
                    .build();

            dto.setBand(createBandDTO);
        }

        return dto;
    }

}
