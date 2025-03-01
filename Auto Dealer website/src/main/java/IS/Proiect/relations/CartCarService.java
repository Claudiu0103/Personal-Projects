package IS.Proiect.relations;

import IS.Proiect.cart.Cart;
import IS.Proiect.client.Client;
import IS.Proiect.client.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartCarService {
    private final CartCarRepository cartCarRepository;
    @Autowired
    public CartCarService(CartCarRepository cartCarRepository) {
        this.cartCarRepository = cartCarRepository;
    }
    public List<CartCar> getCartCarsByCart(Cart cart) {
        return cartCarRepository.findByCart(cart);
    }

}
