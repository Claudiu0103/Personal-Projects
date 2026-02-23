package backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor

public class VoteSummary {
    private int bugUpvotes;
    private int bugDownvotes;
    private int commentUpvotes;
    private int commentDownvotes;
    private int givenCommentDownvotes;
}
