package com.example.musify.config;

import com.example.musify.model.User;
import com.example.musify.model.UserRole;
import com.example.musify.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    public AdminInitializer(UserRepository userRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepo.findByEmail("admin@musify.com").isEmpty()) {
            User admin = User.builder()
                    .firstName("Admin")
                    .lastName("Musify")
                    .email("admin@musify.com")
                    .password(encoder.encode("Admin123!"))
                    .country("System")
                    .isDeleted(false)
                    .role(UserRole.ADMIN)
                    .build();

            admin.setCreationDate(LocalDateTime.now());
            userRepo.save(admin);
            System.out.println("Admin user created");
        }

    }
}