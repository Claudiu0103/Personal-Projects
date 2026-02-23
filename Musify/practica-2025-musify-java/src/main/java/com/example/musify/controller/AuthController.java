package com.example.musify.controller;

import com.example.musify.dto.mapper.UserMapper;
import com.example.musify.dto.user.LogInDTO;
import com.example.musify.dto.user.RegisterUserDTO;
import com.example.musify.dto.user.UserDTO;
import com.example.musify.model.User;
import com.example.musify.service.JWTService;
import com.example.musify.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/auth")
@CrossOrigin
@Slf4j
public class    AuthController {
    private final UserService userService;
    private final JWTService jwtService;

    public AuthController(UserService userService, JWTService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }


    @PostMapping("/register")
    @ResponseBody
    public ResponseEntity<?> register(@Valid @RequestBody RegisterUserDTO registerUserDTO) {
        try {
            User insertedUser = userService.insertUser(registerUserDTO);
            String jwt = jwtService.generateToken(insertedUser.getEmail(), insertedUser.getRole().name(),insertedUser.getId());



            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            return ResponseEntity.ok().body(response);
        } catch (IllegalStateException e) {
            log.error("Registration failed: {}", e.getMessage(), e);
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LogInDTO loginRequest) {
        try {
            String email = loginRequest.getEmail();
            String password = loginRequest.getPassword();
            String token = userService.verifyUser(email, password);


            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok().body(response);
        } catch (IllegalStateException e) {
            log.error("Login failed for email {}: {}", loginRequest.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
