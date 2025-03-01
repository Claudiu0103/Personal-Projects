import React, { useEffect, useState } from 'react';
function DataManagement() {
    const [clientData, setClientData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        lastName: "",
        firstName: "",
        email: "",
        address: "",
        phone: ""
    });
    const userId = localStorage.getItem('idUser');

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:8080/api/client/${userId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Eroare la încărcarea datelor clientului");
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Data received from backend:", data);
                    setClientData(data);
                    setFormData(data);
                })
                .catch(error => console.error("Eroare:", error));
        } else {
            console.error("User ID nu este disponibil!");
        }
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSave = (event) => {
        event.preventDefault();
        fetch(`http://localhost:8080/api/client/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                console.log("Raw response from server:", response);
                if (!response.ok) {
                    throw new Error("Eroare la actualizarea datelor clientului");
                }
                return response.json();
            })
            .then(updatedData => {
                setClientData(updatedData);
                setIsEditing(false);
                window.location.href = "http://localhost:3000/data-management";
            })
            .catch(error => console.error("Eroare:", error));
    };

    return (
        <div className="DataManagement">
            <h2>Datele Clientului</h2>
            {clientData ? (
                <div>
                    {isEditing ? (
                        <form>
                            <label>
                                Nume:
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Prenume:
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Email:
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Adresă:
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Telefon:
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <button onClick={handleSave}>Salvează</button>
                            <button
                                type="button"
                                className="cancel"
                                onClick={() => setIsEditing(false)}
                            >
                                Anulează
                            </button>
                        </form>
                    ) : (
                        <div>
                            <p>Nume: {clientData.lastName}</p>
                            <p>Prenume: {clientData.firstName}</p>
                            <p>Email: {clientData.email}</p>
                            <p>Adresă: {clientData.address}</p>
                            <p>Telefon: {clientData.phone}</p>
                            <button onClick={() => setIsEditing(true)}>Editează</button>
                        </div>
                    )}
                </div>
            ) : (
                <p>Se încarcă datele clientului...</p>
            )}
        </div>
    );
}

export default DataManagement;
