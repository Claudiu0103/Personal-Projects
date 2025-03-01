package IS.Proiect.showroom;

import IS.Proiect.admin.Admin;
import IS.Proiect.admin.AdminService;
import IS.Proiect.car.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/showroom")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowroomController {

    private final ShowroomService showroomService;
    private final AdminService adminService;

    @Autowired
    public ShowroomController(ShowroomService showroomService, AdminService adminService) {
        this.showroomService = showroomService;
        this.adminService = adminService;
    }

    @GetMapping
    public List<Showroom> getShowrooms() {
        return showroomService.getShowrooms();
    }

    @PostMapping
    public ResponseEntity<Showroom> registerNewShowroom(@RequestBody Showroom showroom, @RequestParam Integer adminId) {
        try {
            Admin admin = adminService.getAdmin(adminId);
            if (admin == null) {
                throw new IllegalArgumentException("Administratorul cu ID " + adminId + " nu există.");
            }
            showroom.setAdmin(admin);
            Showroom savedShowroom = showroomService.addNewShowroom(showroom);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedShowroom);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @DeleteMapping(path = "{idShowroom}")
    public void deleteShowroom(@PathVariable("idShowroom") Integer id) {
        showroomService.deleteShowroom(id);
    }

    @PutMapping(path = "{idShowroom}")
    public ResponseEntity<Showroom> updateShowroom(
            @PathVariable("idShowroom") Integer idShowroom,
            @RequestBody Showroom updatedShowroom,
            @RequestParam(required = false) Integer adminId) {
        try {
            if (adminId != null) {
                Admin admin = adminService.getAdmin(adminId);
                updatedShowroom.setAdmin(admin);
            }
            showroomService.updateShowroom(idShowroom, updatedShowroom);

            return ResponseEntity.ok(updatedShowroom);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }



}
