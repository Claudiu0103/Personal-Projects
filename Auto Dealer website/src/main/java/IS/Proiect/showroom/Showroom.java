package IS.Proiect.showroom;

import IS.Proiect.admin.Admin;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table
public class Showroom {
    @Id
    @SequenceGenerator(
            name = "showroom_sequence",
            sequenceName = "showroom_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "showroom_sequence"
    )
    private Integer idShowroom;
    private String name;
    private String location;
    private String phoneNumber;
    private String email;

    @ManyToOne
    @JoinColumn(name = "admin_id", referencedColumnName = "idAdmin")
    private Admin admin;

    public Showroom() {
    }

    public Showroom(Integer idShowroom, String name, String location, String phoneNumber, String email, Admin admin) {
        this.idShowroom = idShowroom;
        this.name = name;
        this.location = location;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.admin = admin;
    }

    public Integer getIdShowroom() {
        return idShowroom;
    }

    public void setIdShowroom(Integer idShowroom) {
        this.idShowroom = idShowroom;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }


    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Admin getAdmin() {
        return admin;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }

    @Override
    public String toString() {
        return "Showroom{" +
                "idShowroom=" + idShowroom +
                ", name='" + name + '\'' +
                ", location='" + location + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", email='" + email + '\'' +
                ", admin=" + admin +
                '}';
    }
}
