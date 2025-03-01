package IS.Proiect.cart;

import IS.Proiect.car.Car;
import IS.Proiect.car.CarRepository;
import IS.Proiect.client.Client;
import IS.Proiect.client.ClientRepository;
import IS.Proiect.payment.Payment;
import IS.Proiect.payment.PaymentRepository;
import IS.Proiect.payment.PaymentRequest;
import IS.Proiect.payment.PaymentService;
import IS.Proiect.relations.CartCar;
import IS.Proiect.relations.CartCarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private final CartRepository cartRepository;
    private final CarRepository carRepository;
    private final ClientRepository clientRepository;
    private final PaymentRepository paymentRepository;
    private final CartCarRepository cartCarRepository;
    @Autowired
    private final PaymentService paymentService;

    public CartService(
            CartRepository cartRepository,
            CarRepository carRepository,
            PaymentRepository paymentRepository,
            PaymentService paymentService,
            ClientRepository clientRepository,
            CartCarRepository cartCarRepository) {
        this.cartRepository = cartRepository;
        this.carRepository = carRepository;
        this.paymentRepository = paymentRepository;
        this.paymentService = paymentService;
        this.clientRepository = clientRepository;
        this.cartCarRepository = cartCarRepository;
    }

    public List<Cart> getCarts() {
        return cartRepository.findAll();
    }

    public Cart addNewCart(Cart cart) {
        cartRepository.save(cart);
        return cart;
    }

    public void deleteCart(Integer id) {
        boolean exists = cartRepository.existsById(id);
        if (!exists) {
            throw new IllegalStateException("Cart with id " + id + " doesn't exist");
        }
        cartRepository.deleteById(id);
    }

    public void updateCart(Integer id, Cart updatedCart) {
        Cart cart = cartRepository.findById(id).orElseThrow(() -> new IllegalStateException("Cart with id " + id + " doesn't exist"));
        cartRepository.save(updatedCart);
    }

    public List<Car> getCarsFromCart(Integer cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new IllegalStateException("Cart not found for ID: " + cartId));

        return cartCarRepository.findByCart(cart)
                .stream()
                .map(CartCar::getCar)
                .collect(Collectors.toList());
    }

    public void addCarToCart(Integer cartId, Integer carId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new IllegalStateException("Cart not found"));
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new IllegalStateException("Car not found"));

        CartCar cartCar = new CartCar();
        cartCar.setCart(cart);
        cartCar.setCar(car);

        cartCarRepository.save(cartCar);
    }

    public void removeCarFromCart(Integer cartId, Integer carId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found"));
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new IllegalArgumentException("Car not found"));

        CartCar cartCar = cartCarRepository.findByCartAndCar(cart, car)
                .orElseThrow(() -> new IllegalArgumentException("Car not found in cart"));
        cartCarRepository.delete(cartCar);
    }

    public Cart createNewCartForClient(Integer clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Client with ID " + clientId + " does not exist."));
        Cart newCart = new Cart();
        newCart.setClient(client);
        return cartRepository.save(newCart);
    }

    public void clearCart(Integer cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new IllegalStateException("Cart not found"));

        List<CartCar> cartCars = cartCarRepository.findByCart(cart);
        cartCarRepository.deleteAll(cartCars);
    }

    public Payment createPayment(Integer cartId, PaymentRequest paymentRequest) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found"));
        if (cart.getPayment() != null) {
            throw new IllegalArgumentException("Cart already has a payment associated!");
        }
        Payment payment = new Payment();
        payment.setCart(cart);

        payment.setShippingAddress(paymentRequest.getShippingAddress());
        payment.setCardNumber(paymentRequest.getCardNumber());
        payment.setCvv(paymentRequest.getCvv());
        payment.setExpiryDate(paymentRequest.getExpiryDate());
        payment.setCardHolderName(paymentRequest.getCardHolderName());
        payment.setDateOfDelivery(paymentService.calculateDeliveryDate());

        paymentRepository.save(payment);
        cart.setPayment(payment);
        cartRepository.save(cart);
        return payment;
    }
    public List<Cart> getCartsForClient(Integer clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Client with ID " + clientId + " does not exist."));

        // Returnează lista de coșuri asociate clientului
        return cartRepository.findByClient(client);
    }
}
