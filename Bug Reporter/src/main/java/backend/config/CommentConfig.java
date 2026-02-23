package backend.config;

import backend.entity.Bug;
import backend.entity.Comment;
import backend.entity.User;
import backend.repository.IBugRepository;
import backend.repository.ICommentRepository;
import backend.repository.IUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CommentConfig {
    @Bean
    CommandLineRunner commandLineRunner3(IBugRepository bugRepository, IUserRepository userRepository, ICommentRepository commentRepository) {
        return args -> {
            /*User user = userRepository.findById(6L).orElse(null);
            Bug bug1 = bugRepository.findById(4L).orElse(null);
            Comment comment1 = new Comment("ai dreptate, mi s a intamplat si mie asta", "20.05.2025","sdfsdfsd",user,bug1);
            commentRepository.save(comment1);*/

        };
    }
}