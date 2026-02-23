package backend.controller;

import backend.entity.User;
import backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.retrieveUsers();
    }

    @PostMapping("/ban/{username}")
    public ResponseEntity<String> banUser(@PathVariable String username) {
        userService.setBannedStatus(username, true);
        return ResponseEntity.ok("User " + username + " has been banned.");
    }

    @PostMapping("/unban/{username}")
    public ResponseEntity<String> unbanUser(@PathVariable String username) {
        userService.setBannedStatus(username, false);
        return ResponseEntity.ok("User " + username + " has been unbanned.");
    }

    @PutMapping("/promote/{username}")
    public ResponseEntity<String> promoteUserToAdmin(@PathVariable String username) {
        userService.promoteToAdmin(username);
        return ResponseEntity.ok("User " + username + " has been promoted to ADMIN.");
    }
}
