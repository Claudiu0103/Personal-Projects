package backend.service;


import backend.entity.User;
import backend.repository.IUserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private JWTService jwtService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private SMSService smsService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    public List<User> retrieveUsers() {
        return (List<User>) this.userRepository.findAll();
    }

    public User retrieveUserById(Long id) {
        return this.userRepository.findById(id).orElseThrow(() -> new IllegalStateException("User with id not found"));
    }
    public User retrieveUserByUsername(String username) {
        return this.userRepository.findByUsername(username).orElseThrow(() -> new IllegalStateException("User with id not found"));
    }

    public User insertUser(User user) {
        Optional<User> existingUser = this.userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            throw new IllegalStateException("Utilizatorul cu acest nume exista deja");
        }
        String password = this.passwordEncoder.encode(user.getPassword());
        user.setPassword(password);
        user.setBanned(Boolean.FALSE);
        user.setRole("USER");
        user.setScore(0.0);
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalStateException("Emailul este obligatoriu");
        }
        if (user.getPhoneNumber() == null || user.getPhoneNumber().isBlank()) {
            throw new IllegalStateException("Numărul de telefon este obligatoriu");
        }
        return userRepository.save(user);
    }

    public String deleteById(Long id) {
        try {
            this.userRepository.deleteById(id);
            return "Deletion Successfully";
        } catch (Exception e) {
            return "Failed to delete user with id " + id;
        }
    }

    public String verifyUser(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (Boolean.TRUE.equals(user.getBanned())) {
            throw new IllegalStateException("Contul a fost banat");
        }

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        if (auth.isAuthenticated()) {
            return jwtService.generateToken(username);
        } else {
            throw new IllegalStateException("Autentificare eșuată");
        }
    }


    public void setBannedStatus(String username, boolean banned) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("Utilizatorul nu există"));

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalStateException("Emailul utilizatorului nu este setat!");
        }

        user.setBanned(banned);
        userRepository.save(user);

        if (banned) {
            emailService.sendBanEmail(user.getEmail(), user.getUsername());
            smsService.sendBanSMS(user.getPhoneNumber(), user.getUsername());
        } else {
            emailService.sendUnbanEmail(user.getEmail(), user.getUsername());
            smsService.sendUnbanSMS(user.getPhoneNumber(), user.getUsername());
        }
    }


    public void promoteToAdmin(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        user.setRole("ADMIN");
        userRepository.save(user);
    }

}
