import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Styles/Order.css';

function Order() {
    const location = useLocation();
    const navigate = useNavigate();
    const orderDetails = location.state?.order;

    if (!orderDetails) {
        return (
            <div>
                <h2>Eroare</h2>
                <p>Nu există detalii despre comandă. Vă rugăm să reveniți la pagina principală.</p>
                <button onClick={() => navigate('/')}>Înapoi la pagina principală</button>
            </div>
        );
    }

    const totalPrice = orderDetails.cars?.reduce((total, car) => total + car.price, 0) || 0;

    return (
        <div className="order-container">
            <div className="order-header">
                <h2>Detalii Comandă</h2>
            </div>
            <div className="order-details">
                <p><strong>Adresa de livrare:</strong> {orderDetails.shippingAddress}</p>
                <p><strong>Data de livrare:</strong> {orderDetails.dateOfDelivery}</p>
            </div>
            <div className="order-cars">
                {orderDetails.cars && orderDetails.cars.length > 0 ? (
                    orderDetails.cars.map((car) => (
                        <div className="order-car" key={car.idCar}>
                            <img src={car.imageUrl} alt={car.model} className="order-car-img" />
                            <div className="order-car-details">
                                <p><strong>Model:</strong> {car.model}</p>
                                <p><strong>Preț:</strong> {car.price} EUR</p>
                                <p><strong>Culoare:</strong> {car.color}</p>
                                <p><strong>Tip vehicul:</strong> {car.vehicleType}</p>
                                <p><strong>Kilometri:</strong> {car.kilometers} km</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Nu există mașini asociate acestei comenzi.</p>
                )}
            </div>
            <div className="order-total">
                <h3>Total de plată: {totalPrice} EUR</h3>
            </div>
            <button className="back-button" onClick={() => navigate('/')}>
                Înapoi la pagina principală
            </button>
        </div>
    );
}

export default Order;
