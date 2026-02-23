package backend.config;

import backend.entity.User;
import backend.repository.IUserRepository;
import backend.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UserConfig {
    @Bean
    CommandLineRunner commandLineRunner(IUserRepository userRepository, UserService userService) {
        return args -> {
            /*userRepository.deleteAll();
            User user = new User("clau03","12345",false,0.0,"USER");
            userService.insertUser(user);*/

        };
    }
}