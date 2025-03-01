package IS.Proiect.showroom;

import IS.Proiect.admin.Admin;
import IS.Proiect.admin.AdminRepository;
import IS.Proiect.car.Car;
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
public class ShowroomConfig {
    private UserRepository userRepository;
    @Bean
    @Order(3)
    CommandLineRunner commandLineRunner5(ShowroomRepository repository, UserRepository userRepository, AdminRepository adminRepository) {
        return args -> {
            Admin Claudiu = adminRepository.findById(1).orElseThrow(() -> new IllegalStateException("Admin not found"));
            Showroom showroom = new Showroom(1,"Bucuresti Showroom","Bucuresti","0728945631","bucuresti@yahoo.com",Claudiu);
            Showroom showroom2 = new Showroom(2,"Cluj Napoca Showroom", "Cluj Napoca", "07843592","clujnapoca@yahoo.com",Claudiu);
            repository.saveAll(List.of(showroom,showroom2));
        };
    }
}
