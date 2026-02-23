package com.example.musify.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "bands")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Band extends BaseEntity {

    @Column(name = "band_name", nullable = false)
    private String bandName;

    @Column(name = "location", nullable = false)
    private String location;

    @OneToOne
    @JoinColumn(name = "artist_id", nullable = false)
    private Artist artist;

    @OneToMany(mappedBy = "band", cascade = CascadeType.ALL)
    private List<Person> members;

}