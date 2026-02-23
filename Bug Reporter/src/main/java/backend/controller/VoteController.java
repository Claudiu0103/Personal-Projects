package backend.controller;

import backend.dto.VoteSummary;
import backend.entity.User;
import backend.entity.Vote;
import backend.service.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vote")
@CrossOrigin
public class VoteController {

    @Autowired
    private VoteService voteService;

    @GetMapping("/getAll")
    @ResponseBody
    public List<Vote> getAllBugs() {
        return this.voteService.retrieveVotes();
    }

    @GetMapping("/getById/{id}")
    @ResponseBody
    public Vote getUserById(@PathVariable Long id) {
        return this.voteService.retrieveVoteById(id);
    }

    @GetMapping("/getLikes/{bugId}")
    public ResponseEntity<Integer> getLikes(@PathVariable Long bugId){
        int likes = voteService.getNrOfLikes(bugId);
        return ResponseEntity.ok(likes);
    }

    @GetMapping("/getDislikes/{bugId}")
    public ResponseEntity<Integer> getDislikes(@PathVariable Long bugId){
        int dislikes = voteService.getNrOfDislikes(bugId);
        return ResponseEntity.ok(dislikes);
    }

    @PostMapping("/addVoteBug/{idUser}/{idBug}")
    @ResponseBody
    public Vote addVoteToBug(@PathVariable Long idUser, @PathVariable Long idBug, @RequestBody Vote vote) {
        return this.voteService.insertVoteFromBug(idUser,idBug,vote);
    }

    @PostMapping("/addVoteComment/{idUser}/{idComment}")
    public ResponseEntity<Vote> voteComment(@PathVariable Long idUser,
                                            @PathVariable Long idComment,
                                            @RequestBody Vote vote) {
        Vote saved = voteService.insertVoteFromComment(idUser, idComment, vote);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/getLikesComment/{commentId}")
    public ResponseEntity<Integer> getCommentLikes(@PathVariable Long commentId) {
        return ResponseEntity.ok(voteService.getLikesForComment(commentId));
    }

    @GetMapping("/getDislikesComment/{commentId}")
    public ResponseEntity<Integer> getCommentDislikes(@PathVariable Long commentId) {
        return ResponseEntity.ok(voteService.getDislikesForComment(commentId));
    }


    @PutMapping("/updateVote")
    @ResponseBody
    public Vote updateVote(@RequestBody Vote vote) {
        return this.voteService.insertVote(vote);
    }

    @DeleteMapping("/deleteById")
    @ResponseBody
    public String deleteById(@RequestParam Long id) {
        return this.voteService.deleteById(id);
    }

    @GetMapping("/summary/{userId}")
    public ResponseEntity<VoteSummary> getVoteSummary(@PathVariable Long userId) {
        int bugUpvotes = voteService.getNrOfLikesForUserBugs(userId);
        int bugDownvotes = voteService.getNrOfDislikesForUserBugs(userId);
        int commentUpvotes = voteService.getNrOfLikesForUserComments(userId);
        int commentDownvotes = voteService.getNrOfDislikesForUserComments(userId);
        int givenCommentDownvotes = voteService.getNrOfCommentDownvotesGivenByUser(userId);

        VoteSummary summary = new VoteSummary(
                bugUpvotes,
                bugDownvotes,
                commentUpvotes,
                commentDownvotes,
                givenCommentDownvotes
        );

        return ResponseEntity.ok(summary);
    }
}
