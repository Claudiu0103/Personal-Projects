package backend.controller;

import backend.entity.User;
import backend.dto.LogInRequest;
import backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/getAll")
    @ResponseBody
    public List<User> getAllBugs() {
        return this.userService.retrieveUsers();
    }

    @GetMapping("/getById/{id}")
    @ResponseBody
    public User getUserById(@PathVariable Long id) {
        return this.userService.retrieveUserById(id);
    }

    @PostMapping("/register")
    @ResponseBody
    public User register(@RequestBody User user) {
        return this.userService.insertUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LogInRequest loginRequest) {
        try {
            String username = loginRequest.getUsername();
            String password = loginRequest.getPassword();
            String token = userService.verifyUser(username, password);
            User user = userService.retrieveUserByUsername(username);
            Long idUser = user.getIdUser();

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", username);
            response.put("userId", idUser);
            response.put("role", user.getRole());
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }


    @PutMapping("/updateUser")
    @ResponseBody
    public User updateUser(@RequestBody User user) {
        return this.userService.insertUser(user);
    }

    @DeleteMapping("/deleteById")
    @ResponseBody
    public String deleteUserById(@RequestParam Long id) {
        return this.userService.deleteById(id);
    }


}
