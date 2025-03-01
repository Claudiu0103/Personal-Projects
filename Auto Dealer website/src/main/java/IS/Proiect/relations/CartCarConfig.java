package IS.Proiect.relations;

import IS.Proiect.cart.Cart;
import IS.Proiect.cart.CartRepository;
import IS.Proiect.car.Car;
import IS.Proiect.car.CarRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.util.List;

@Configuration
public class CartCarConfig {

    @Bean
    @Order(6)
    CommandLineRunner commandLineRunnerCartCar(CartRepository cartRepository, CarRepository carRepository, CartCarRepository cartCarRepository) {
        return args -> {
            // Găsim coșuri și mașini existente
            Cart cart1 = cartRepository.findById(1).orElseThrow(() -> new RuntimeException("Cart 1 not found"));
            Cart cart2 = cartRepository.findById(2).orElseThrow(() -> new RuntimeException("Cart 2 not found"));
            Cart cart3 = cartRepository.findById(3).orElseThrow(() -> new RuntimeException("Cart 3 not found"));

            Car car1 = carRepository.findById(1).orElseThrow(() -> new RuntimeException("Car 1 not found"));
            Car car2 = carRepository.findById(2).orElseThrow(() -> new RuntimeException("Car 2 not found"));
            Car car3 = carRepository.findById(3).orElseThrow(() -> new RuntimeException("Car 3 not found"));

            CartCar relation1 = new CartCar();
            relation1.setCart(cart1);
            relation1.setCar(car1);

            CartCar relation2 = new CartCar();
            relation2.setCart(cart1);
            relation2.setCar(car2);

            CartCar relation3 = new CartCar();
            relation3.setCart(cart2);
            relation3.setCar(car3);

            CartCar relation4 = new CartCar();
            relation4.setCart(cart3);
            relation4.setCar(car1);

            CartCar relation5 = new CartCar();
            relation5.setCart(cart2);
            relation5.setCar(car1);

            CartCar relation6 = new CartCar();
            relation6.setCart(cart3);
            relation6.setCar(car3);

            cartCarRepository.saveAll(List.of(relation1, relation2, relation3, relation4, relation5, relation6));
        };
    }
}
