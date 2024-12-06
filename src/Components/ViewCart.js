import React, { useEffect, useState } from 'react';
import '../Styles/ViewCart.css';

import { useNavigate } from 'react-router-dom';
import CarItem from './CarItem';
import car1 from '../assets/images/car1.jpg';
import car2 from '../assets/images/car2.jpg';
import car3 from '../assets/images/car3.jpg';
import car4 from '../assets/images/car4.jpg';
import car5 from '../assets/images/car5.jpg';

const carImages = [car1, car2, car3, car4, car5];

function ViewCart() {
    const [cart, setCart] = useState([]); // Lista de mașini din coș
    const [loading, setLoading] = useState(true); // Stare pentru încărcare
    const [error, setError] = useState(null); // Stare pentru erori
    const navigate = useNavigate();
    const userId = localStorage.getItem('idUser'); // Preluare idUser din localStorage

    useEffect(() => {
        if (!userId) {
            setError("User ID nu este disponibil.");
            setLoading(false);
            return;
        }

        // Obține datele clientului pe baza idUser
        fetch(`http://localhost:8080/api/client/${userId}`)
            .then((response) => {
                console.log(userId)
                if (!response.ok) {
                    throw new Error("Eroare la obținerea datelor clientului");
                }
                return response.json();
            })
            .then((client) => {
                if (!client.cart || !client.cart.cars) {
                    throw new Error("Coșul nu este disponibil pentru acest client");
                }
                const carsWithImages = client.cart.cars.map((car, index) => ({
                    ...car,
                    imageUrl: index < carImages.length ? carImages[index] : null
                }));
                setCart(carsWithImages);
            })
            .catch((error) => {
                console.error("Eroare:", error);
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [userId]);

    const handleGoToOrder = () => {
        navigate('/order');
    };

    if (loading) {
        return <p>Se încarcă coșul...</p>;
    }

    if (error) {
        return <p>Eroare: {error}</p>;
    }

    return (
        <div className="view-cart-container">
            <h2>Vezi Coșul</h2>
            <p>Aici poți găsi date despre coșul tău</p>
            {cart.length > 0 ? (
                <div className="cart-items">
                    {cart.map((car, index) => (
                        <CarItem key={index} car={car} />
                    ))}
                </div>
            ) : (
                <p>Coșul este gol.</p>
            )}
            <button onClick={handleGoToOrder} disabled={cart.length === 0}>
                Comandă
            </button>
        </div>
    );

}

export default ViewCart;