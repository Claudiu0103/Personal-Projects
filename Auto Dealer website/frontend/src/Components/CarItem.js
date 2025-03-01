function CarItem({ car, viewCarList, handleRemoveFromCart, isViewCart }) {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    const handleAddToCart = () => {
        const userId = localStorage.getItem('idUser');
        if (!userId) {
            alert("User ID nu este disponibil.");
            return;
        }

        fetch(`http://localhost:8080/api/client/${userId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Eroare la obținerea datelor clientului");
                }
                return response.json();
            })
            .then((client) => {
                console.log("Lista de coșuri:", client.carts);

                const activeCart = client.carts.find(cart => !cart.payment);
                if (!activeCart) {
                    throw new Error("Nu există un coș activ pentru acest client.");
                }

                console.log("Coș activ:", activeCart);

                const cartId = activeCart.idCart;

                // Verifică dacă mașina există deja în coș
                return fetch(`http://localhost:8080/api/cart/${cartId}/cart-cars`)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Eroare la verificarea mașinilor din coș.");
                        }
                        return response.json();
                    })
                    .then((cartCars) => {
                        const carExists = cartCars.some(cartCar => cartCar.car.idCar === car.idCar);
                        if (carExists) {
                            alert("Mașina este deja în coș!");
                            return;
                        }

                        return fetch(`http://localhost:8080/api/cart/${cartId}/add-car/${car.idCar}`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });
                    });
            })
            .then((response) => {
                if (response && !response.ok) {
                    throw new Error("Eroare la adăugarea mașinii în coș");
                }
                if (response) alert("Mașina a fost adăugată în coș cu succes!");
            })
            .catch((error) => {
                console.error("Eroare:", error);
                alert("A apărut o problemă: " + error.message);
            });
    };

    const handleAddToFavorites = () => {
        const userId = localStorage.getItem('idUser');
        if (!userId) {
            alert("User ID nu este disponibil.");
            return;
        }

        // Verifică dacă mașina este deja la favorite
        fetch(`http://localhost:8080/api/favorites/${userId}/exists/${car.idCar}`)
            .then((response) => {
                console.log(response)
                if (!response.ok) {
                    throw new Error("Eroare la verificarea mașinii în favorite.");
                }
                return response.json();
            })
            .then((exists) => {
                if (exists) {
                    alert("Mașina este deja în lista de favorite!");
                } else {
                    // Adaugă mașina la favorite
                    fetch(`http://localhost:8080/api/favorites/${userId}/add-car/${car.idCar}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error("Eroare la adăugarea mașinii la favorite.");
                            }
                            alert("Mașina a fost adăugată la favorite cu succes!");
                        });
                }
            })
            .catch((error) => {
                console.error("Eroare:", error);
                alert("A apărut o problemă: " + error.message);
            });
    };

    return (
        <div className="car-item">
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

                {isAuthenticated && viewCarList && (
                    <div className="button-group2">
                        <button className="button" onClick={handleAddToCart}>
                            Adaugă în coș
                            <svg className="cartIcon" viewBox="0 0 576 512">
                                <path
                                    d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"
                                ></path>
                            </svg>
                        </button>
                        <button className="button" onClick={handleAddToFavorites}>
                            Adaugă la favorite
                            <svg className="cartIcon" viewBox="0 0 576 512">
                                <path
                                    d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36-17.7 54.6l105.7 103L120.6 470c-4.5 26.3 23 46 46.4 33.7L288 405.3l121 98.4c23.4 12.2 50.9-7.4 46.4-33.7l-15.2-140.9 105.7-103c19-18.6 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
                                ></path>
                            </svg>
                        </button>
                    </div>
                )}

                {isViewCart && isAuthenticated && handleRemoveFromCart && (
                    <button onClick={() => handleRemoveFromCart(car.idCar)}>Șterge din Coș</button>
                )}
            </div>
        </div>
    );
}

export default CarItem;
