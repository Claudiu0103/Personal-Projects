package backend.dto;

import java.util.List;

public class BugDTO {
    private Long id;
    private String title;
    private String text;
    private String date;
    private String imageURL;
    private String status;
    private Long userId;
    private String username;
    private List<String> tagNames;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<String> getTagNames() {
        return tagNames;
    }

    public void setTagNames(List<String> tagNames) {
        this.tagNames = tagNames;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String toString() {
        return "BugRequest{" +
                "title='" + title + '\'' +
                ", text='" + text + '\'' +
                ", date='" + date + '\'' +
                ", imageURL='" + imageURL + '\'' +
                ", idUser=" + userId +
                ", tags=" + tagNames +
                '}';
    }
}
