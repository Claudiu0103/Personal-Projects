package backend;

import backend.entity.Bug;
import backend.entity.User;
import backend.repository.IBugRepository;
import backend.repository.IUserRepository;
import backend.service.BugService;
import backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BugServiceTest {

    @Autowired
    private IBugRepository bugRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private BugService bugService;
    @Autowired
    private UserService userService;


    @Test
    void testInsertBug() {
        User user = userRepository.findByUsername("test").orElse(null);

        Bug bug = new Bug();
        bug.setTitle("Eroare Backend");
        bug.setImageURL("fsdfsdf");
        bug.setDate("asdasd");
        bug.setText("sdfsdfsdf");
        Bug savedBug = bugService.insertBug(bug, user.getIdUser());

        assertNotNull(savedBug);
        assertEquals("Eroare Backend", savedBug.getTitle());
        assertEquals(user.getIdUser(), savedBug.getUser().getIdUser());
        bugService.deleteById(savedBug.getIdBug());
    }
}