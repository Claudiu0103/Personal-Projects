package backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "bugs")
public class Bug extends Post {

    @Id
    @Column(name = "idBug")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idBug;

    @Column(name = "title")
    private String title;

    @Column(name = "status")
    private String status;

    @ManyToOne
    @JoinColumn(name = "idUser", nullable = false)
    @JsonIgnore
    private User user;

    @JsonIgnore
    @OneToMany(mappedBy = "bug", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "bug", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<BugTag> bugTags = new ArrayList<>();

    @OneToMany(mappedBy = "bug", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Vote> votes = new ArrayList<>();


    public Bug() {
    }

    public Bug(String title, String text, String date, String imageURL, User user) {
        super(text, imageURL, date);
        this.title = title;
        this.status = "Received";
        this.user = user;
    }

    @Override
    public String toString() {
        return "Bug{" +
                "idBug=" + idBug +
                ", title='" + title + '\'' +
                ", status='" + status + '\'' +
                ", bugTags=" + bugTags +
                ", votes=" + votes +
                "} " + super.toString();
    }
}
