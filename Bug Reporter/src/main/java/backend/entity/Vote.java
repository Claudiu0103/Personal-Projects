package backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "votes")
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idVote")
    private Long idVote;

    @ManyToOne
    @JoinColumn(name = "id_user", referencedColumnName = "id_user", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_bug", referencedColumnName = "idBug")
    @JsonIgnore
    private Bug bug;

    @ManyToOne
    @JoinColumn(name = "id_comment", referencedColumnName = "idComment")
    @JsonIgnore
    private Comment comment;

    @Enumerated(EnumType.STRING)
    @Column(name = "voteType", nullable = false)
    private VoteType voteType;

    public Vote() {}

    public Vote(User user, Comment comment, Bug bug, VoteType voteType) {
        this.user = user;
        this.comment = comment;
        this.bug = bug;
        this.voteType = voteType;
    }
}

