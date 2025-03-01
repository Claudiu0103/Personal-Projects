package IS.Proiect.relations;

import IS.Proiect.car.Car;
import IS.Proiect.client.Client;
import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;

@Entity
@Table
public class FavoriteCar {
    @Id
    @SequenceGenerator(
            name = "favoriteCar_sequence",
            sequenceName = "favoriteCar_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "favoriteCar_sequence"
    )
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "client_id", referencedColumnName = "idClient", nullable = false)
    private Client client;

    @ManyToOne
    @JoinColumn(name = "car_id", referencedColumnName = "idCar", nullable = false)
    private Car car;

    public FavoriteCar() {
    }

    public FavoriteCar(Client client, Car car) {
        this.client = client;
        this.car = car;
    }

    public Integer getId() {
        return id;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Car getCar() {
        return car;
    }

    public void setCar(Car car) {
        this.car = car;
    }
}
