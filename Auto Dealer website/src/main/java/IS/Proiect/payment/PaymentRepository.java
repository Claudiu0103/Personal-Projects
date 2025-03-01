package IS.Proiect.payment;

import IS.Proiect.cart.Cart;
import IS.Proiect.client.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Optional<Payment> findByCart(Cart cart);
    List<Payment> findByCart_Client(Client client);
}
