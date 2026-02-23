package backend.config;

import backend.entity.Vote;
import backend.entity.VoteType;
import backend.repository.IUserRepository;
import backend.repository.IVoteRepository;
import backend.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class VoteConfig {
    @Bean
    CommandLineRunner commandLineRunner4(IVoteRepository voteRepository) {
        return args -> {
            /*Vote vote = new Vote(6L,8L,4L, VoteType.UPVOTE);
            voteRepository.save(vote);*/
        };
    }
}