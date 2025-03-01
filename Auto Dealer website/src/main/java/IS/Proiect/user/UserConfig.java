package IS.Proiect.user;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@Configuration
public class UserConfig {
    @Bean
    @Order(1)
    CommandLineRunner commandLineRunnerUser2(UserRepository repository) {
        return args -> {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String encryptedPassword1 = passwordEncoder.encode("1234567c");
            String encryptedPassword2 = passwordEncoder.encode("1234567a");
            String encryptedPassword3 = passwordEncoder.encode("1234567v");
            String encryptedPassword4 = passwordEncoder.encode("1234567d");
            User Claudiu = new User(1,"claudiu30",encryptedPassword1,"Admin");
            User Ana = new User(2,"ana29",encryptedPassword2,"Admin");
            User Vlad = new User(3,"vlad28",encryptedPassword3,"Client");
            User Dan = new User(4,"dan29",encryptedPassword4,"Client");
            repository.saveAll(List.of(Claudiu,Ana,Vlad,Dan));
        };
    }
}
