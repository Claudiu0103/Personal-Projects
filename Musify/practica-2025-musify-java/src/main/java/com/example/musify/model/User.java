package com.example.musify.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;


@Table(name = "users")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "email",  nullable = false,  unique = true)
    private String email;

    @Column(name = "password",  nullable = false)
    private String password;

    @Column(name = "country", nullable = false)
    private String country;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted =  Boolean.FALSE;

    @Column(name = "role",  nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserPlaylist> followedPlaylists;

    @Override
    public String toString() {
        return "User{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", country='" + country + '\'' +
                ", isDeleted=" + isDeleted +
                ", role=" + role +
                '}';
    }

}