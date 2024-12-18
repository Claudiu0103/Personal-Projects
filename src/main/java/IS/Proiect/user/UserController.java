package IS.Proiect.user;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping(path = "api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getUsers() {
        return userService.getUsers();
    }

    @GetMapping("/csrf-token")
    public CsrfToken getCsrfToken(HttpServletRequest request) {
        return (CsrfToken) request.getAttribute("_csrf");
    }

//    @PostMapping
//    public void registerNewUser(@RequestBody User user) {
//        userService.addNewUser(user);
//    }

    @DeleteMapping(path = "{idUser}")
    public void deleteUser(@PathVariable("idUser") Integer id) {
        userService.deleteUser(id);
    }

    @PutMapping(path = "{idUser}")
    public void updateCar(@PathVariable("idUser") Integer id, @RequestParam(required = false) String password) {
        userService.updateUser(id, password);
    }
}