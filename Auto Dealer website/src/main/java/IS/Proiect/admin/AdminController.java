package IS.Proiect.admin;

import IS.Proiect.client.Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public List<Admin> getAdmins() {
        return adminService.getAdmins();
    }

    @PostMapping
    public void registerNewAdmin(@RequestBody Admin admin) {
        adminService.addNewAdmin(admin);
    }

    @DeleteMapping(path = "{idAdmin}")
    public void deleteAdmin(@PathVariable("idAdmin") Integer id) {
        adminService.deleteAdmin(id);
    }

    @PutMapping(path ="{idUser}")
    public ResponseEntity<Admin> updateClient(@PathVariable Integer idUser, @RequestBody Admin updatedAdmin) {
        Admin admin = adminService.getAdmin(idUser);
        if (admin == null) {
            return ResponseEntity.notFound().build();
        }
        admin.setFirstName(admin.getFirstName());
        admin.setLastName(admin.getLastName());
        return ResponseEntity.ok(admin);
    }
}
