package backend.service;


import backend.dto.BugDTO;
import backend.dto.CommentDTO;
import backend.entity.Bug;
import backend.entity.Comment;
import backend.entity.User;
import backend.repository.IBugRepository;
import backend.repository.ICommentRepository;
import backend.repository.IUserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private ICommentRepository ICommentRepository;

    @Autowired
    private IBugRepository IBugRepository;

    @Autowired
    private IUserRepository IUserRepository;


    public List<Comment> retrieveComments() {
        return (List<Comment>) this.ICommentRepository.findAll();
    }

    public Comment retrieveCommentById(Long id) {
        return this.ICommentRepository.findById(id).orElseThrow(() -> {
            return new IllegalStateException("Comment with id not found");
        });
    }

    public CommentDTO convertToDTO(Comment comment) {
        CommentDTO commentDTO = new CommentDTO();

        commentDTO.setId(comment.getIdComment());
        commentDTO.setText(comment.getText());
        commentDTO.setDate(commentDTO.getDate());
        commentDTO.setBugId(comment.getBug().getIdBug());
        commentDTO.setUserId(comment.getUser().getIdUser());
        commentDTO.setImageURL(comment.getImageURL());
        commentDTO.setUsername(comment.getUser().getUsername());
        return commentDTO;
    }

    public List<Comment> retrieveCommentsByBugId(Long idBug) {
        return this.ICommentRepository.findByBug_IdBug(idBug);
    }

    @Transactional
    public Comment insertComment(Long bugId, Long userId, String text, String imageURL, String dateTime) {
        Bug bug = this.IBugRepository.findById(bugId).orElseThrow(() ->
                new IllegalArgumentException("Bug-ul cu ID-ul " + bugId + " nu există!"));
        User user = IUserRepository.findById(userId).orElseThrow(() ->
                new IllegalArgumentException("Utilizatorul cu ID-ul " + userId + " nu există!"));
        Comment comment = new Comment(text, dateTime, imageURL, user, bug);
        user.getComments().add(comment);
        if(bug.getComments().isEmpty()){
            bug.setStatus("In progress");
        }
        bug.getComments().add(comment);
        return ICommentRepository.save(comment);
    }

    @Transactional
    public Comment updateComment(Long idComment, Comment updatedComment) {
        Comment existingComment = ICommentRepository.findById(idComment).orElseThrow(() ->
                new IllegalArgumentException("Comentariul cu ID-ul " + idComment + " nu există!"));
        existingComment.setText(updatedComment.getText());
        existingComment.setImageURL(updatedComment.getImageURL());
        existingComment.setDate(updatedComment.getDate());

        return ICommentRepository.save(existingComment);
    }

    @Transactional
    public String deleteById(Long id) {
        try {
            this.ICommentRepository.deleteById(id);
            return "Deletion Successfully";
        } catch (Exception e) {
            return "Failed to delete comment with id " + id;
        }
    }

    public Comment convertToComment(CommentDTO commentDTO) {
        Comment comment = new Comment();
        comment.setIdComment(commentDTO.getId());
        comment.setDate(commentDTO.getDate());
        comment.setText(commentDTO.getText());
        comment.setImageURL(commentDTO.getImageURL());
        Optional<Bug> bug = this.IBugRepository.findById(commentDTO.getBugId());
        if (bug.isEmpty()) {
            throw new RuntimeException("Bug not found with Id" + commentDTO.getBugId());
        }
        comment.setBug(bug.get());
        Optional<User> user = this.IUserRepository.findById(commentDTO.getUserId());
        if (user.isEmpty()) {
            throw new RuntimeException("User not found with Id" + commentDTO.getUserId());
        }
        comment.setUser(user.get());
        return comment;
    }
}
