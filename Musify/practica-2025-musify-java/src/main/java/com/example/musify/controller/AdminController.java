package com.example.musify.controller;


import com.example.musify.dto.mapper.UserMapper;
import com.example.musify.dto.user.UserDTO;
import com.example.musify.dto.user.UserStatusDTO;
import com.example.musify.model.User;
import com.example.musify.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/admins")
@CrossOrigin
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }


    @PatchMapping("/users/{userId}")
    public ResponseEntity<UserDTO> updateUserActive(@PathVariable Long userId, @Valid @RequestBody UserStatusDTO userStatusDTO) {
        log.info("Admin request to change role for user with id {}", userId);
        User targetUser = userService.updateUserDeletionStatus(userId, userStatusDTO.getIsDeleted());
        UserDTO targetUserDTO = UserMapper.toDTO(targetUser);
        return ResponseEntity.ok(targetUserDTO);
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<UserDTO> changeUserRole(@PathVariable Long userId) {
        log.info("Admin request to change role for user with id {}", userId);
        UserDTO updateUser = userService.changeUserRole(userId);
        return ResponseEntity.ok(updateUser);
    }
}
