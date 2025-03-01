package IS.Proiect.car;

import IS.Proiect.showroom.Showroom;
import jakarta.persistence.*;

@Entity
@Table
public class Car {
    @Id
    @SequenceGenerator(
            name = "car_sequence",
            sequenceName = "car_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "car_sequence"
    )
    private Integer idCar;
    private Integer kilometers;
    private String releaseDate;
    private String model;
    private String vehicleType;
    private Integer price;
    private String color;
    @Column(length = 65535)
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "showroom_id", referencedColumnName = "idShowroom")
    private Showroom showroom;

    public Car() {

    }

    public Car(Integer idCar,
               Integer kilometers,
               String releaseDate,
               String model,
               String vehicleType,
               Integer price,
               String color,
               String imageUrl,
               Showroom showroom) {
        this.idCar = idCar;
        this.kilometers = kilometers;
        this.releaseDate = releaseDate;
        this.model = model;
        this.vehicleType = vehicleType;
        this.price = price;
        this.color = color;
        this.imageUrl = imageUrl;
        this.showroom = showroom;
    }

    public Car(Integer kilometers,
               String releaseDate,
               String model,
               String vehicleType,
               Integer price,
               String color,
               String imageUrl,
               Showroom showroom) {
        this.kilometers = kilometers;
        this.releaseDate = releaseDate;
        this.model = model;
        this.vehicleType = vehicleType;
        this.price = price;
        this.color = color;
        this.imageUrl = imageUrl;
        this.showroom = showroom;
    }

    public Integer getIdCar() {
        return idCar;
    }

    public void setIdCar(Integer idCar) {
        this.idCar = idCar;
    }

    public Integer getKilometers() {
        return kilometers;
    }

    public void setKilometers(Integer kilometers) {
        this.kilometers = kilometers;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Showroom getShowroom() {
        return showroom;
    }

    public void setShowroom(Showroom showroom) {
        this.showroom = showroom;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @Override
    public String toString() {
        return "Car{" +
                "idCar=" + idCar +
                ", kilometers=" + kilometers +
                ", releaseDate='" + releaseDate + '\'' +
                ", model='" + model + '\'' +
                ", vehicleType='" + vehicleType + '\'' +
                ", price=" + price +
                ", color='" + color + '\'' +
                ", showroom=" + showroom +
                '}';
    }
}