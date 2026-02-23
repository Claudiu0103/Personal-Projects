package backend.repository;

import backend.entity.Bug;
import backend.entity.Comment;
import backend.entity.User;
import backend.entity.Vote;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Base64;
import java.util.List;
import java.util.Optional;


@Repository
public interface IVoteRepository extends CrudRepository<Vote, Long> {
    Optional<Vote> findByUserAndComment(User user, Comment comment);
    Optional<Vote> findByUserAndBug(User user, Bug bug);
    Optional<List<Vote>> findByBug(Bug bug);
    Optional<List<Vote>> findByComment(Comment comment);
    List<Vote> findByUser_IdUser(Long userId);
}
