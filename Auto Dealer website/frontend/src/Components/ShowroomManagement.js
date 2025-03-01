import {useEffect, useState} from 'react';
import React from 'react';
import ShowroomItem from './ShowroomItem';
import '../Styles/ShowroomManagement.css';

function ShowroomList({userRole}) {
    const [showrooms, setShowrooms] = useState([]);
    const [selectedShowroom, setSelectedShowroom] = useState(null);
    const [updatedName, setUpdatedName] = useState("");
    const [updatedLocation, setUpdatedLocation] = useState("");
    const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState("");
    const [updatedEmail, setUpdatedEmail] = useState("");
    const [updatedAdminId, setUpdatedAdminId] = useState("");

    const [newName, setNewName] = useState("");
    const [newLocation, setNewLocation] = useState("");
    const [newPhoneNumber, setNewPhoneNumber] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newAdminId, setNewAdminId] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleDeleteShowroomClick = (showroomId) => {
        setDeleteTarget(showroomId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteShowroom = () => {
        fetch(`http://localhost:8080/api/showroom/${deleteTarget}`, {
            method: "DELETE",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Eroare la ștergerea showroom-ului");
                }
                setShowrooms(prevShowrooms =>
                    prevShowrooms.filter(showroom => showroom.idShowroom !== deleteTarget)
                );
                setShowDeleteConfirm(false);
            })
            .catch(error => console.error("Eroare:", error));
    };

    const cancelDeleteShowroom = () => {
        setShowDeleteConfirm(false);
    };

    const handleAddShowroom = () => {
        // Trimitere cerere POST către server
        fetch(`http://localhost:8080/api/showroom?adminId=${newAdminId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: newName,
                location: newLocation,
                phoneNumber: newPhoneNumber,
                email: newEmail,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Eroare la adăugarea showroom-ului");
                }
                return response.json();
            })
            .then(addedShowroom => {
                console.log("Showroom added:", addedShowroom);
                setShowrooms([...showrooms, addedShowroom]);
                setShowAddForm(false); // Închide formularul
                setNewName("");
                setNewLocation("");
                setNewPhoneNumber("");
                setNewEmail("");
                setNewAdminId("");
            })
            .catch(error => console.error("Eroare:", error));
    };

    const handleUpdateShowroom = (showroomId) => {
        const showroomToEdit = showrooms.find(showroom => showroom.idShowroom === showroomId);
        setSelectedShowroom(showroomToEdit);
        setUpdatedName(showroomToEdit.name);
        setUpdatedLocation(showroomToEdit.location);
        setUpdatedPhoneNumber(showroomToEdit.phoneNumber);
        setUpdatedEmail(showroomToEdit.email);
        setUpdatedAdminId(showroomToEdit.admin?.idAdmin || ""); // Optional chaining to avoid errors if admin is null
    };

    const handleSaveUpdatedShowroom = () => {
        if (!selectedShowroom) return;

        // Trimitere cerere PUT către server
        fetch(`http://localhost:8080/api/showroom/${selectedShowroom.idShowroom}?adminId=${updatedAdminId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                idShowroom: selectedShowroom.idShowroom,
                name: updatedName,
                location: updatedLocation,
                phoneNumber: updatedPhoneNumber,
                email: updatedEmail,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Eroare la actualizarea showroom-ului");
                }
                return response.json();
            })
            .then(updatedShowroom => {
                console.log("Showroom updated:", updatedShowroom);
                setShowrooms(prevShowrooms =>
                    prevShowrooms.map(showroom =>
                        showroom.idShowroom === updatedShowroom.idShowroom ? updatedShowroom : showroom
                    )
                );
                setSelectedShowroom(null); // Resetează formularul
            })
            .catch(error => console.error("Eroare:", error));
    };


    useEffect(() => {
        fetch("http://localhost:8080/api/showroom")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Eroare la încărcarea datelor");
                }
                return response.json();
            })
            .then(data => {
                console.log("Data received from backend:", data);
                setShowrooms(data);
            })
            .catch(error => console.error("Eroare:", error));
    }, []);

    return (
        <div>
            <h2>Showroom-urile Disponibile</h2>
            {userRole === "Admin" && (
                <div className="button-container">
                    <button className="buttonAddShowroom" onClick={() => setShowAddForm(true)}>Add Showroom</button>
                </div>
            )}
            <div className="showroom-list">
                {showrooms.length > 0 ? (
                    showrooms.map((showroom, index) => (
                        <div key={index} className="showroom-item-container">
                            <ShowroomItem showroom={showroom}/>
                            {userRole === "Admin" && (
                                <div className="admin-buttons-container">
                                    <button
                                        className="buttonUpdateShowroom"
                                        onClick={() => handleUpdateShowroom(showroom.idShowroom)}
                                    >
                                        Update Showroom
                                    </button>
                                    <button
                                        className="buttonDeleteShowroom"
                                        onClick={() => handleDeleteShowroomClick(showroom.idShowroom)}
                                    >
                                        Delete Showroom
                                    </button>

                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Nu există showroom-uri disponibile.</p>
                )}
            </div>

            {/* Formular pentru actualizare */}
            {selectedShowroom && (
                <div className="update-form">
                    <h3>Actualizează Showroom-ul</h3>
                    <label>
                        Nume:
                        <input
                            type="text"
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                        />
                    </label>
                    <label>
                        Locație:
                        <input
                            type="text"
                            value={updatedLocation}
                            onChange={(e) => setUpdatedLocation(e.target.value)}
                        />
                    </label>
                    <label>
                        Număr de telefon:
                        <input
                            type="text"
                            value={updatedPhoneNumber}
                            onChange={(e) => setUpdatedPhoneNumber(e.target.value)}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={updatedEmail}
                            onChange={(e) => setUpdatedEmail(e.target.value)}
                        />
                    </label>
                    <label>
                        ID Admin:
                        <input
                            type="text"
                            value={updatedAdminId}
                            onChange={(e) => setUpdatedAdminId(e.target.value)}
                        />
                    </label>
                    <button onClick={handleSaveUpdatedShowroom}>Salvează</button>
                    <button onClick={() => setSelectedShowroom(null)}>Anulează</button>
                </div>
            )}
            {showDeleteConfirm && (
                <div className="delete-confirm-overlay">
                    <div className="delete-confirm-popup">
                        <h3>Confirmare Ștergere</h3>
                        <p>Ești sigur că dorești să ștergi acest showroom? Această acțiune este ireversibilă.</p>
                        <div className="delete-confirm-buttons">
                            <button onClick={confirmDeleteShowroom} className="confirm-button">Da, șterge</button>
                            <button onClick={cancelDeleteShowroom} className="cancel-button">Anulează</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Formular pentru adăugare showroom */}
            {showAddForm && (
                <div className="add-form">
                    <h3>Adaugă un Showroom Nou</h3>
                    <label>
                        Nume:
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </label>
                    <label>
                        Locație:
                        <input
                            type="text"
                            value={newLocation}
                            onChange={(e) => setNewLocation(e.target.value)}
                        />
                    </label>
                    <label>
                        Număr de telefon:
                        <input
                            type="text"
                            value={newPhoneNumber}
                            onChange={(e) => setNewPhoneNumber(e.target.value)}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                    </label>
                    <label>
                        ID Admin:
                        <input
                            type="text"
                            value={newAdminId}
                            onChange={(e) => setNewAdminId(e.target.value)}
                        />
                    </label>
                    <button onClick={handleAddShowroom}>Adaugă</button>
                    <button onClick={() => setShowAddForm(false)}>Anulează</button>
                </div>
            )}
        </div>
    );
}

export default ShowroomList;
