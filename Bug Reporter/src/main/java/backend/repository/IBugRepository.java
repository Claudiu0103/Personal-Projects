package backend.repository;

import backend.entity.Bug;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface IBugRepository extends CrudRepository<Bug, Long> {
    List<Bug> findByUser_IdUser(Long idUser);
}
