package IS.Proiect.relations;

import IS.Proiect.car.Car;
import IS.Proiect.client.Client;
import IS.Proiect.client.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteCarController {
    @Autowired
    private final FavoriteCarService favoriteCarService;
    private final ClientRepository clientRepository;
    private final FavoriteCarRepository favoriteCarRepository;
    public FavoriteCarController(ClientRepository clientRepository, FavoriteCarService favoriteCarService,FavoriteCarRepository favoriteCarRepository) {
        this.clientRepository = clientRepository;
        this.favoriteCarService = favoriteCarService;
        this.favoriteCarRepository = favoriteCarRepository;
    }

    @PostMapping("/{userId}/add-car/{carId}")
    public ResponseEntity<String> addCarToFavorites(@PathVariable Integer userId, @PathVariable Integer carId) {
        Client client = clientRepository.findByIdUser(userId).orElseThrow(() -> new IllegalStateException("Client not found"));
        favoriteCarService.addCarToFavorites(client.getIdClient(), carId);
        return ResponseEntity.ok("Mașina a fost adăugată la favorite.");
    }

    @DeleteMapping("/{userId}/remove-car/{carId}")
    public ResponseEntity<String> removeCarFromFavorites(@PathVariable Integer userId, @PathVariable Integer carId) {
        Client client = clientRepository.findByIdUser(userId).orElseThrow(() -> new IllegalStateException("Client not found"));
        favoriteCarService.removeCarFromFavorites(client.getIdClient(), carId);
        return ResponseEntity.ok("Mașina a fost ștearsă din favorite.");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Car>> getFavoriteCars(@PathVariable Integer userId) {
        Client client = clientRepository.findByIdUser(userId)
                .orElseThrow(() -> new IllegalStateException("Client not found"));

        List<Car> favoriteCars = favoriteCarRepository.findByClient_IdClient(client.getIdClient())
                .stream()
                .map(FavoriteCar::getCar)
                .toList();

        return ResponseEntity.ok(favoriteCars);
    }


    @GetMapping(path = "/{userId}/exists/{carId}")
    public ResponseEntity<Boolean> isCarInFavorites(@PathVariable Integer userId, @PathVariable Integer carId) {
        Client client = clientRepository.findByIdUser(userId).orElseThrow(() -> new IllegalStateException("Client not found"));
        System.out.println("Eu sunt " + client);
        boolean exists = favoriteCarRepository.existsByClient_IdClientAndCar_IdCar(client.getIdClient(), carId);
        return ResponseEntity.ok(exists);
    }
}
