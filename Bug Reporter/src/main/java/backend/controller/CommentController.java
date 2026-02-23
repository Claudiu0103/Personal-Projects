package backend.controller;

import backend.dto.BugDTO;
import backend.dto.CommentDTO;
import backend.entity.Bug;
import backend.entity.Comment;
import backend.entity.User;
import backend.service.BugService;
import backend.service.CommentService;
import backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/comment")
@CrossOrigin
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/getAll/{bugId}")
    public ResponseEntity<List<CommentDTO>> getAllCommentsByBugId(@PathVariable Long bugId) {
        try {
            List<Comment> comments = commentService.retrieveCommentsByBugId(bugId);
            List<CommentDTO> commentDTOS = comments.stream()
                    .map(comment -> commentService.convertToDTO(comment))
                    .toList();
            return ResponseEntity.ok(commentDTOS);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/getById/{id}")
    @ResponseBody
    public Comment getCommentById(@PathVariable Long id) {
        return this.commentService.retrieveCommentById(id);
    }

    @PostMapping("/addComment")
    public ResponseEntity<Comment> addComment(@RequestBody CommentDTO commentDTO) {
        Comment savedComment = commentService.insertComment(commentDTO.getBugId(), commentDTO.getUserId(), commentDTO.getText(), commentDTO.getImageURL(), commentDTO.getDate());
        return ResponseEntity.ok(savedComment);
    }

    @PutMapping("/updateComment/{idComment}")
    public ResponseEntity<CommentDTO> updateComment(@PathVariable Long idComment, @RequestBody CommentDTO commentDTO) {
        Comment comment = commentService.updateComment(idComment, commentService.convertToComment(commentDTO));
        CommentDTO commentDTO1 = commentService.convertToDTO(comment);
        return ResponseEntity.ok(commentDTO1);
    }

    @DeleteMapping("/deleteById/{commentId}")
    @ResponseBody
    public String deleteCommentById(@PathVariable Long commentId) {
        return this.commentService.deleteById(commentId);
    }
}
