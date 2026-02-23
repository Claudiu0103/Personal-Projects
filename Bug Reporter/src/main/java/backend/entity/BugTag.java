package backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "bug_tags")
public class BugTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "idBug", nullable = false)
    @JsonIgnore
    private Bug bug;


    @ManyToOne
    @JoinColumn(name = "idTag", nullable = false)
    @JsonIgnore
    private Tag tag;

    public BugTag() {}

    public BugTag(Bug bug, Tag tag) {
        this.bug = bug;
        this.tag = tag;
    }
}
