package IS.Proiect.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class UserService {
    @Autowired
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public void addNewUser(User user) {

        if (user.getUsername() == null) {
            throw new IllegalStateException("Invalid Username");
        }
        userRepository.save(user);
    }

    public void deleteUser(Integer id) {
        boolean exists = userRepository.existsById(id);
        if (!exists) {
            throw new IllegalStateException("User with id " + id + " doesn't exists");
        }
        userRepository.deleteById(id);
    }

    @Transactional
    public void updateUser(Integer id,String password) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalStateException("User with id " + id + "doesn't exists"));
        if (password != null && !Objects.equals(user.getPassword(), password)) {
            if (user.getPassword().length() < 5) {
                throw new IllegalStateException("Invalid Password");
            }
            user.setPassword(password);
        }
    }
}
