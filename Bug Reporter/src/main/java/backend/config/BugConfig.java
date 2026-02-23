package backend.config;

import backend.repository.IBugRepository;
import backend.repository.IUserRepository;
import backend.service.BugService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class BugConfig {
    @Bean
    CommandLineRunner commandLineRunner2(IBugRepository bugRepository, IUserRepository userRepository, BugService bugService) {
        return args -> {
            /*List<String> tagNames = List.of("UI", "Backend", "Critical");
            bugService.addBugWithTags(
                    "Login Button Not Working",
                    "The login button does not respond when clicked",
                    "22.03.2025",
                    "sdfsdfsdf",
                    "RECEIVED",
                    6L,
                    tagNames
            );*/
            /*bugRepository.deleteById(3L);*/
        };
    }
}