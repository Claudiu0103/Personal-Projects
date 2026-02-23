package backend.service;


import backend.entity.Tag;
import backend.repository.ITagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {

    @Autowired
    private ITagRepository ITagRepository;

    public List<Tag> retrieveTags() {
        return (List<Tag>) this.ITagRepository.findAll();
    }

    public Tag retrieveTagById(Long id) {
        return this.ITagRepository.findById(id).orElseThrow(() -> {
            return new IllegalStateException("Tag with id not found");
        });
    }

    public Tag insertTag(Tag tag) {
        return this.ITagRepository.save(tag);
    }

    public String deleteById(Long id) {
        try {
            this.ITagRepository.deleteById(id);
            return "Deletion Successfully";
        } catch (Exception e) {
            return "Failed to delete tag with id " + id;
        }
    }
}
