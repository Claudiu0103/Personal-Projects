package IS.Proiect.car;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/car")
@CrossOrigin(origins = "http://localhost:3000")
public class CarController {

    private final CarService carService;

    @Autowired
    public CarController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping
    public List<Car> getCars() {
        return carService.getCars();
    }

    @PostMapping
    public void registerNewCar(@RequestBody Car car) {
        carService.addNewCar(car);
    }

    @DeleteMapping(path = "{idCar}")
    public void deleteCar(@PathVariable("idCar") Integer id) {
        carService.deleteCar(id);
    }

    @PutMapping(path = "{idCar}")
    public void updateCar(@PathVariable("idCar") Integer id, @RequestParam(required = false) Integer kilometers, @RequestParam(required = false) Integer price) {
        carService.updateStudent(id, kilometers, price);

    }
}
