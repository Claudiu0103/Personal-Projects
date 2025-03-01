package IS.Proiect.showroom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ShowroomService {
    @Autowired
    private final ShowroomRepository showroomRepository;

    public ShowroomService(ShowroomRepository showroomRepository) {
        this.showroomRepository = showroomRepository;
    }

    public List<Showroom> getShowrooms() {
        return showroomRepository.findAll();
    }

    public Showroom addNewShowroom(Showroom showroom) {
        if (showroom.getName() == null || showroom.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }
        if (showroom.getLocation() == null || showroom.getLocation().trim().isEmpty()) {
            throw new IllegalArgumentException("Location cannot be null or empty");
        }
        if (showroom.getPhoneNumber() == null || showroom.getPhoneNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be null or empty");
        }
        if (showroom.getEmail() == null || showroom.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        boolean showroomExists = showroomRepository.findByName(showroom.getName()).isPresent();
        if (showroomExists) {
            throw new IllegalStateException("Showroom with name " + showroom.getName() + " already exists");
        }
        return showroomRepository.save(showroom);
    }

    public void deleteShowroom(Integer id) {
        boolean exists = showroomRepository.existsById(id);
        if (!exists) {
            throw new IllegalStateException("Showroom with id " + id + " doesn't exists");
        }
        showroomRepository.deleteById(id);
    }

    public Showroom updateShowroom(Integer id, Showroom updatedShowroom) {
        Showroom existingShowroom = showroomRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Showroom with ID " + id + " does not exist"));
        if (updatedShowroom.getName() != null) {
            existingShowroom.setName(updatedShowroom.getName());
        }
        if (updatedShowroom.getLocation() != null) {
            existingShowroom.setLocation(updatedShowroom.getLocation());
        }
        if (updatedShowroom.getPhoneNumber() != null) {
            existingShowroom.setPhoneNumber(updatedShowroom.getPhoneNumber());
        }
        if (updatedShowroom.getEmail() != null) {
            existingShowroom.setEmail(updatedShowroom.getEmail());
        }
        showroomRepository.save(existingShowroom);
        return existingShowroom;
    }
}
