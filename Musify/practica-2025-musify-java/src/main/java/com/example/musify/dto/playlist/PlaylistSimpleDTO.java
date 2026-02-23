package com.example.musify.dto.playlist;

import com.example.musify.dto.user.UserSimpleDTO;
import com.example.musify.model.PlaylistType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class PlaylistSimpleDTO {
    private Long id;

    private String name;

    private PlaylistType type;

    private UserSimpleDTO owner;

    private String duration;
}