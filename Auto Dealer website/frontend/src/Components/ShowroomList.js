import { useEffect, useState } from 'react';
import React from 'react';
import ShowroomItem from './ShowroomItem';
import '../Styles/ShowroomList.css';

function ShowroomList() {
    const [showrooms, setShowrooms] = useState([]);

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
            <div className="showroom-list2">
                {showrooms.length > 0 ? (
                    showrooms.map((showroom, index) => (
                        <div key={index} className="showroom-item-container2">
                            <ShowroomItem showroom={showroom} />
                        </div>
                    ))
                ) : (
                    <p>Nu există showroom-uri disponibile.</p>
                )}
            </div>
        </div>
    );
}

export default ShowroomList;
