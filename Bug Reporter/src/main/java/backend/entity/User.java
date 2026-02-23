package backend.entity;

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
@Table(name ="users")
public class User {

    @Id
    @Column(name="id_user")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUser;

    @Column(name = "username")
    private String username;

    @Column(name="password")
    private String password;

    @Column(name="banned")
    private Boolean banned;

    @Column(name="score")
    private Double score;

    @Column(name="role")
    private String role;

    @Column(name = "email")
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Bug> bugs = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Vote> votes = new ArrayList<>();


    public User() {
    }

    public User(String username, String password, Boolean banned, Double score, String role) {
        this.username = username;
        this.password = password;
        this.banned = banned;
        this.score = score;
        this.role = role;
    }

    @Override
    public String toString() {
        return "User{" +
                "idUser=" + idUser +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", banned=" + banned +
                ", score=" + score +
                ", role='" + role + '\'' +
                ", bugs=" + bugs +
                ", comments=" + comments +
                ", votes=" + votes +
                '}';
    }
}
