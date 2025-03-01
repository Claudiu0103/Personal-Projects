package IS.Proiect.admin;

import IS.Proiect.admin.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class AdminService {
    @Autowired
    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public List<Admin> getAdmins() {
        return adminRepository.findAll();
    }
    public Admin getAdmin(int id) {
        return adminRepository.findByIdUser(id).orElseThrow(() -> new IllegalArgumentException("Admin with id " + id + " not found"));
    }
    public void addNewAdmin(Admin admin) {

        if (admin.getFirstName() == null || admin.getLastName() == null) {
            throw new IllegalStateException("Invalid Name");
        }
        adminRepository.save(admin);
    }

    public void deleteAdmin(Integer id) {
        boolean exists = adminRepository.existsById(id);
        if (!exists) {
            throw new IllegalStateException("Admin with id " + id + " doesn't exists");
        }
        adminRepository.deleteById(id);
    }

    @Transactional
    public void updateAdmin(Integer id, String firstName) {
        Admin admin = adminRepository.findById(id).orElseThrow(() -> new IllegalStateException("Admin with id " + id + " doesn't exists"));
        if (firstName != null && !Objects.equals(admin.getFirstName(), firstName)) {
            if (admin.getFirstName() == null) {
                throw new IllegalStateException("Invalid Name");
            }
            admin.setFirstName(firstName);
        }
    }
    public void save(Admin client) {
        adminRepository.save(client);
    }
}
