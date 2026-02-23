package backend.repository;

import backend.entity.Tag;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ITagRepository extends CrudRepository<Tag, Long> {
    Optional<Tag> findByName(String tagName);
}
