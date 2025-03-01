import { useEffect, useState } from 'react';
import React from 'react';
import CarItem from './CarItem';
import '../Styles/CarList.css';
import car1 from '../assets/images/car1.jpg';
import car2 from '../assets/images/car2.jpg';
import car3 from '../assets/images/car3.jpg';
import car4 from '../assets/images/car4.jpg';
import car5 from '../assets/images/car5.jpg';

const carImages = [car1, car2, car3, car4, car5];

function CarList({ setViewCarList }) {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        model: '',
        maxPrice: '',
        maxKilometers: '',
    });

    useEffect(() => {
        setViewCarList(true);

        fetch("http://localhost:8080/api/car")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Eroare la încărcarea datelor");
                }
                return response.json();
            })
            .then(data => {
                console.log("Date primite din backend:", data);
                const carsWithImages = data.map((car, index) => ({
                    ...car,
                    imageUrl: car.imageUrl || (index < carImages.length ? carImages[index] : null),
                }));
                setCars(carsWithImages);
                setFilteredCars(carsWithImages);
            })
            .catch(error => {
                console.error("Eroare:", error);
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [setViewCarList]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        const { model, maxPrice, maxKilometers } = filters;
        let filtered = cars;

        if (model) {
            filtered = filtered.filter(car => car.model.toLowerCase().includes(model.toLowerCase()));
        }

        if (maxPrice) {
            filtered = filtered.filter(car => car.price <= parseInt(maxPrice, 10));
        }

        if (maxKilometers) {
            filtered = filtered.filter(car => car.kilometers <= parseInt(maxKilometers, 10));
        }

        setFilteredCars(filtered);
    };

    if (loading) {
        return <p>Se încarcă lista de mașini...</p>;
    }

    if (error) {
        return <p>Eroare: {error}</p>;
    }

    return (
        <div>
            <h2>Mașinile Disponibile</h2>
            <div className="filter-container">
                <select
                    name="model"
                    value={filters.model}
                    onChange={handleFilterChange}
                >
                    <option value="">Toate modelele</option>
                    <option value="Audi">Audi</option>
                    <option value="BMW">BMW</option>
                    <option value="Mercedes">Mercedes</option>
                    <option value="Ford">Ford</option>
                    <option value="Volkswagen">Volkswagen</option>
                </select>
                <input
                    type="number"
                    name="maxPrice"
                    placeholder="Preț maxim"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                />
                <input
                    type="number"
                    name="maxKilometers"
                    placeholder="Kilometri maxim"
                    value={filters.maxKilometers}
                    onChange={handleFilterChange}
                />
                <button onClick={applyFilters}>Aplică Filtre</button>
            </div>
            <div className="car-list">
                {filteredCars.length > 0 ? (
                    filteredCars.map((car, index) => (
                        <CarItem key={index} car={car} viewCarList={true} />
                    ))
                ) : (
                    <p>Nu există mașini disponibile care să respecte criteriile.</p>
                )}
            </div>
        </div>
    );
}

export default CarList;
