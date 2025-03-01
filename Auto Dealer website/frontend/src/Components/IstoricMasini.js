import React, { useEffect, useState } from 'react';
import '../Styles/CarHistory.css';

function CarHistory() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = localStorage.getItem('idUser');

    useEffect(() => {
        if (!userId) {
            setError("User ID nu este disponibil.");
            setLoading(false);
            return;
        }

        fetch(`http://localhost:8080/api/payment/user/${userId}/details`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Eroare la încărcarea plăților și mașinilor.");
                }
                return response.json();
            })
            .then((data) => setPayments(data))
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false));
    }, [userId]);

    if (loading) {
        return <p className="message loading">Se încarcă istoricul...</p>;
    }

    if (error) {
        return <p className="message error">Eroare: {error}</p>;
    }

    // Funcție pentru calcularea prețului total al mașinilor dintr-un payment
    const calculateTotalPrice = (cars) => {
        return cars.reduce((total, car) => total + car.price, 0);
    };

    return (
        <div className="car-history-container">
            <h2 className="car-history-header">Istoric Comenzi</h2>
            <div className="payment-list">
                {payments.length > 0 ? (
                    payments.map((payment) => (
                        <div key={payment.idPayment} className="payment-item">
                            <p>Adresa de livrare: {payment.shippingAddress}</p>
                            <p>Data livrării: {payment.dateOfDelivery}</p>
                            <hr />
                            <h4>Mașini din comandă:</h4>
                            <div className="car-list">
                                {payment.cars.length > 0 ? (
                                    payment.cars.map((car) => (
                                        <div key={car.idCar} className="car-item">
                                            <div className="car-image">
                                                {car.imageUrl ? (
                                                    <img src={car.imageUrl} alt={car.model} />
                                                ) : (
                                                    <p>Imagine indisponibilă</p>
                                                )}
                                            </div>
                                            <div className="car-info">
                                                <h3>{car.model}</h3>
                                                <p>Kilometers: {car.kilometers}</p>
                                                <p>Release Date: {car.releaseDate}</p>
                                                <p>Vehicle Type: {car.vehicleType}</p>
                                                <p>Price: {car.price} €</p>
                                                <p>Color: {car.color}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Nu există mașini asociate acestei plăți.</p>
                                )}
                            </div>
                            {/* Preț total pentru acest payment */}
                            <h4>Preț Total: {calculateTotalPrice(payment.cars)} €</h4>
                        </div>
                    ))
                ) : (
                    <p>Nu există plăți înregistrate.</p>
                )}
            </div>
        </div>
    );
}

export default CarHistory;
