package backend.repository;

import backend.entity.Bug;
import backend.entity.BugTag;
import backend.entity.Tag;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IBugTagRepository extends CrudRepository<BugTag, Long> {
    boolean existsByBugAndTag(Bug bug, Tag tag);

    List<Tag> findTagsByBug_IdBug(Long bugId);

    List<Bug> findBugsByTag_IdTag(Long tagId);
}
