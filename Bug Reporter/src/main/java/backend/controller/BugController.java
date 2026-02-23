package backend.controller;

import backend.dto.BugDTO;
import backend.entity.Bug;
import backend.service.BugService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/bug")
@CrossOrigin
public class BugController {

    @Autowired
    private BugService bugService;

    @GetMapping("/getAll")
    public ResponseEntity<List<BugDTO>> getAllBugs() {
        try {
            List<Bug> bugs = bugService.retrieveBugs();
            List<BugDTO> bugDTOs = bugs.stream()
                    .map(bug -> bugService.convertToDTO(bug))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(bugDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }



    @GetMapping("/getById/{id}")
    @ResponseBody
    public ResponseEntity<BugDTO> getBugById(@PathVariable Long id) {

        Bug bug = this.bugService.retrieveBugById(id);
        return ResponseEntity.ok(bugService.convertToDTO(bug));
    }

    /*@PostMapping("/addBug")
    public ResponseEntity<Bug> addBug(@RequestBody String title,
                                      @RequestParam String text,
                                      @RequestParam String date,
                                      @RequestParam String status,
                                      @RequestParam Long userId) {
        Bug bug = new Bug();
        bug.setTitle(title);
        bug.setText(text);
        bug.setDate(date);
        bug.setStatus(status);
        Bug savedBug = bugService.insertBug(bug, userId);
        return ResponseEntity.ok(savedBug);
    }*/

    @PostMapping("/addBug")
    public ResponseEntity<Bug> addBug(@RequestBody BugDTO bugDTO) {
        try {
            Bug savedBug = bugService.addBugWithTags(bugDTO.getTitle(), bugDTO.getText(), bugDTO.getDate(), bugDTO.getImageURL(), bugDTO.getUserId(), bugDTO.getTagNames());
            return ResponseEntity.ok(savedBug);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @PutMapping("/updateBug/{idBug}")
    public ResponseEntity<BugDTO> updateBug(@PathVariable Long idBug, @RequestBody BugDTO bugDTO) {
        Bug updatedBug = bugService.updateBug(idBug, bugService.convertToBug(bugDTO));
        BugDTO bugDTO2 = bugService.convertToDTO(updatedBug);
        return ResponseEntity.ok(bugDTO2);
    }


    @DeleteMapping("/deleteById/{idBug}")
    public String deleteBugById(@PathVariable Long idBug) {
        return this.bugService.deleteById(idBug);
    }
}
