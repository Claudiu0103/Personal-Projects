package backend.service;


import backend.entity.*;
import backend.repository.IBugRepository;
import backend.repository.ICommentRepository;
import backend.repository.IUserRepository;
import backend.repository.IVoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class VoteService {

    @Autowired
    private IVoteRepository voteRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IBugRepository bugRepository;

    @Autowired
    private ICommentRepository commentRepository;

    public List<Vote> retrieveVotes() {
        return (List<Vote>) this.voteRepository.findAll();
    }

    public Vote retrieveVoteById(Long id) {
        return this.voteRepository.findById(id).orElseThrow(() -> new IllegalStateException("Vote with id not found"));
    }

    public List<Vote> retrieveVotesByBug(Long bugId) {
        Bug bug = bugRepository.findById(bugId).get();
        return this.voteRepository.findByBug(bug).orElseThrow(() -> new IllegalStateException("VotesByBug with id not found"));
    }

    public List<Vote> retrieveVotesByComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId).get();
        return this.voteRepository.findByComment(comment).orElseThrow(() -> new IllegalStateException("VotesByComment with id not found"));
    }

    public int getNrOfLikes(Long id) {
        int count = 0;
        for (Vote vote : this.retrieveVotesByBug(id)) {
            if (vote.getVoteType() == VoteType.UPVOTE) {
                count++;
            }
        }
        return count;
    }

    public int getNrOfDislikes(Long id) {
        int count = 0;
        for (Vote vote : this.retrieveVotesByBug(id)) {
            if (vote.getVoteType() == VoteType.DOWNVOTE) {
                count++;
            }
        }
        return count;
    }

    public int getLikesForComment(Long id) {
        int count = 0;
        for (Vote vote : this.retrieveVotesByComment(id)) {
            if (vote.getVoteType() == VoteType.UPVOTE) {
                count++;
            }
        }
        return count;
    }

    public int getDislikesForComment(Long id) {
        int count = 0;
        for (Vote vote : this.retrieveVotesByComment(id)) {
            if (vote.getVoteType() == VoteType.DOWNVOTE) {
                count++;
            }
        }
        return count;
    }

    public Vote insertVoteFromBug(Long userId, Long bugId, Vote vote) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Bug bug = bugRepository.findById(bugId).orElseThrow(() -> new RuntimeException("Bug not found"));

        if (Objects.equals(userId, bug.getUser().getIdUser())) {
            throw new IllegalArgumentException("Nu poti vota propriul bug");
        }

        Optional<Vote> existingVote = voteRepository.findByUserAndBug(user, bug);

        if (existingVote.isPresent()) {
            Vote existing = existingVote.get();
            if (existing.getVoteType() == vote.getVoteType()) {
                throw new IllegalArgumentException("Ai votat deja acest bug cu același tip de vot!");
            }

            existing.setVoteType(vote.getVoteType());
            return voteRepository.save(existing);
        }

        Vote newVote = new Vote();
        newVote.setUser(user);
        newVote.setBug(bug);
        newVote.setVoteType(vote.getVoteType());
        return voteRepository.save(newVote);
    }


    public Vote insertVoteFromComment(Long userId, Long commentId, Vote vote) {
        User user = userRepository.findById(userId).get();
        Comment comment = commentRepository.findById(commentId).get();
        if (Objects.equals(userId, comment.getUser().getIdUser())) {
            throw new IllegalArgumentException("Nu poti vota propriul comentariu");
        }
        Optional<Vote> existingVote = voteRepository.findByUserAndComment(user, comment);
        if (existingVote.isPresent()) {
            Vote existing = existingVote.get();
            if (existing.getVoteType() == vote.getVoteType()) {
                throw new IllegalArgumentException("Ai votat deja acest comentariu cu același tip de vot!");
            }

            existing.setVoteType(vote.getVoteType());
            return voteRepository.save(existing);
        }
        vote.setUser(user);
        vote.setComment(comment);
        return voteRepository.save(vote);
    }

    public Vote insertVote(Vote vote) {
        Optional<Vote> existingUser = this.voteRepository.findById(vote.getIdVote());
        if (existingUser.isPresent()) {
            throw new IllegalStateException("Votul cu acest nume exista deja");
        }
        return voteRepository.save(vote);
    }

    public String deleteById(Long id) {
        try {
            this.voteRepository.deleteById(id);
            return "Deletion Successfully";
        } catch (Exception e) {
            return "Failed to delete vote with id " + id;
        }
    }

    public int getNrOfLikesForUserBugs(Long userId) {
        int count = 0;
        List<Bug> userBugs = bugRepository.findByUser_IdUser(userId);
        for (Bug bug : userBugs) {
            for (Vote vote : retrieveVotesByBug(bug.getIdBug())) {
                if (vote.getVoteType() == VoteType.UPVOTE) {
                    count++;
                }
            }
        }
        return count;
    }

    public int getNrOfDislikesForUserBugs(Long userId) {
        int count = 0;
        List<Bug> userBugs = bugRepository.findByUser_IdUser(userId);
        for (Bug bug : userBugs) {
            for (Vote vote : retrieveVotesByBug(bug.getIdBug())) {
                if (vote.getVoteType() == VoteType.DOWNVOTE) {
                    count++;
                }
            }
        }
        return count;
    }

    public int getNrOfLikesForUserComments(Long userId) {
        int count = 0;
        List<Comment> userComments = commentRepository.findByUser_IdUser(userId);
        for (Comment comment : userComments) {
            for (Vote vote : retrieveVotesByComment(comment.getIdComment())) {
                if (vote.getVoteType() == VoteType.UPVOTE) {
                    count++;
                }
            }
        }
        return count;
    }

    public int getNrOfDislikesForUserComments(Long userId) {
        int count = 0;
        List<Comment> userComments = commentRepository.findByUser_IdUser(userId);
        for (Comment comment : userComments) {
            for (Vote vote : retrieveVotesByComment(comment.getIdComment())) {
                if (vote.getVoteType() == VoteType.DOWNVOTE) {
                    count++;
                }
            }
        }
        return count;
    }

    public int getNrOfCommentDownvotesGivenByUser(Long userId) {
        int count = 0;
        List<Vote> userVotes = voteRepository.findByUser_IdUser(userId);
        for (Vote vote : userVotes) {
            if (vote.getVoteType() == VoteType.DOWNVOTE && vote.getComment() != null) {
                count++;
            }
        }
        return count;
    }

}
