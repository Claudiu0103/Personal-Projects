package com.example.musify.dto.mapper;

import com.example.musify.dto.user.UserDTO;
import com.example.musify.dto.user.UserSimpleDTO;
import com.example.musify.model.User;

public class UserMapper {
    public static UserDTO toDTO(User user) {
        if (user == null) return null;
        return UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .country(user.getCountry())
                .role(user.getRole())
                .isDeleted(user.getIsDeleted())
                .build();
    }

    public static User fromDTO(UserDTO dto) {
        User user = User.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .country(dto.getCountry())
                .role(dto.getRole())
                .isDeleted(dto.getIsDeleted())
                // password must be set separately
                .build();
        if (dto.getId() != null) {
            user.setId(dto.getId());
        }
        return user;
    }


    public static UserSimpleDTO toSimpleDTO(User user) {
        if (user == null) return null;
        return UserSimpleDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }

}