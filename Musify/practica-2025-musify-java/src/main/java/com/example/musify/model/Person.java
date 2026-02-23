package com.example.musify.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "persons")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Person extends BaseEntity {

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "stage", nullable = false)
    private String stageName;

    @Column(name = "birthday", nullable = false)
    private LocalDate birthday;

    @OneToOne
    @JoinColumn(name = "artist_id")
    private Artist artist;

    @ManyToOne
    @JoinColumn(name = "band_id")
    private Band band;
}