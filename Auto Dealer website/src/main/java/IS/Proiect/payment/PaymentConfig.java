package IS.Proiect.payment;

import IS.Proiect.cart.Cart;
import IS.Proiect.cart.CartRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.util.List;

@Configuration
public class PaymentConfig {
    @Bean
    @Order(7)
    CommandLineRunner commandLineRunner8(PaymentRepository repository, CartRepository cartRepository,PaymentService paymentService) {
        return args -> {
            Cart cart1 = cartRepository.findById(1).orElseThrow(() -> new IllegalStateException("Cart1 not found"));
            Payment payment1 = new Payment(1,"Constantin Noica Nr.2",paymentService.calculateDeliveryDate(),"1234567890000000","04/27","154","Gusita Claudiu",cart1);
            cart1.setPayment(payment1);
            repository.saveAll(List.of(payment1));
        };
    }
}
