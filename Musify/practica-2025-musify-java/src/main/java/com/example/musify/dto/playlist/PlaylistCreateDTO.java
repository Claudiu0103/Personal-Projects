package com.example.musify.dto.playlist;

import com.example.musify.dto.song.SongDTO;
import com.example.musify.dto.user.UserDTO;
import com.example.musify.model.PlaylistType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class PlaylistCreateDTO {
    private String name;
    private PlaylistType type;
    private Long ownerId;
}
