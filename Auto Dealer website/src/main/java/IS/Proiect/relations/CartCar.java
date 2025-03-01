package IS.Proiect.relations;

import IS.Proiect.car.Car;
import IS.Proiect.cart.Cart;
import jakarta.persistence.*;

@Entity
@Table
public class CartCar {
    @Id
    @SequenceGenerator(
            name = "cartCar_sequence",
            sequenceName = "cartCar_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "cartCar_sequence"
    )
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car;

    public CartCar() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public Car getCar() {
        return car;
    }

    public void setCar(Car car) {
        this.car = car;
    }
}

