package backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "comments")
public class Comment extends Post{

    @Id
    @Column(name = "idComment")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idComment;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "idUser", nullable = false)
    private User user;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "idBug", nullable = false)
    private Bug bug;

    @OneToMany(mappedBy = "comment")
    @JsonIgnore
    private List<Vote> votes = new ArrayList<>();

    public Comment() {
    }

    public Comment(String text, String date, String imageURL, User user,Bug bug) {
        super(text, imageURL, date);
        this.user = user;
        this.bug = bug;
    }
}
