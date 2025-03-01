package IS.Proiect.client;

import IS.Proiect.cart.Cart;
import IS.Proiect.cart.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/client")
@CrossOrigin(origins = "http://localhost:3000")
public class ClientController {

    private final ClientService clientService;
    private final CartService cartService;

    @Autowired
    public ClientController(ClientService clientService, CartService cartService) {
        this.clientService = clientService;
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<List<Client>> getAllClients() {
        List<Client> clients = clientService.getClients();
        if (clients.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(clients);
    }

    @GetMapping(path = "{idUser}")
    public Client getClient(@PathVariable int idUser) {
        return clientService.getClient(idUser);
    }

    @PostMapping(path = "{idClient}")
    public void registerNewClient(@RequestBody Client client) {
        clientService.addNewClient(client);
    }

    @DeleteMapping(path = "{idClient}")
    public void deleteClient(@PathVariable("idClient") Integer id) {
        clientService.deleteClient(id);
    }

    @PostMapping("/{userId}/create-cart")
    public ResponseEntity<Cart> createCart(@PathVariable Integer userId) {
        try {
            Client client = clientService.getClientByUserId(userId);
            if (client == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            Cart newCart = cartService.createNewCartForClient(client.getIdClient());
            return ResponseEntity.status(HttpStatus.CREATED).body(newCart);
        } catch (Exception e) {
            System.err.println("Eroare la crearea coșului: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/{userId}/cars")
    public ResponseEntity<List<Cart>> getAllCarsForClient(@PathVariable Integer userId) {
        try {
            Client client = clientService.getClientByUserId(userId);
            if (client == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            // Obține toate mașinile prin relațiile din coșuri
            List<Cart> carts = cartService.getCartsForClient(client.getIdClient());
            return ResponseEntity.ok(carts);
        } catch (Exception e) {
            System.err.println("Eroare la obținerea mașinilor: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PutMapping(path = "{idUser}")
    public ResponseEntity<Client> updateClient(@PathVariable Integer idUser, @RequestBody Client updatedClient) {
        Client client = clientService.getClient(idUser);
        if (client == null) {
            return ResponseEntity.notFound().build();
        }
        client.setFirstName(updatedClient.getFirstName());
        client.setLastName(updatedClient.getLastName());
        client.setEmail(updatedClient.getEmail());
        client.setAddress(updatedClient.getAddress());
        client.setPhone(updatedClient.getPhone());
        clientService.save(client);
        return ResponseEntity.ok(client);
    }
}
