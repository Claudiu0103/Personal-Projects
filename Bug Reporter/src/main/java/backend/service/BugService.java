package backend.service;


import backend.dto.BugDTO;
import backend.entity.Bug;
import backend.entity.BugTag;
import backend.entity.Tag;
import backend.entity.User;
import backend.repository.IBugRepository;
import backend.repository.ITagRepository;
import backend.repository.IBugTagRepository;
import backend.repository.IUserRepository;
import jakarta.transaction.Transactional;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BugService {

    private final IBugRepository IBugRepository;
    private final ITagRepository ITagRepository;
    private final IBugTagRepository IBugTagRepository;
    private final IUserRepository IUserRepository;

    public BugService(IBugRepository IBugRepository, IUserRepository IUserRepository, ITagRepository ITagRepository, IBugTagRepository IBugTagRepository) {
        this.IBugRepository = IBugRepository;
        this.IUserRepository = IUserRepository;
        this.IBugTagRepository = IBugTagRepository;
        this.ITagRepository = ITagRepository;
    }

    public List<Bug> retrieveBugs() {
        return (List<Bug>) this.IBugRepository.findAll();
    }

    public BugDTO convertToDTO(Bug bug) {
        BugDTO bugDTO = new BugDTO();

        bugDTO.setId(bug.getIdBug());
        bugDTO.setTitle(bug.getTitle());
        bugDTO.setText(bug.getText());
        bugDTO.setStatus(bug.getStatus());
        bugDTO.setDate(bug.getDate());
        bugDTO.setImageURL(bug.getImageURL());
        bugDTO.setUsername(bug.getUser().getUsername());
        bugDTO.setUserId(bug.getUser().getIdUser());

        List<String> tagNames = bug.getBugTags().stream()
                .map(bugTag -> bugTag.getTag().getName())
                .collect(Collectors.toList());
        bugDTO.setTagNames(tagNames);

        return bugDTO;
    }

    public Bug convertToBug(BugDTO bugDTO) {
        Bug bug = new Bug();
        bug.setIdBug(bugDTO.getId());
        bug.setTitle(bugDTO.getTitle());
        bug.setText(bugDTO.getText());
        bug.setDate(bugDTO.getDate());
        bug.setStatus(bugDTO.getStatus());
        bug.setImageURL(bugDTO.getImageURL());
        Optional<User> optionalUser = this.IUserRepository.findById(bugDTO.getUserId());
        System.out.println(optionalUser);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + bugDTO.getUserId());
        }
        bug.setUser(optionalUser.get());

        List<BugTag> bugTags = bugDTO.getTagNames().stream()
                .map(tagName -> {
                    Tag tag = ITagRepository.findByName(tagName)
                            .orElseThrow(() -> new RuntimeException("Tag not found: " + tagName));
                    return new BugTag(bug, tag);
                })
                .collect(Collectors.toList());

        bug.setBugTags(bugTags);
        return bug;
    }

    public Bug retrieveBugById(Long id) {
        return this.IBugRepository.findById(id).orElseThrow(() -> new IllegalStateException("Bug with id not found"));
    }
    @Transactional
    public Bug insertBug(Bug bug, Long userId) {
        Optional<User> userOptional = IUserRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("Utilizatorul cu ID-ul " + userId + " nu există!");
        }
        User user = userOptional.get();
        Hibernate.initialize(user.getBugs());
        bug.setUser(userOptional.get());
        userOptional.get().getBugs().add(bug);
        bug.setStatus("Received");
        return IBugRepository.save(bug);
    }


    public Bug updateBug(Long bugId, Bug updatedBug) {
        Optional<Bug> existingBugOptional = IBugRepository.findById(bugId);
        if (existingBugOptional.isEmpty()) {
            throw new IllegalArgumentException("Bug-ul cu ID-ul " + bugId + " nu există!");
        }
        Bug existingBug = existingBugOptional.get();
        existingBug.setTitle(updatedBug.getTitle());
        existingBug.setText(updatedBug.getText());
        existingBug.setDate(updatedBug.getDate());
        existingBug.setStatus(updatedBug.getStatus());
        existingBug.setImageURL(updatedBug.getImageURL());

        return IBugRepository.save(existingBug);
    }

    public String deleteById(Long id) {
        try {
            this.IBugRepository.deleteById(id);
            return "Deletion Successfully";
        } catch (Exception e) {
            return "Failed to delete bug with id " + id;
        }
    }

    @Transactional
    public Bug addBugWithTags(String title, String text, String date, String imageURL, Long userId, List<String> tagNames) {
        Bug bug = new Bug();
        bug.setTitle(title);
        bug.setText(text);
        bug.setDate(date);
        bug.setImageURL(imageURL);
        bug.setUser(IUserRepository.findById(userId).orElse(null));
        bug.setStatus("Received");
        bug = IBugRepository.save(bug);

        for (String tagName : tagNames) {
            Tag tag = ITagRepository.findByName(tagName).orElseGet(() -> {
                Tag newTag = new Tag();
                newTag.setName(tagName);
                return ITagRepository.save(newTag);
            });
            BugTag bugTag = new BugTag(bug, tag);
            this.IBugTagRepository.save(bugTag);
        }


        return bug;
    }


    @Transactional
    public String addTagToBug(Long bugId, String tagName) {
        Optional<Bug> bugOptional = IBugRepository.findById(bugId);
        if (bugOptional.isEmpty()) {
            return "Bug-ul nu există!";
        }
        Bug bug = bugOptional.get();

        Tag tag = ITagRepository.findByName(tagName).orElseGet(() -> {
            Tag newTag = new Tag();
            newTag.setName(tagName);
            return ITagRepository.save(newTag);
        });

        if (IBugTagRepository.existsByBugAndTag(bug, tag)) {
            return "Tag-ul este deja asociat cu acest bug!";
        }
        BugTag bugTag = new BugTag(bug, tag);
        IBugTagRepository.save(bugTag);
        return "Tag-ul a fost adăugat cu succes!";
    }

    public List<Tag> getTagsForBug(Long bugId) {
        return IBugTagRepository.findTagsByBug_IdBug(bugId);
    }

    public List<Bug> getBugsForTag(Long tagId) {
        return IBugTagRepository.findBugsByTag_IdTag(tagId);
    }
}
