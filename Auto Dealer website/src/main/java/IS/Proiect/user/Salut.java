package IS.Proiect.user;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class Salut {
    @GetMapping("/")
    public String salut() {
        return "salut";
    }
}
