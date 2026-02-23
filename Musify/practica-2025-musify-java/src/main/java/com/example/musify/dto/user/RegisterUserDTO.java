package com.example.musify.dto.user;

import com.example.musify.model.UserRole;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterUserDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String country;
    private String password;
}