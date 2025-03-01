import React, { useEffect, useState } from 'react';
import '../Styles/Favorites.css';

function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem('idUser');

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:8080/api/favorites/${userId}`)
                .then((response) => {
                    if (!response.ok) throw new Error("Eroare la încărcarea mașinilor favorite.");
                    return response.json();
                })
                .then((data) => {
                    console.log("Date favorite:", data); // Log pentru debugging
                    setFavorites(data); // `data` este o listă de obiecte Car
                })
                .catch((err) => setError(err.message));
        }
    }, [userId]);

    return (
        <div className="favorites-container">
            <h2 className="favorites-title">Mașinile Favorite</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {favorites.length > 0 ? (
                <div className="favorites-list">
                    {favorites.map((car) => (
                        <div key={car.idCar} className="favorites-item">
                            <h3>{car.model || 'Model necunoscut'}</h3>
                            <p>Price: {car.price ? `${car.price} €` : 'N/A'}</p>
                            <p>Color: {car.color || 'N/A'}</p>
                            <p>Kilometers: {car.kilometers || 'N/A'}</p>
                            <p>Release Date: {car.releaseDate || 'N/A'}</p>
                            <img
                                src={car.imageUrl || '/default-image.jpg'}
                                alt={car.model || 'Car'}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p>Nu ai adăugat nicio mașină la favorite.</p>
            )}
        </div>
    );
}

export default Favorites;
