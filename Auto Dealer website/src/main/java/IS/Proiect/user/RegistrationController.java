package IS.Proiect.user;

import IS.Proiect.cart.Cart;
import IS.Proiect.client.Client;
import IS.Proiect.client.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/register")
public class RegistrationController {

    private final UserService userService;
    private final ClientService clientService;
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);
    private final UserRepository userRepository;
    @Autowired
    public RegistrationController(UserService userService, ClientService clientService, UserRepository userRepository) {
        this.userService = userService;
        this.clientService = clientService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> registerUser(@RequestBody LoginRequest loginRequest) {
        String encryptedPassword = passwordEncoder.encode(loginRequest.getPassword());
        User user = new User(loginRequest.getUsername(), encryptedPassword,"Client");
        userRepository.save(user);

        Client newClient = new Client();
        Cart cart = new Cart();
        newClient.setFirstName(loginRequest.getFirstName());
        newClient.setLastName(loginRequest.getLastName());
        newClient.setPhone(loginRequest.getPhone());
        newClient.setAddress(loginRequest.getAddress());
        newClient.setEmail(loginRequest.getEmail());
        newClient.setUser(user);
        newClient.addCart(cart);

        clientService.addNewClient(newClient);
        Map<String, Object> response = new HashMap<>();
        response.put("ID", user.getIdUser());
        return ResponseEntity.ok(response);
    }
}