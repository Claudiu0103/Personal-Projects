package IS.Proiect.relations;

import IS.Proiect.car.Car;
import IS.Proiect.car.CarRepository;
import IS.Proiect.client.Client;
import IS.Proiect.client.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteCarService {
    @Autowired
    private FavoriteCarRepository favoriteCarRepository;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private ClientRepository clientRepository;

    public void addCarToFavorites(Integer clientId, Integer carId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Clientul nu există."));
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Mașina nu există."));

        FavoriteCar favoriteCar = new FavoriteCar(client, car);
        favoriteCarRepository.save(favoriteCar);
    }

    public void removeCarFromFavorites(Integer clientId, Integer carId) {
        favoriteCarRepository.deleteByClient_IdClientAndCar_IdCar(clientId, carId);
    }

    public List<FavoriteCar> getFavoriteCars(Integer clientId) {
        return favoriteCarRepository.findByClient_IdClient(clientId);
    }
}
