package IS.Proiect.car;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class CarConfig {
    @Bean
    CommandLineRunner commandLineRunner(CarRepository repository) {
        return args -> {
            Car Audi = new Car(1, 260000, "14-11-2014", "Audi A5", "Sedan", 14000, "White", 1);
            Car BMW = new Car(2, 280000, "21-05-2010", "BWM 3 Series ", "Sedan", 12000, "Black", 2);
            Car Mercedes = new Car(3, 300000, "10-03-2012", "Mercedes C-Class", "Sedan", 16000, "Black", 2);
            Car Volkswagen = new Car(4, 250000, "15-07-2016", "Volkswagen Passat", "Sedan", 12000, "Blue", 1);
            Car Ford = new Car(5, 220000, "20-10-2018", "Ford Mondeo", "Hatchback", 10000, "Red", 1);
        repository.saveAll(List.of(Audi,BMW,Mercedes,Volkswagen,Ford));
        };
    }
}
