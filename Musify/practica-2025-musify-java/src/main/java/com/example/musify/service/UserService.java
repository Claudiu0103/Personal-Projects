package com.example.musify.service;

import com.example.musify.dto.mapper.UserMapper;
import com.example.musify.dto.user.ChangePasswordDTO;
import com.example.musify.dto.user.RegisterUserDTO;
import com.example.musify.dto.user.UpdateUserDTO;
import com.example.musify.dto.user.UserDTO;
import com.example.musify.model.User;
import com.example.musify.model.UserRole;
import com.example.musify.repository.UserRepository;
import com.example.musify.validator.EmailValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class UserService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);
    private final EmailValidator emailValidator = new EmailValidator();

    public UserService(UserRepository userRepository, AuthenticationManager authenticationManager, JWTService jwtService) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public Page<UserDTO> getUsersPaginated(Pageable pageable) {
        Page<User> usersPage = userRepository.findAll(pageable);
        return usersPage.map(UserMapper::toDTO);
    }


    public String verifyUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Email does not exist"));
        String role = user.getRole().name();
        Long id = user.getId();
        if (Boolean.TRUE.equals(user.getIsDeleted())) {
            throw new IllegalStateException("Credentials are incorrect!");
        }

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            if (auth.isAuthenticated()) {
                return jwtService.generateToken(email, role, id);
            } else {
                throw new IllegalStateException("Credentials are incorrect");
            }
        } catch (Exception e) {
            throw new IllegalStateException("Credentials are incorrect");
        }
    }

    public User insertUser(RegisterUserDTO registerUserDTO) {
        Optional<User> existingUser = this.userRepository.findByEmail(registerUserDTO.getEmail());
        System.out.println(registerUserDTO.getPassword());
        if (existingUser.isPresent()) {
            throw new IllegalStateException("User already exists");
        }
        if (!emailValidator.validateEmail(registerUserDTO.getEmail())) {
            throw new IllegalStateException("Email is incorrect");
        }
        if (registerUserDTO.getPassword() == null || registerUserDTO.getPassword().isBlank()) {
            throw new IllegalStateException("Password is mandatory");
        }
        if (registerUserDTO.getPassword().length() < 8) {
            throw new IllegalStateException("Password too short");
        }
        System.out.println(isValidPassword(registerUserDTO.getPassword()));
        if (!isValidPassword(registerUserDTO.getPassword())) {
            throw new IllegalStateException("Password does not meet complexity requirements");
        }
        if (registerUserDTO.getFirstName() == null || registerUserDTO.getFirstName().isBlank()) {
            throw new IllegalStateException("First name is mandatory");
        }
        if (registerUserDTO.getLastName() == null || registerUserDTO.getLastName().isBlank()) {
            throw new IllegalStateException("Last name is mandatory");
        }
        if (registerUserDTO.getCountry() == null || registerUserDTO.getCountry().isBlank()) {
            throw new IllegalStateException("Country is mandatory");
        }
        User user = new User();
        String password = this.passwordEncoder.encode(registerUserDTO.getPassword());
        user.setFirstName(registerUserDTO.getFirstName());
        user.setLastName(registerUserDTO.getLastName());
        user.setPassword(password);
        user.setRole(UserRole.REGULAR);
        user.setCountry(registerUserDTO.getCountry());
        user.setEmail(registerUserDTO.getEmail());
        return userRepository.save(user);
    }

    public User findUserByEmail(String email) {
        Optional<User> user = this.userRepository.findByEmail(email);
        return user.orElse(null);
    }

    public User updateUserDeletionStatus(Long id, Boolean isDeleted) {
        if (id == null || isDeleted == null) {
            throw new IllegalArgumentException("ID and isDeleted cannot be null");
        }

        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User with ID " + id + " not found");
        }


        System.out.println(isDeleted);
        User user = userOptional.get();
        System.out.println(user);
        user.setIsDeleted(isDeleted);
        System.out.println(user);
        return userRepository.save(user);
    }

    public void changePassword(String email, ChangePasswordDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new IllegalStateException("Old password is incorrect");
        }

        if (!isValidPassword(dto.getNewPassword())) {
            throw new IllegalArgumentException("Password does not meet complexity requirements");
        }

        if (passwordEncoder.matches(dto.getNewPassword(), user.getPassword())) {
            throw new IllegalStateException("Passwords are the same");
        }


        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }

    private boolean isValidPassword(String password) {
        return password.matches("^(?=.*[0-9])(?=.*[A-Z])(?=.*[@#$%^&+=!.])(?=\\S+$).{8,}$");
    }

    public UserDTO updateUser(String email, UpdateUserDTO updateUserDTO) {
        User user = this.userRepository.findByEmail(email).orElseThrow(
                () -> new IllegalStateException("User does not exist")
        );

        user.setFirstName(updateUserDTO.getFirstName());
        user.setLastName(updateUserDTO.getLastName());
        user.setCountry(updateUserDTO.getCountry());

        User updatedUser = this.userRepository.save(user);

        return UserMapper.toDTO(updatedUser);
    }

    @Transactional
    public UserDTO changeUserRole(Long userId) {
        User user = this.userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        UserRole userRole = UserRole.valueOf(user.getRole().name());
        UserRole newRole = userRole;

        if (userRole == UserRole.REGULAR) {
            newRole = UserRole.ADMIN;
        }

        log.debug("Changing role for user {}. From {} to {}", user.getEmail(), userRole, newRole);
        user.setRole(newRole);

        return UserMapper.toDTO(user);
    }

    public void deleteTestUsers() {
        List<User> users = this.userRepository.findByFirstNameContainingIgnoreCase("TestFirstName");
        userRepository.deleteAll(users);
    }
}