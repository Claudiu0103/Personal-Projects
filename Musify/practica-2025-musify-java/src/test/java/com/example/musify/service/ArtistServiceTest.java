package com.example.musify.service;

import com.example.musify.dto.DateDTO;
import com.example.musify.dto.SimpleDateDTO;
import com.example.musify.dto.artist.*;
import com.example.musify.dto.factory.ArtistDTOFactory;
import com.example.musify.dto.song.SongSimpleDTO;
import com.example.musify.model.*;
import com.example.musify.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ArtistServiceTest {

    @Mock
    private SongRepository songRepository;

    @Mock
    private ArtistRepository artistRepository;

    @Mock
    private SongArtistRepository songArtistRepo;

    @Mock
    private ArtistDTOFactory artistDTOFactory;

    @Mock
    private SongService songService;

    @Mock
    private PersonRepository personRepository;

    @Mock
    private BandRepository bandRepository;

    @Mock
    private DateRepository dateRepository;

    @InjectMocks
    private ArtistService artistService;

    @Test
    void listOfSongsOfArtist_shouldReturnCorrectly() {
        Long artistId = 1L;

        Artist artist = new Artist();
        artist.setId(artistId);
        artist.setType(Artist.ArtistType.PERSON);

        Song song = new Song();
        song.setId(10L);
        song.setTitle("Test Song");
        song.setDuration("3:33");

        SongArtist songArtist = new SongArtist();
        songArtist.setSong(song);
        songArtist.setArtist(artist);

        song.setArtists(List.of(songArtist));

        SongSimpleDTO songSimpleDTO = SongSimpleDTO.builder()
                .id(10L)
                .title("Test Song")
                .duration("3:33")
                .artists(List.of(ArtistSimpleDTO.builder()
                        .id(artistId)
                        .type("PERSON")
                        .build()))
                .build();

        when(artistRepository.existsById(artistId)).thenReturn(true);
        when(songArtistRepo.findAllByArtistId(artistId)).thenReturn(List.of(songArtist));
        when(songArtistRepo.findAllBySongId(song.getId())).thenReturn(List.of(songArtist));
        when(artistDTOFactory.hydrateSimple(artist)).thenReturn(
                ArtistSimpleDTO.builder()
                        .id(artistId)
                        .type("PERSON")
                        .build()
        );

        List<SongSimpleDTO> result = artistService.ListOfSongsOfArtist(artistId);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Song", result.get(0).getTitle());
        assertEquals("3:33", result.get(0).getDuration());
        assertEquals(1, result.get(0).getArtists().size());
        assertEquals(artistId, result.get(0).getArtists().getFirst().getId());
        assertEquals("PERSON", result.get(0).getArtists().getFirst().getType());
    }

    @Test
    void listOfSongsOfArtist_shouldThrowExceptionWhenArtistNotFound() {
        Long artistId = 99L;

        when(artistRepository.existsById(artistId)).thenReturn(false);

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class,
                () -> artistService.ListOfSongsOfArtist(artistId));

        assertEquals("Artist not found with id: 99", exception.getMessage());
    }

    @Test
    void findArtistByName_shouldReturnMatchingArtists() {
        String searchName = "mock";

        Artist artist1 = new Artist();
        artist1.setId(1L);
        artist1.setType(Artist.ArtistType.PERSON);

        Artist artist2 = new Artist();
        artist2.setId(2L);
        artist2.setType(Artist.ArtistType.BAND);

        ArtistSimpleDTO artistSimpleDTO1 = ArtistSimpleDTO.builder()
                .id(1L)
                .type("PERSON")
                .build();

        ArtistSimpleDTO artistSimpleDTO2 = ArtistSimpleDTO.builder()
                .id(2L)
                .type("BAND")
                .build();

        when(artistRepository.findArtistsByNameContainingIgnoreCase(searchName))
                .thenReturn(List.of(artist1, artist2));

        when(artistDTOFactory.hydrateSimple(artist1)).thenReturn(artistSimpleDTO1);
        when(artistDTOFactory.hydrateSimple(artist2)).thenReturn(artistSimpleDTO2);

        List<ArtistSimpleDTO> result = artistService.findArtistByName(searchName);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getId());
        assertEquals("PERSON", result.get(0).getType());
        assertEquals(2L, result.get(1).getId());
        assertEquals("BAND", result.get(1).getType());
    }

    @Test
    void findArtistByName_shouldReturnEmptyListWhenNoMatch() {
        String searchName = "unknown";

        when(artistRepository.findArtistsByNameContainingIgnoreCase(searchName))
                .thenReturn(List.of());

        List<ArtistSimpleDTO> result = artistService.findArtistByName(searchName);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void createArtist_shouldCreatePersonSuccessfully() {
        CreatePersonDTO personDTO = new CreatePersonDTO(
                "John",
                "Doe",
                "JohnnyD",
                "1990-05-15"
        );

        SimpleDateDTO startDateDTO = new SimpleDateDTO(2000L, 1L, 1L);
        SimpleDateDTO endDateDTO = new SimpleDateDTO(2020L, 12L, 31L);

        CreateArtistDTO createArtistDTO = new CreateArtistDTO(
                "PERSON",
                startDateDTO,
                endDateDTO,
                personDTO,
                null
        );

        Artist artist = new Artist();
        artist.setId(1L);
        artist.setType(Artist.ArtistType.PERSON);

        Person person = new Person();
        person.setId(1L);
        person.setFirstName("John");
        person.setLastName("Doe");
        person.setStageName("JohnnyD");
        person.setBirthday(LocalDate.parse("1990-05-15"));

        Date startDate = new Date(1L, 2000L, 1L, 1L);
        Date endDate = new Date(2L, 2020L, 12L, 31L);

        when(dateRepository.save(any(Date.class))).thenReturn(startDate, endDate);
        when(artistRepository.save(any(Artist.class))).thenReturn(artist);
        when(personRepository.save(any(Person.class))).thenReturn(person);

        CreateArtistDTO result = artistService.createArtist(createArtistDTO);

        assertEquals("PERSON", result.getType());
        assertNotNull(result.getPerson());
        assertEquals("JohnnyD", result.getPerson().getStageName());
        assertNull(result.getBand());
    }

    @Test
    void updateArtist_success() {
        Long artistId = 1L;

        Date endDate = new Date();
        endDate.setYear(2024L);
        endDate.setMonth(6L);
        endDate.setDay(15L);

        Artist artist = new Artist();
        artist.setId(artistId);
        artist.setType(Artist.ArtistType.PERSON);

        Person person = new Person();
        person.setId(10L);
        person.setStageName("Old Name");
        person.setArtist(artist);

        ArtistDTO artistDTO = new ArtistDTO();
        DateDTO endDateDTO = new DateDTO();
        endDateDTO.setYear(2024L);
        endDateDTO.setMonth(6L);
        endDateDTO.setDay(15L);
        artistDTO.setEndDate(endDateDTO);

        PersonDTO personDTO = new PersonDTO();
        personDTO.setStageName("New Stage Name");
        personDTO.setBirthday("2003-11-24");
        artistDTO.setPerson(personDTO);

        when(artistRepository.findById(artistId)).thenReturn(Optional.of(artist));
        when(personRepository.findFirstByArtistId(artistId)).thenReturn(Optional.of(person));
        when(dateRepository.save(any(Date.class))).thenReturn(endDate);
        when(artistDTOFactory.hydrate(any(Artist.class))).thenReturn(artistDTO);

        ArtistDTO updatedArtist = artistService.updateArtist(artistId, artistDTO);

        assertNotNull(updatedArtist);
        assertEquals("New Stage Name", updatedArtist.getPerson().getStageName());
        assertEquals(2024L, updatedArtist.getEndDate().getYear());
    }

    @Test
    void updateArtist_artistNotFound_failure() {
        Long artistId = 1L;
        ArtistDTO artistDTO = new ArtistDTO();

        when(artistRepository.findById(artistId)).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class,
                () -> artistService.updateArtist(artistId, artistDTO));

        assertEquals("Artist not found with id: " + artistId, exception.getMessage());
    }


}

