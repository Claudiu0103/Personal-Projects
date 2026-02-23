package com.example.musify.dto.user;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LogInDTO {
    private String email;
    private String password;

}
