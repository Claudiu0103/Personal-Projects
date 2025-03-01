package IS.Proiect.payment;

import IS.Proiect.cart.Cart;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;


@Entity
@Table
public class Payment {
    @Id
    @SequenceGenerator(
            name = "payment_sequence",
            sequenceName = "payment_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "payment_sequence"
    )
    private Integer idPayment;
    private String shippingAddress;
    private String dateOfDelivery;
    private String cardNumber;
    private String expiryDate;
    private String cvv;
    private String cardHolderName;
    @OneToOne
    @JoinColumn(name = "cart_id", referencedColumnName = "idCart", unique = true)
    @JsonBackReference
    private Cart cart;

    public Payment() {

    }

    public Payment(Integer idPayment, String shippingAddress, String dateOfDelivery, String cardNumber, String expiryDate, String cvv, String cardHolderName, Cart cart) {
        this.idPayment = idPayment;
        this.shippingAddress = shippingAddress;
        this.dateOfDelivery = dateOfDelivery;
        this.cardNumber = cardNumber;
        this.expiryDate = expiryDate;
        this.cvv = cvv;
        this.cardHolderName = cardHolderName;
        this.cart = cart;
    }

    public Payment(Integer idPayment, String shippingAddress, Cart cart, String dateOfDelivery) {
        this.idPayment = idPayment;
        this.shippingAddress = shippingAddress;
        this.cart = cart;
        this.dateOfDelivery = dateOfDelivery;
    }

    public Payment(String shippingAddress, Cart cart, String dateOfDelivery) {
        this.shippingAddress = shippingAddress;
        this.cart = cart;
        this.dateOfDelivery = dateOfDelivery;
    }


    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getDateOfDelivery() {
        return dateOfDelivery;
    }

    public void setDateOfDelivery(String dateOfDelivery) {
        this.dateOfDelivery = dateOfDelivery;
    }

    public Integer getIdPayment() {
        return idPayment;
    }

    public void setIdPayment(Integer idPayment) {
        this.idPayment = idPayment;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }

    public String getCardHolderName() {
        return cardHolderName;
    }

    public void setCardHolderName(String cardHolderName) {
        this.cardHolderName = cardHolderName;
    }

    @Override
    public String toString() {
        return "Payment{" +
                "idPayment=" + idPayment +
                ", shippingAddress='" + shippingAddress + '\'' +
                ", dateOfDelivery='" + dateOfDelivery + '\'' +
                ", cardNumber='" + cardNumber + '\'' +
                ", expiryDate='" + expiryDate + '\'' +
                ", cvv='" + cvv + '\'' +
                ", cardHolderName='" + cardHolderName + '\'' +
                ", cart=" + cart +
                '}';
    }
}