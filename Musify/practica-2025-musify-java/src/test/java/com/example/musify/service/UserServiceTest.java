package com.example.musify.service;

import com.example.musify.dto.user.ChangePasswordDTO;
import com.example.musify.dto.user.UpdateUserDTO;
import com.example.musify.dto.user.UserDTO;
import com.example.musify.model.User;
import com.example.musify.model.UserRole;
import com.example.musify.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JWTService jwtService;

    private BCryptPasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository, authenticationManager, jwtService);
        passwordEncoder = new BCryptPasswordEncoder(12);
    }

    @Test
    void updateUser_successfulUpdate() {
        String email = "test@example.com";

        UpdateUserDTO updateUserDTO = new UpdateUserDTO();
        updateUserDTO.setFirstName("John");
        updateUserDTO.setLastName("Doe");
        updateUserDTO.setCountry("USA");

        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setEmail(email);
        existingUser.setFirstName("OldFirstName");
        existingUser.setLastName("OldLastName");
        existingUser.setCountry("OldCountry");

        User updatedUser = new User();
        updatedUser.setId(1L);
        updatedUser.setEmail(email);
        updatedUser.setFirstName("John");
        updatedUser.setLastName("Doe");
        updatedUser.setCountry("USA");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(existingUser)).thenReturn(updatedUser);

        UserDTO result = userService.updateUser(email, updateUserDTO);

        assertEquals("John", result.getFirstName());
        assertEquals("Doe", result.getLastName());
        assertEquals("USA", result.getCountry());
    }

    @Test
    void updateUser_userNotFound() {
        String email = "nonexistent@example.com";

        UpdateUserDTO updateUserDTO = new UpdateUserDTO();
        updateUserDTO.setFirstName("Jane");

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        IllegalStateException exception = assertThrows(IllegalStateException.class, () ->
                userService.updateUser(email, updateUserDTO)
        );

        assertEquals("User does not exist", exception.getMessage());
    }

    //tests for task 584
    @Test
    void changePassword_ValidPassword_Success() {
        String email = "test@example.com";
        String oldPassword = "OldPassword123!";
        String newPassword = "NewPassword123@";
        String encodedOldPassword = passwordEncoder.encode(oldPassword);

        User user = new User();
        user.setEmail(email);
        user.setPassword(encodedOldPassword);
        user.setRole(UserRole.REGULAR);

        ChangePasswordDTO dto = new ChangePasswordDTO();
        dto.setOldPassword(oldPassword);
        dto.setNewPassword(newPassword);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        assertDoesNotThrow(() ->
        {
            userService.changePassword(email, dto);
        });

        verify(userRepository).save(user);
    }

    @Test
    void changePassword_InvalidPassword_ThrowsIllegalArgumentException() {
        String email = "test@example.com";
        String oldPassword = "OldPassword123!";
        String newPassword = "weak";
        String encodedOldPassword = passwordEncoder.encode(oldPassword);

        User user = new User();
        user.setEmail(email);
        user.setPassword(encodedOldPassword);
        user.setRole(UserRole.REGULAR);

        ChangePasswordDTO dto = new ChangePasswordDTO();
        dto.setOldPassword(oldPassword);
        dto.setNewPassword(newPassword);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
        {
            userService.changePassword(email, dto);
        });

        assertEquals("Password does not meet complexity requirements", exception.getMessage());
    }

    @Test
    void changePassword_IncorrectOldPassword_ThrowsIllegalStateException() {
        String email = "test@example.com";
        String correctOldPassword = "CorrectPassword123!";
        String wrongOldPassword = "WrongPassword123!";
        String newPassword = "NewPassword123@";
        String encodedCorrectPassword = passwordEncoder.encode(correctOldPassword);

        User user = new User();
        user.setEmail(email);
        user.setPassword(encodedCorrectPassword);
        user.setRole(UserRole.REGULAR);

        ChangePasswordDTO dto = new ChangePasswordDTO();
        dto.setOldPassword(wrongOldPassword);
        dto.setNewPassword(newPassword);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        IllegalStateException exception = assertThrows(IllegalStateException.class, () ->
        {
            userService.changePassword(email, dto);
        });

        assertEquals("Old password is incorrect", exception.getMessage());
    }

    @Test
    void changePassword_SamePassword_ThrowsIllegalStateException() {
        String email = "test@example.com";
        String password = "SamePassword123!";
        String encodedPassword = passwordEncoder.encode(password);

        User user = new User();
        user.setEmail(email);
        user.setPassword(encodedPassword);
        user.setRole(UserRole.REGULAR);

        ChangePasswordDTO dto = new ChangePasswordDTO();
        dto.setOldPassword(password);
        dto.setNewPassword(password);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        IllegalStateException exception = assertThrows(IllegalStateException.class, () ->
        {
            userService.changePassword(email, dto);
        });

        assertEquals("Passwords are the same", exception.getMessage());
    }


    @Test
    void changeUserRole_shouldChangeRegularUserToAdmin() {
        // Arrange
        Long userId = 1L;
        String email = "regular.user@example.com";
        User userToUpdate = User.builder()
                .email(email)
                .role(UserRole.REGULAR)
                .build();

        userToUpdate.setId(userId);
        userToUpdate.setModifiedBy("admin@example.com");

        when(userRepository.findById(userId)).thenReturn(Optional.of(userToUpdate));

        UserDTO resultDTO = userService.changeUserRole(userId);

        assertNotNull(resultDTO);
        assertEquals(UserRole.ADMIN, resultDTO.getRole());
        assertEquals("admin@example.com", userToUpdate.getModifiedBy());
    }
}

