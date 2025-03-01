import {useEffect, useState} from 'react';
import React from 'react';
import CarItem from './CarItem';
import '../Styles/CarManagement.css';
import car1 from '../assets/images/car1.jpg';
import car2 from '../assets/images/car2.jpg';
import car3 from '../assets/images/car3.jpg';
import car4 from '../assets/images/car4.jpg';
import car5 from '../assets/images/car5.jpg';

const carImages = [car1, car2, car3, car4, car5];

function CarManagement() {
    const [cars, setCars] = useState([]);
    const [formData, setFormData] = useState({
        kilometers: "",
        releaseDate: "",
        model: "",
        vehicleType: "",
        price: "",
        color: "",
        imageUrl: "",
        showroomId: "",
    });
    const [showAddForm, setShowAddForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editCarId, setEditCarId] = useState(null);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = () => {
        fetch("http://localhost:8080/api/car")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Eroare la încărcarea datelor");
                }
                return response.json();
            })
            .then(data => {
                const carsWithImages = data.map((car, index) => ({
                    ...car,
                    imageUrl: car.imageUrl ? car.imageUrl : carImages[index % carImages.length],
                }));
                setCars(carsWithImages);
            })
            .catch(error => console.error("Eroare:", error));
    };


    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        const carData = {
            kilometers: parseInt(formData.kilometers, 10),
            releaseDate: formData.releaseDate,
            model: formData.model,
            vehicleType: formData.vehicleType,
            price: parseInt(formData.price, 10),
            color: formData.color,
            imageUrl: formData.imageUrl,
        };

        if (isEditing) {
            // Adaugă showroomId ca parametru în URL pentru PUT request
            const url = `http://localhost:8080/api/car/${editCarId}?showroomId=${formData.showroomId}`;

            fetch(url, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(carData),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Eroare la actualizarea datelor");
                    }
                    return response.json();
                })
                .then(() => {
                    resetForm();
                    fetchCars();
                })
                .catch(error => console.error("Eroare la actualizarea datelor:", error));
        } else {
            // Adaugă showroomId ca parametru în URL pentru POST request
            const url = `http://localhost:8080/api/car?showroomId=${formData.showroomId}`;

            fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(carData),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Eroare la trimiterea datelor");
                    }
                    return response.json();
                })
                .then(() => {
                    resetForm();
                    fetchCars();
                })
                .catch(error => console.error("Eroare la trimiterea datelor:", error));
        }
    };

    const handleDelete = (idCar) => {
        fetch(`http://localhost:8080/api/car/${idCar}`, {
            method: "DELETE",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Eroare la ștergerea mașinii");
                }
                setCars(cars.filter(car => car.idCar !== idCar));
            })
            .catch(error => console.error("Eroare la ștergerea mașinii:", error));
    };

    const handleEdit = (car) => {
        console.log("Edit car data:", car); // Afișează datele mașinii pentru a verifica ce conține

        setIsEditing(true);
        setEditCarId(car.idCar);

        // Asigură-te că showroomId este setat corect din showroom.idShowroom
        setFormData({
            kilometers: car.kilometers || "",
            releaseDate: car.releaseDate || "",
            model: car.model || "",
            vehicleType: car.vehicleType || "",
            price: car.price || "",
            color: car.color || "",
            imageUrl: car.imageUrl || "",
            showroomId: car.showroom?.idShowroom || "", // Extrage idShowroom din showroom
        });
        setShowAddForm(true);
    };

    const handleCancelEdit = () => {
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            kilometers: "",
            releaseDate: "",
            model: "",
            vehicleType: "",
            price: "",
            color: "",
            imageUrl: "",
            showroomId: "",
        });
        setShowAddForm(false);
        setIsEditing(false);
        setEditCarId(null);
    };

    return (
        <div>
            <h3>Management Mașini</h3>

            <div className="button-container">
                <button onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm && !isEditing ? "Anulează" : "Adaugă Mașină"}
                </button>
            </div>
            {showAddForm && (
                <div className="add-form">
                    <h3>{isEditing ? "Editează Mașina" : "Adaugă Mașină Nouă"}</h3>
                    <label>
                        Kilometri:
                        <input
                            type="number"
                            name="kilometers"
                            value={formData.kilometers}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Data Lansării:
                        <input
                            type="text"
                            name="releaseDate"
                            value={formData.releaseDate}
                            onChange={handleInputChange}
                            placeholder="14-11-2014"
                        />
                    </label>
                    <label>
                        Model:
                        <input
                            type="text"
                            name="model"
                            value={formData.model}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Tip Vehicul:
                        <input
                            type="text"
                            name="vehicleType"
                            value={formData.vehicleType}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Preț:
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Culoare:
                        <input
                            type="text"
                            name="color"
                            value={formData.color}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Image URL:
                        <input
                            type="text"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}/>
                    </label>
                    <label>
                        ID Showroom:
                        <input
                            type="number"
                            name="showroomId"
                            value={formData.showroomId}
                            onChange={handleInputChange}
                        />
                    </label>
                    <button onClick={handleSubmit}>{isEditing ? "Actualizează" : "Trimite"}</button>
                    {isEditing && <button onClick={handleCancelEdit}>Anulează Editarea</button>}
                </div>
            )}

            <div className="car-list">
                {cars.length > 0 ? (
                    cars.map((car) => (
                        <div key={car.idCar} className="car-item-container">
                            <CarItem
                                car={car}
                                imageUrl={car.imageUrl}
                            />
                            <div className="car-item-buttons">
                                <button onClick={() => handleEdit(car)}>Editează</button>
                                <button onClick={() => handleDelete(car.idCar)}>Șterge</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Nu există mașini disponibile.</p>
                )}
            </div>
        </div>
    );
}

export default CarManagement;
