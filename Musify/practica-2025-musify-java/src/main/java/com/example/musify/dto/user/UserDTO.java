package com.example.musify.dto.user;

import com.example.musify.model.UserRole;
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
public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String country;
    private UserRole role;
    private Boolean isDeleted;  // include deletion flag
}