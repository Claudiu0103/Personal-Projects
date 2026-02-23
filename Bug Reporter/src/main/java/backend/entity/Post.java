package backend.entity;

import jakarta.persistence.*;

@MappedSuperclass
public abstract class Post {

    @Column(name="text", nullable = false)
    private String text;

    @Column(name = "imageurl", columnDefinition = "TEXT")
    private String imageURL;

    @Column(name="dateAndTime", nullable = false)
    private String date;

    public Post() {}

    public Post(String text, String imageURL, String date) {
        this.text = text;
        this.imageURL = imageURL;
        this.date = date;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
