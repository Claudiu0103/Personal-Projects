package IS.Proiect.admin;

import IS.Proiect.user.User;
import jakarta.persistence.*;


@Entity
@Table
public class Admin {
    @Id
    @SequenceGenerator(
            name = "admin_sequence",
            sequenceName = "admin_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "admin_sequence"
    )
    private Integer idAdmin;
    private String firstName;
    private String lastName;
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "idUser", unique = true)
    private User user;

    public Admin() {

    }

    public Admin(Integer idAdmin, String firstName, String lastName, User user) {
        this.idAdmin = idAdmin;
        this.firstName = firstName;
        this.lastName = lastName;
        this.user = user;
    }

    public Integer getIdAdmin() {
        return idAdmin;
    }

    public void setIdAdmin(Integer idAdmin) {
        this.idAdmin = idAdmin;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "Admin{" +
                "idAdmin=" + idAdmin +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", user=" + user +
                '}';
    }
}