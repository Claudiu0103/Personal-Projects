package IS.Proiect.car;

import IS.Proiect.showroom.Showroom;
import IS.Proiect.showroom.ShowroomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "api/car")
    @CrossOrigin(origins = "http://localhost:3000")
public class CarController {

    private final CarService carService;
    private final ShowroomRepository showroomRepository;

    @Autowired
    public CarController(CarService carService, ShowroomRepository showroomRepository) {
        this.carService = carService;
        this.showroomRepository = showroomRepository;
    }

    @GetMapping
    public List<Car> getCars() {
        return carService.getCars();
    }

    @PostMapping
    public ResponseEntity<Car> registerNewCar(@RequestBody Car car, @RequestParam Integer showroomId) {
        try {
            Showroom showroom = showroomRepository.findById(showroomId)
                    .orElseThrow(() -> new IllegalArgumentException("Showroom-ul cu ID " + showroomId + " nu există."));
            car.setShowroom(showroom);
            Car savedCar = carService.addNewCar(car);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCar);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @DeleteMapping(path = "{idCar}")
    public void deleteCar(@PathVariable("idCar") Integer id) {
        carService.deleteCar(id);
    }

    @PutMapping(path = "{idCar}")
    public ResponseEntity<Car> updateCar(@PathVariable("idCar") Integer idCar,
                                         @RequestBody Car updatedCar,
                                         @RequestParam(required = false) Integer showroomId) {
        try {
            if (showroomId != null) {
                Showroom showroom = showroomRepository.findById(showroomId)
                        .orElseThrow(() -> new IllegalArgumentException("Showroom-ul cu ID " + showroomId + " nu există."));
                updatedCar.setShowroom(showroom);
            }
            carService.updateCar(idCar, updatedCar);

            return ResponseEntity.ok(updatedCar);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


}
