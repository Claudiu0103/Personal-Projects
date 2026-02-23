package com.example.musify.controller;

import com.example.musify.dto.mapper.UserMapper;
import com.example.musify.dto.user.ChangePasswordDTO;
import com.example.musify.dto.user.UpdateUserDTO;
import com.example.musify.dto.user.UserDTO;
import com.example.musify.model.User;
import com.example.musify.service.JWTService;
import com.example.musify.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {
    private final JWTService jWTService;
    private final UserService userService;

    public UserController(JWTService jWTService, UserService userService) {
        this.jWTService = jWTService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<Page<UserDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<UserDTO> dtoPage = userService.getUsersPaginated(pageable);
        return ResponseEntity.ok(dtoPage);
    }


    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordDTO dto, Principal principal) {
        userService.changePassword(principal.getName(), dto);
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(HttpServletRequest request, @Valid @RequestBody UpdateUserDTO updateUserDTO) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwtToken = authHeader.substring(7);
            String email = jWTService.extractEmail(jwtToken);

            UserDTO userDTO = userService.updateUser(email, updateUserDTO);
            return ResponseEntity.ok(userDTO);
        }
        return ResponseEntity.status(401).body("Token JWT lipsă sau invalid");
    }


    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwtToken = authHeader.substring(7);
            String email = jWTService.extractEmail(jwtToken);
            User user = userService.findUserByEmail(email);
            UserDTO userDTO = UserMapper.toDTO(user);
            return ResponseEntity.ok(userDTO);
        }

        return ResponseEntity.status(401).body("Token JWT lipsă sau invalid");
    }

    @DeleteMapping("/test-users")
    public ResponseEntity<Void> deleteTestUsers() {
        userService.deleteTestUsers();
        return ResponseEntity.noContent().build();
    }
}
