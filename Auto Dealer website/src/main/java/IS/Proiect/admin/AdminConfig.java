package IS.Proiect.admin;

import IS.Proiect.car.Car;
import IS.Proiect.showroom.Showroom;
import IS.Proiect.user.User;
import IS.Proiect.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Optional;

@Configuration
public class AdminConfig {
    @Bean
    @Order(2)
    CommandLineRunner commandLineRunner4(AdminRepository repository, UserRepository userRepository) {
        return args -> {
            User UClaudiu = userRepository.findById(1).orElseThrow(() -> new IllegalStateException("User not found"));
            User UAna = userRepository.findById(2).orElseThrow(() -> new IllegalStateException("User not found"));
            Admin Claudiu = new Admin(1,"Claudiu","Gusita",UClaudiu);
            Admin Ana = new Admin(2,"Ana","Bizga",UAna);
            repository.saveAll(List.of(Claudiu,Ana));
        };
    }
}
