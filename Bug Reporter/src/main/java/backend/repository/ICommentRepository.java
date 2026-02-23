package backend.repository;

import backend.entity.Comment;
import backend.entity.User;
import backend.entity.Vote;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ICommentRepository extends CrudRepository<Comment, Long> {
    List<Comment> findByUser_IdUser(Long idUser);
    List<Comment> findByBug_IdBug(Long idBug);
}
