package com.example.musify.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "playlist_song")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class SongPlaylist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "playlist_id", nullable = false)
    private Playlist playlist;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

    @Column(name = "song_order", nullable = false)
    private Long songOrder;

    @Override
    public String toString() {
        return "SongPlaylist{" +
                "id=" + id +
                ", playlist=" + (playlist != null ? playlist.getName() : "null") +
                '}';
    }

}