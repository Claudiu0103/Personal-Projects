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

    public void addNewCar(Car car) {

        if (car.getPrice() <= 0) {
            throw new IllegalStateException("Invalid Price");
        }
        carRepository.save(car);
    }

    public void deleteCar(Integer id) {
        boolean exists = carRepository.existsById(id);
        if (!exists) {
            throw new IllegalStateException("Car with id " + id + " doesn't exists");
        }
        carRepository.deleteById(id);
    }

    @Transactional
    public void updateStudent(Integer id, Integer kilometers, Integer price) {
        Car car = carRepository.findById(id).orElseThrow(() -> new IllegalStateException("Car with id " + id + " doesn't exists"));
        if (kilometers != null && !Objects.equals(car.getKilometers(), kilometers)) {
            if (car.getPrice() <= 0) {
                throw new IllegalStateException("Invalid Price");
            }
            car.setKilometers(kilometers);
        }
        if (price != null && !Objects.equals(car.getPrice(), price)) {
            if (car.getKilometers() <= 0) {
                throw new IllegalStateException("Invalid number of  kilometers");
            }
            car.setPrice(price);
        }
    }
}
