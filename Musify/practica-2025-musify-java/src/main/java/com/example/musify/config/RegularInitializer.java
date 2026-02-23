package com.example.musify.config;

import com.example.musify.model.User;
import com.example.musify.model.UserRole;
import com.example.musify.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class RegularInitializer implements CommandLineRunner {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    public RegularInitializer(UserRepository userRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepo.findByEmail("regular@musify.com").isEmpty()) {
            User admin = User.builder()
                    .firstName("John")
                    .lastName("Doe")
                    .email("regular@musify.com")
                    .password(encoder.encode("Regular123!"))
                    .country("Romania")
                    .isDeleted(false)
                    .role(UserRole.REGULAR)
                    .build();

            admin.setCreationDate(LocalDateTime.now());
            userRepo.save(admin);
            System.out.println("Regular user created");
        }

    }
}