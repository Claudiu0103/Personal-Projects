package IS.Proiect.relations;

import IS.Proiect.car.Car;
import IS.Proiect.cart.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartCarRepository extends JpaRepository<CartCar, Integer> {
    List<CartCar> findByCart(Cart cart);

    Optional<CartCar> findByCartAndCar(Cart cart, Car car);
}
