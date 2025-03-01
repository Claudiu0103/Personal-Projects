package IS.Proiect.user;

import jakarta.persistence.*;

@Entity
@Table
public class User {
    @Id
    @SequenceGenerator(
            name = "user_sequence",
            sequenceName = "user_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "user_sequence"
    )
    private Integer idUser;
    private String username;
    private String password;
    private String Type;

    public User() {

    }

    public User(Integer idUser, String username, String password, String Type) {
        this.idUser = idUser;
        this.username = username;
        this.password = password;
        this.Type = Type;
    }

    public User(String username, String password, String Type) {
        this.username = username;
        this.password = password;
        this.Type = Type;
    }


    public Integer getIdUser() {
        return idUser;
    }

    public void setIdUser(Integer idUser) {
        this.idUser = idUser;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getType() {
        return Type;
    }

    public void setType(String type) {
        Type = type;
    }

    @Override
    public String toString() {
        return "User{" +
                "idUser=" + idUser +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", Type='" + Type + '\'' +
                '}';
    }
}
