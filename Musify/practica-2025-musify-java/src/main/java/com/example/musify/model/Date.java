package com.example.musify.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "dates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Date {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "year", nullable = false)
    private Long year;

    @Column(name = "month")
    private Long month;

    @Column(name = "day")
    private Long day;

}