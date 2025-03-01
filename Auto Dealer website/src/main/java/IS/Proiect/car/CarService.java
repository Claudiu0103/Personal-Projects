package IS.Proiect.car;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class CarService {
    @Autowired
    private final CarRepository carRepository;

    public CarService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    public List<Car> getCars() {
        return carRepository.findAll();
    }

    public Car addNewCar(Car car) {

        if (car.getPrice() <= 0) {
            throw new IllegalStateException("Invalid Price");
        }
        carRepository.save(car);
        return car;
    }

    public void deleteCar(Integer id) {
        boolean exists = carRepository.existsById(id);
        if (!exists) {
            throw new IllegalStateException("Car with id " + id + " doesn't exists");
        }
        carRepository.deleteById(id);
    }

    public void updateCar(Integer id, Car updatedCar) {
        Car car = carRepository.findById(id).orElseThrow(() -> new IllegalStateException("Car with id " + id + " doesn't exist"));
        if (updatedCar.getKilometers() != null && !Objects.equals(car.getKilometers(), updatedCar.getKilometers())) {
            if (updatedCar.getKilometers() <= 0) {
                throw new IllegalStateException("Invalid number of kilometers");
            }
            car.setKilometers(updatedCar.getKilometers());
        }
        if (updatedCar.getPrice() != null && !Objects.equals(car.getPrice(), updatedCar.getPrice())) {
            if (updatedCar.getPrice() <= 0) {
                throw new IllegalStateException("Invalid price");
            }
            car.setPrice(updatedCar.getPrice());
        }
        if (updatedCar.getModel() != null) {
            car.setModel(updatedCar.getModel());
        }
        if (updatedCar.getVehicleType() != null) {
            car.setVehicleType(updatedCar.getVehicleType());
        }
        if (updatedCar.getReleaseDate() != null) {
            car.setReleaseDate(updatedCar.getReleaseDate());
        }
        if (updatedCar.getColor() != null) {
            car.setColor(updatedCar.getColor());
        }
        if (updatedCar.getShowroom() != null) {
            car.setShowroom(updatedCar.getShowroom());
        }
        carRepository.save(car);
    }
}
