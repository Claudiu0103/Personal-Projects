package IS.Proiect.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ClientService {
    @Autowired
    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public List<Client> getClients() {
        return clientRepository.findAll();
    }

    public Client getClient(int id) {
        return clientRepository.findByIdUser(id).orElseThrow(() -> new IllegalArgumentException("Client with id " + id + " not found"));
    }

    public void addNewClient(Client client) {

        if (client.getFirstName() == null || client.getLastName() == null) {
            throw new IllegalStateException("Invalid Name");
        }
        clientRepository.save(client);
    }

    public void deleteClient(Integer id) {
        boolean exists = clientRepository.existsById(id);
        if (!exists) {
            throw new IllegalStateException("Client with id " + id + " doesn't exists");
        }
        clientRepository.deleteById(id);
    }

    @Transactional
    public void updateClient(Integer id, String firstName) {
        Client client = clientRepository.findById(id).orElseThrow(() -> new IllegalStateException("Client with id " + id + " doesn't exists"));
        if (firstName != null && !Objects.equals(client.getFirstName(), firstName)) {
            if (client.getFirstName() == null) {
                throw new IllegalStateException("Invalid Name");
            }
            client.setFirstName(firstName);
        }
    }

    public void save(Client client) {
        clientRepository.save(client);
    }

    public Client getClientByUserId(Integer idUser) {
        System.out.println("Caut client cu userId: " + idUser);
        return clientRepository.findByIdUser(idUser)
                .orElseThrow(() -> {
                    System.err.println("Client with userId " + idUser + " doesn't exist");
                    return new IllegalStateException("Client with userId " + idUser + " doesn't exist");
                });
    }

}
