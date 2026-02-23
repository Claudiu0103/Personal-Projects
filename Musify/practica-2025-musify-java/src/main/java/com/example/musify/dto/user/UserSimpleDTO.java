package com.example.musify.dto.user;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserSimpleDTO {
    Long id;
    String firstName;
    String lastName;
}
