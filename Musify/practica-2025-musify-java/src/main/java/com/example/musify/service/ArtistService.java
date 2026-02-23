package com.example.musify.service;

import com.example.musify.dto.album.AlbumDTO;
import com.example.musify.dto.artist.*;
import com.example.musify.dto.factory.ArtistDTOFactory;
import com.example.musify.dto.mapper.AlbumMapper;
import com.example.musify.dto.mapper.PersonMapper;
import com.example.musify.dto.mapper.SongMapper;
import com.example.musify.dto.song.SongSimpleDTO;
import com.example.musify.model.*;
import com.example.musify.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.example.musify.dto.mapper.DateMapper.*;

@Slf4j
@Service
public class ArtistService {

    private final ArtistRepository artistRepository;
    private final PersonRepository personRepository;
    private final BandRepository bandRepository;
    private final DateRepository dateRepository;
    private final AlbumRepository albumRepository;
    private final DateTimeFormatter dateFmt = DateTimeFormatter.ISO_LOCAL_DATE;
    private final SongArtistRepository songArtistRepo;
    private final SongService songService;
    private final ArtistDTOFactory artistDTOFactory;

    public ArtistService(ArtistRepository artistRepository, PersonRepository personRepository, BandRepository bandRepository, DateRepository dateRepository, AlbumRepository albumRepository, SongArtistRepository songArtistRepo, SongService songService, ArtistDTOFactory artistDTOFactory) {
        this.artistRepository = artistRepository;
        this.personRepository = personRepository;
        this.bandRepository = bandRepository;
        this.dateRepository = dateRepository;
        this.albumRepository = albumRepository;
        this.songArtistRepo = songArtistRepo;
        this.songService = songService;
        this.artistDTOFactory = artistDTOFactory;
    }

    public List<AlbumDTO> getAlbumsOfArtist(Long artistId) {
        if (!artistRepository.existsById(artistId)) {
            throw new EntityNotFoundException("Artist with id: " + artistId + " doesn't exist!");
        }
        log.info("Listing albums for artist with ID {}", artistId);
        List<Album> albums = albumRepository.findAllByArtist_Id(artistId);
        List<AlbumDTO> dtos = new ArrayList<>();
        for (Album album : albums) {
            AlbumDTO dto = AlbumMapper.toDTO(album);
            dto.setArtist(artistDTOFactory.hydrateSimple(album.getArtist()));
            dtos.add(dto);
        }
        String albumTitles = dtos.stream()
                .map(AlbumDTO::getTitle)
                .toList()
                .toString();
        log.info("Found {} album(s): {}", dtos.size(), albumTitles);
        return dtos;
    }

    /**
     * Fetches all artists (SIMPLE), hydrates each one with its Person or Band data,
     * and returns the full list of DTOs.
     */
    public List<ArtistSimpleDTO> getAllArtistsSimple() {
        return artistRepository.findAllByOrderByIdAsc().stream()
                .map(artistDTOFactory::hydrateSimple)
                .collect(Collectors.toList());
    }

    public Page<ArtistSimpleDTO> getAllArtistsSimple(Pageable pageable) {
        return artistRepository.findAllByOrderByIdAsc(pageable)
                .map(artistDTOFactory::hydrateSimple);
    }

    public ArtistDTO findArtistById(Long id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Artist not found for id " + id));
        return artistDTOFactory.hydrate(artist);
    }

    @Transactional(readOnly = true)
    public List<ArtistSimpleDTO> findArtistByName(String name) {
        List<Artist> foundArtists = artistRepository.findArtistsByNameContainingIgnoreCase(name);

        log.info("Found {} matching artists", foundArtists.size());

        return foundArtists.stream()
                .map(artistDTOFactory::hydrateSimple)
                .collect(Collectors.toList());
    }


    public CreateArtistDTO createArtist(CreateArtistDTO dto) {

        Artist artist = new Artist();
        artist.setType(Artist.ArtistType.valueOf(dto.getType()));

        Date startDate = dateRepository.save(fromDTO(convertSimpleDateDTOToDateDTO(dto.getStartDate())));
        artist.setStartDate(startDate);

        Date endDate = null;
        if (dto.getEndDate() != null) {
            endDate = dateRepository.save(fromDTO(convertSimpleDateDTOToDateDTO(dto.getEndDate())));
            artist.setEndDate(endDate);
        }

        Artist savedArtist = artistRepository.save(artist);


        if ("PERSON".equalsIgnoreCase(dto.getType())) {
            CreatePersonDTO personDto = dto.getPerson();

            Person person = new Person();
            person.setFirstName(personDto.getFirstName());
            person.setLastName(personDto.getLastName());
            person.setStageName(personDto.getStageName());
            person.setBirthday(LocalDate.parse(personDto.getBirthday()));
            person.setCreationDate(LocalDateTime.now());
            person.setArtist(savedArtist);

            person = personRepository.save(person);

            return new CreateArtistDTO(
                    dto.getType(),
                    convertDateDTOToSimpleDateDTO(toDTO(startDate)),
                    convertDateDTOToSimpleDateDTO(toDTO(endDate)),
                    new CreatePersonDTO(
                            person.getFirstName(),
                            person.getLastName(),
                            person.getStageName(),
                            person.getBirthday().toString()
                    ),
                    null
            );

        } else if ("BAND".equalsIgnoreCase(dto.getType())) {
            CreateBandDTO bandDto = dto.getBand();

            Band band = new Band();
            band.setBandName(bandDto.getBandName());
            band.setLocation(bandDto.getLocation());
            band.setCreationDate(LocalDateTime.now());
            band.setArtist(savedArtist);

            Band savedBand = bandRepository.save(band);

            if (bandDto.getMembers() != null && !bandDto.getMembers().isEmpty()) {
                List<Person> members = bandDto.getMembers().stream().map(memberDto -> {
                    Optional<Person> existingPersonOpt = personRepository
                            .findByStageNameAndBirthday(memberDto.getStageName(), LocalDate.parse(memberDto.getBirthday()));

                    Person member;
                    if (existingPersonOpt.isPresent()) {
                        member = existingPersonOpt.get();
                        member.setBand(savedBand);
                    } else {
                        member = new Person();
                        member.setFirstName(memberDto.getFirstName());
                        member.setLastName(memberDto.getLastName());
                        member.setStageName(memberDto.getStageName());
                        member.setBirthday(LocalDate.parse(memberDto.getBirthday()));
                        member.setCreationDate(LocalDateTime.now());
                        member.setBand(savedBand);
                        member.setArtist(savedArtist);
                    }
                    return personRepository.save(member);
                }).collect(Collectors.toList());

                savedBand.setMembers(members);
                bandRepository.save(savedBand);
            }

            return new CreateArtistDTO(
                    dto.getType(),
                    convertDateDTOToSimpleDateDTO(toDTO(startDate)),
                    convertDateDTOToSimpleDateDTO(toDTO(endDate)),
                    null,
                    new CreateBandDTO(
                            savedBand.getBandName(),
                            savedBand.getLocation(),
                            Optional.ofNullable(savedBand.getMembers())
                                    .orElse(Collections.emptyList())
                                    .stream()
                                    .map(p -> new CreatePersonDTO(
                                            p.getFirstName(),
                                            p.getLastName(),
                                            p.getStageName(),
                                            p.getBirthday().toString()
                                    ))
                                    .collect(Collectors.toList())
                    )

            );
        }

        throw new IllegalArgumentException("Unknown artist type: " + dto.getType());
    }

    public List<SongSimpleDTO> ListOfSongsOfArtist(Long artistId) {
        if (!artistRepository.existsById(artistId)) {
            throw new EntityNotFoundException("Artist not found with id: " + artistId);
        }
        List<SongArtist> songArtist = songArtistRepo.findAllByArtistId(artistId);
        List<SongSimpleDTO> songDTOS = new ArrayList<>();
        for (SongArtist s : songArtist) {
            Song song = s.getSong();
            List<SongArtist> songArtistList = songArtistRepo.findAllBySongId(song.getId());
            SongSimpleDTO songDTO = SongMapper.toSimpleDTO(song);
            List<ArtistSimpleDTO> artistDTOS = new ArrayList<>();
            for (SongArtist sa : songArtistList) {
                Artist artist = sa.getArtist();
                ArtistSimpleDTO artistDTO = artistDTOFactory.hydrateSimple(artist);
                artistDTOS.add(artistDTO);
            }
            songDTO.setArtists(artistDTOS);
            songDTOS.add(songDTO);
        }
        log.info("ListOfSongsOfArtist {} songDTOS {}", artistId, songDTOS);
        return songDTOS;
    }

    @Transactional
    public ArtistDTO updateArtist(Long id, ArtistDTO artistDTO) {
        log.debug("Finding artist with ID: {}", id);
        Artist artistToUpdate = artistRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Artist not found with id: " + id));

        if (artistDTO.getEndDate() != null) {
            Date endDate = (artistToUpdate.getEndDate() != null) ? artistToUpdate.getEndDate() : new Date();
            endDate.setYear(artistDTO.getEndDate().getYear());
            endDate.setMonth(artistDTO.getEndDate().getMonth());
            endDate.setDay(artistDTO.getEndDate().getDay());
            artistToUpdate.setEndDate(dateRepository.save(endDate));
        } else {
            artistToUpdate.setEndDate(null);
        }

        if (artistToUpdate.getType() == Artist.ArtistType.PERSON) {
            Person personToUpdate = personRepository.findFirstByArtistId(id)
                    .orElseThrow(() -> new EntityNotFoundException("Person data not found for artist id: " + id));
            PersonDTO personDataFromRequest = artistDTO.getPerson();
            if (personDataFromRequest != null && personDataFromRequest.getStageName() != null) {
                log.debug("Updating stage name for person ID: {}", personToUpdate.getId());
                personToUpdate.setFirstName(personDataFromRequest.getFirstName());
                personToUpdate.setLastName(personDataFromRequest.getLastName());
                personToUpdate.setStageName(personDataFromRequest.getStageName());
                personToUpdate.setBirthday(LocalDate.parse(personDataFromRequest.getBirthday()));
            }

        } else if (artistToUpdate.getType() == Artist.ArtistType.BAND) {
            Band bandToUpdate = bandRepository.findByArtistId(id)
                    .orElseThrow(() -> new EntityNotFoundException("Band data not found for artist id: " + id));

            BandDTO bandDataFromRequest = artistDTO.getBand();
            if (bandDataFromRequest != null) {
                if (bandDataFromRequest.getBandName() != null) {
                    log.debug("Updating band name for band ID: {}", bandToUpdate.getId());
                    bandToUpdate.setBandName(bandDataFromRequest.getBandName());
                    bandToUpdate.setLocation(bandDataFromRequest.getLocation());

                    List<Person> bandMembersOld = new ArrayList<>(bandToUpdate.getMembers());
                    List<Person> bandMembersNew = personRepository.findAllById(bandDataFromRequest.getMembers().stream()
                            .map(PersonDTO::getId)
                            .toList());
                    for (Person person : bandMembersOld) {
                        if (!bandMembersNew.contains(person)) {
                            person.setBand(null);
                            personRepository.save(person);
                        }
                    }
                    for (Person person : bandMembersNew) {
                        person.setBand(bandToUpdate);
                        personRepository.save(person);
                    }
                    bandToUpdate.setMembers(bandMembersNew);
                }
            }
        }

        log.info("Artist with ID {} updated successfully.", id);
        return artistDTOFactory.hydrate(artistToUpdate);
    }

    public List<PersonDTO> getAllPersons() {
        return personRepository.findAll().stream()
                .map(PersonMapper::toDTO)
                .toList();
    }

    @Transactional
    public void deleteArtistForTest() {
        List<Long> dateIds = new ArrayList<>();

        List<Person> persons = personRepository.findByFirstNameContainingIgnoreCase("Test");
        List<Artist> personArtists = persons.stream()
                .map(Person::getArtist)
                .toList();
        personRepository.deleteAll(persons);
        for (Person person : persons) {
            Artist artist = person.getArtist();
            if (artist.getStartDate() != null) {
                dateIds.add(artist.getStartDate().getId());
            }
            if (artist.getEndDate() != null) {
                dateIds.add(artist.getEndDate().getId());
            }
        }

        List<Band> bands = bandRepository.findByBandNameContainingIgnoreCase("Test");
        List<Artist> bandArtists = bands.stream()
                .map(Band::getArtist)
                .toList();
        bandRepository.deleteAll(bands);
        for (Band band : bands) {
            Artist artist = band.getArtist();
            if (artist.getStartDate() != null) {
                dateIds.add(artist.getStartDate().getId());
            }
            if (artist.getEndDate() != null) {
                dateIds.add(artist.getEndDate().getId());
            }
        }

        artistRepository.deleteAll(personArtists);
        artistRepository.deleteAll(bandArtists);
        dateRepository.deleteAllById(dateIds);
    }


    /*public ArtistDTO findArtistById(Long id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Artist not found for id " + id));
        return artistDTOFactory.hydrate(artist);
    }*/


}