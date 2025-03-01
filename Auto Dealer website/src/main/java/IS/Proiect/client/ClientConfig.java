package IS.Proiect.client;

import IS.Proiect.cart.Cart;
import IS.Proiect.cart.CartRepository;
import IS.Proiect.user.User;
import IS.Proiect.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.util.List;

@Configuration
public class ClientConfig {
    private UserRepository userRepository;

    @Bean
    @Order(6)
    CommandLineRunner commandLineRunner3(ClientRepository repository, UserRepository userRepository, CartRepository cartRepository) {
        return args -> {
            User user = userRepository.findById(3).orElseThrow(() -> new IllegalStateException("User not found"));
            User user2 = userRepository.findById(4).orElseThrow(() -> new IllegalStateException("User not found"));
            Cart cart1 = cartRepository.findById(1).orElseThrow(() -> new IllegalStateException("Cart1 not found"));
            Cart cart2 = cartRepository.findById(2).orElseThrow(() -> new IllegalStateException("Cart2 not found"));
            Cart cart3 = cartRepository.findById(3).orElseThrow(() -> new IllegalStateException("Cart3 not found"));

            Client vlad = new Client(1, "Vlad", "Popescu", "0726644649", "Constantin Noica Nr 2", "vladpopescu@yahoo.com", user);
            vlad.addCart(cart1);
            vlad.addCart(cart3);
            Client dan = new Client(2, "Dan", "Stefanescu", "0726644649", "Constantin Noica Nr 2", "vladpopescu@yahoo.com", user2);
            dan.addCart(cart2);
            repository.saveAll(List.of(vlad, dan));
        };
    }
}
