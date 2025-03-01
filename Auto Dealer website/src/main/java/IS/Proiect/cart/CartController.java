package IS.Proiect.cart;

import IS.Proiect.car.Car;
import IS.Proiect.payment.Payment;
import IS.Proiect.payment.PaymentRequest;
import IS.Proiect.payment.PaymentService;
import IS.Proiect.relations.CartCar;
import IS.Proiect.relations.CartCarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final CartService cartService;
    private final PaymentService paymentService;
    private final CartRepository cartRepository;
    private final CartCarRepository cartCarRepository;

    @Autowired
    public CartController(CartService cartService, PaymentService paymentService, CartRepository cartRepository, CartCarRepository cartCarRepository) {
        this.cartService = cartService;
        this.paymentService = paymentService;
        this.cartRepository = cartRepository;
        this.cartCarRepository = cartCarRepository;
    }

    @GetMapping
    public List<Cart> getCarts() {
        return cartService.getCarts();
    }

    @GetMapping("/{cartId}/cart-cars")
    public ResponseEntity<List<CartCar>> getCartCars(@PathVariable Integer cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found"));
        List<CartCar> cartCars = cartCarRepository.findByCart(cart);
        System.out.println("CartCars for Cart ID " + cartId + ": " + cartCars);
        return ResponseEntity.ok(cartCars);
    }


    @GetMapping(path = "{idCart}/cars")
    public ResponseEntity<?> getCars(@PathVariable Integer idCart) {
        try {
            List<Car> cars = cartService.getCarsFromCart(idCart);
            return ResponseEntity.ok(cars);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<Cart> registerNewCart(@RequestBody Cart cart) {
        try {
            Cart savedCart = cartService.addNewCart(cart);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCart);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PostMapping("/{cartId}/add-car/{carId}")
    public ResponseEntity<?> addCarToCart(@PathVariable Integer cartId, @PathVariable Integer carId) {
        try {
            cartService.addCarToCart(cartId, carId);
            return ResponseEntity.ok("Car added to cart successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{cartId}/remove-car/{carId}")
    public ResponseEntity<?> removeCarFromCart(@PathVariable Integer cartId, @PathVariable Integer carId) {
        try {
            cartService.removeCarFromCart(cartId, carId);
            return ResponseEntity.ok("Car removed from cart successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping(path = "{idCart}")
    public ResponseEntity<?> deleteCart(@PathVariable("idCart") Integer id) {
        try {
            cartService.deleteCart(id);
            return ResponseEntity.ok("Cart deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    @PutMapping(path = "{idCart}")
    public ResponseEntity<Cart> updateCart(
            @PathVariable("idCart") Integer idCart,
            @RequestBody Cart updatedCart) {
        try {
            cartService.updateCart(idCart, updatedCart);
            return ResponseEntity.ok(updatedCart);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PostMapping("/{cartId}/create-payment")
    public ResponseEntity<Map<String, String>> createPayment(
            @PathVariable Integer cartId,
            @RequestBody PaymentRequest paymentRequest) {
        try {
            Payment payment = cartService.createPayment(cartId, paymentRequest);

            Map<String, String> response = new HashMap<>();
            response.put("idPayment", payment.getIdPayment().toString());
            response.put("shippingAddress", payment.getShippingAddress());
            response.put("dateOfDelivery", payment.getDateOfDelivery());
            response.put("cardNumber", payment.getCardNumber());
            response.put("expiryDate", payment.getExpiryDate());
            response.put("cvv", payment.getCvv());
            response.put("cardHolderName", payment.getCardHolderName());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @DeleteMapping("/{cartId}/clear")
    public ResponseEntity<?> clearCart(@PathVariable Integer cartId) {
        try {
            cartService.clearCart(cartId);
            return ResponseEntity.ok("Cart cleared successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }
}
