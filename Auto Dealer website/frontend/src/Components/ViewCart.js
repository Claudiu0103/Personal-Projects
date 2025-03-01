import React, {useEffect, useState} from 'react';
import '../Styles/ViewCart.css';
import {useNavigate} from 'react-router-dom';
import CarItem from './CarItem';
import car1 from '../assets/images/car1.jpg';
import car2 from '../assets/images/car2.jpg';
import car3 from '../assets/images/car3.jpg';
import car4 from '../assets/images/car4.jpg';
import car5 from '../assets/images/car5.jpg';
import PaymentForm from "./PaymentForm";

const carImages = [car1, car2, car3, car4, car5];

function ViewCart({setIsViewCart}) {
    const [cart, setCart] = useState([]);
    const [cartId, setCartId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('idUser');
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const handleRemoveFromCart = (cartId, carId) => {
        fetch(`http://localhost:8080/api/cart/${cartId}/remove-car/${carId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Eroare la ștergerea mașinii din coș');
                }
                setCart(cart.filter((car) => car.idCar !== carId));
                alert('Mașina a fost eliminată din coș.');
            })
            .catch((error) => {
                console.error('Eroare:', error);
                alert('A apărut o problemă: ' + error.message);
            });
    };


    useEffect(() => {
        setIsViewCart(true);
        if (!userId) {
            setError('User ID nu este disponibil.');
            setLoading(false);
            return;
        }

        fetch(`http://localhost:8080/api/client/${userId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Eroare la obținerea datelor clientului');
                }
                return response.json();
            })
            .then((client) => {
                console.log('Datele clientului:', client);

                if (!client.carts || client.carts.length === 0) {
                    setCart([]); // Coșul este gol
                    setCartId(null);
                    return;
                }

                const currentCart = client.carts.find(cart => cart.payment === null);
                console.log('Coș curent:', currentCart);

                if (!currentCart) {
                    setCart([]); // Coșul curent este gol
                    setCartId(null);
                    return;
                }

                setCartId(currentCart.idCart);

                // Obține mașinile prin entitatea intermediară
                fetch(`http://localhost:8080/api/cart/${currentCart.idCart}/cars`)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Eroare la obținerea mașinilor din coș');
                        }
                        return response.json();
                    })
                    .then((cars) => {
                        const carsWithImages = cars.map((car, index) => ({
                            ...car,
                            imageUrl: car.imageUrl || (index < carImages.length ? carImages[index] : null),
                        }));
                        setCart(carsWithImages);
                    })
                    .catch((error) => {
                        console.error('Eroare:', error);
                        setError(error.message);
                    });
            })
            .catch((error) => {
                console.error('Eroare:', error);
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [setIsViewCart, userId]);




    const handlePaymentSubmit = (paymentDetails) => {
        fetch(`http://localhost:8080/api/cart/${cartId}/create-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentDetails),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Eroare la crearea plății.');
                }
                return response.json();
            })
            .then((responseMap) => {
                const orderDetails = {
                    shippingAddress: responseMap.shippingAddress,
                    cardNumber: responseMap.cardNumber,
                    expiryDate: responseMap.expiryDate,
                    cvv: responseMap.cvv,
                    cardHolderName: responseMap.cardHolderName,
                    dateOfDelivery: responseMap.dateOfDelivery,
                    cars: cart,
                    cartId: cartId,
                    idPayment: responseMap.idPayment,
                };

                console.log('Detalii comandă:', orderDetails);

                return fetch(`http://localhost:8080/api/client/${userId}/create-cart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Eroare la crearea unui nou coș.');
                        }
                        return response.json();
                    })
                    .then((newCart) => {
                        console.log('Coș nou creat:', newCart);
                        setCartId(newCart.idCart);
                        setCart([]);
                        alert('Plata a fost realizată cu succes și un nou coș a fost creat!');
                        navigate('/order', { state: { order: orderDetails } });
                    });
            })
            .catch((error) => alert('Eroare: ' + error.message));
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
                        <CarItem
                            key={car.idCar}
                            car={car}
                            handleRemoveFromCart={(carId) => handleRemoveFromCart(cartId, carId)}
                            isViewCart={true}
                            cartId={cartId}
                        />
                    ))}

                    {!showPaymentForm && (
                        <button onClick={() => setShowPaymentForm(true)} disabled={cart.length === 0}>
                            Continuă la Plată
                        </button>
                    )}
                    {showPaymentForm && <PaymentForm onSubmit={handlePaymentSubmit} />}
                </div>
            ) : (
                <p>Coșul este gol. Adaugă produse pentru a continua!</p>
            )}
        </div>
    );

}

export default ViewCart;
