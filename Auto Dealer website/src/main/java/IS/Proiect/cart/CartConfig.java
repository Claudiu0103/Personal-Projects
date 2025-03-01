package IS.Proiect.cart;

import IS.Proiect.car.Car;
import IS.Proiect.car.CarRepository;
import IS.Proiect.cart.Cart;
import IS.Proiect.user.User;
import IS.Proiect.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@Configuration
public class CartConfig {
    @Bean
    @Order(5)
    CommandLineRunner commandLineRunner6(CartRepository repository, CarRepository carRepository) {
        return args -> {
            Cart cart1 = new Cart(1);
            Cart cart2 = new Cart(2);
            Cart cart3 = new Cart(3);
            repository.saveAll(List.of(cart1, cart2, cart3));
        };
    }
}
