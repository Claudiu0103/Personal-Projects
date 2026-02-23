package com.example.musify.dto.mapper;

import com.example.musify.dto.playlist.PlaylistCreateDTO;
import com.example.musify.dto.playlist.PlaylistDTO;
import com.example.musify.dto.playlist.PlaylistSimpleDTO;
import com.example.musify.dto.user.UserDTO;
import com.example.musify.model.Playlist;
import com.example.musify.model.UserPlaylist;

import java.util.List;

public class PlaylistMapper {


    public static PlaylistDTO toDTO(Playlist playlist) {
        if (playlist == null) return null;
        return PlaylistDTO.builder()
                .id(playlist.getId())
                .name(playlist.getName())
                .type(playlist.getType())
                .owner(UserMapper.toDTO(playlist.getOwner()))
                .followers(
                        playlist.getFollowers().stream()
                                .map(UserPlaylist::getUser)
                                .map(UserMapper::toDTO)
                                .toList()
                )
                .songs(
                        playlist.getSongs().stream()
                                .map(sp -> SongMapper.toDTO(sp.getSong()))
                                .toList()
                )
                .build();
    }

    public static Playlist fromDTO(
            PlaylistDTO dto,
            com.example.musify.model.User ownerEntity,
            List<com.example.musify.model.User> followerEntities
    ) {
        Playlist playlist = Playlist.builder()
                .name(dto.getName())
                .type(dto.getType())
                .owner(ownerEntity)
                .build();

        // For creating the playlists, to avoid null pointer exception
        playlist.setSongs(List.of());
        List<UserPlaylist> followers = followerEntities.stream()
                .map(user -> UserPlaylist.builder()
                        .user(user)
                        .playlist(playlist)
                        .build())
                .toList();
        playlist.setFollowers(followers);

        return playlist;
    }

    ///  Uses The PlaylistSimpleDTO specially made for the task -Aris
    public static PlaylistSimpleDTO toSimpleDTO(Playlist playlist) {
        if (playlist == null) return null;
        return PlaylistSimpleDTO.builder()
                .id(playlist.getId())
                .name(playlist.getName())
                .type(playlist.getType())
                .owner(UserMapper.toSimpleDTO(playlist.getOwner()))
                .duration(getDurationOfPlaylist(playlist))
                .build();
    }

    ///  Uses the PlaylistCreateDTO
    public static PlaylistDTO toCreateDTO(PlaylistCreateDTO request, UserDTO owner) {
        PlaylistDTO dto = new PlaylistDTO();
        dto.setName(request.getName());
        dto.setType(request.getType());
        dto.setOwner(owner);
        dto.setSongs(List.of());
        dto.setFollowers(List.of());
        return dto;
    }

    private static int parseDurationToSeconds(String duration) {
        if (duration == null || duration.isEmpty()) return 0;
        String[] parts = duration.split(":");
        try {
            if (parts.length == 2) {
                int minutes = Integer.parseInt(parts[0]);
                int seconds = Integer.parseInt(parts[1]);
                return minutes * 60 + seconds;
            } else if (parts.length == 3) {
                int hours = Integer.parseInt(parts[0]);
                int minutes = Integer.parseInt(parts[1]);
                int seconds = Integer.parseInt(parts[2]);
                return hours * 3600 + minutes * 60 + seconds;
            }
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException(e);
        }
        return 0;
    }

    public static String getDurationOfPlaylist(Playlist playlist) {
        if (playlist == null || playlist.getSongs() == null || playlist.getSongs().isEmpty()) {
            return "00:00";
        }
        int totalSeconds = playlist.getSongs().stream()
                .mapToInt(sp -> parseDurationToSeconds(sp.getSong().getDuration()))
                .sum();

        int hours = totalSeconds / 3600;
        int minutes = (totalSeconds % 3600) / 60;
        int seconds = totalSeconds % 60;

        if (hours > 0) {
            return String.format("%02d:%02d:%02d", hours, minutes, seconds);
        }
        return String.format("%02d:%02d", minutes, seconds);
    }

}