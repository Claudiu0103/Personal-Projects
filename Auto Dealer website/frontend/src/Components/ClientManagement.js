import React, { useEffect, useState } from 'react';

function ClientManagement() {
    const [clients, setClients] = useState([]);

    // Fetch all clients from the backend
    useEffect(() => {
        fetch("http://localhost:8080/api/client")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Eroare la încărcarea clienților");
                }
                return response.json();
            })
            .then(data => setClients(data))
            .catch(error => console.error("Eroare:", error));
    }, []);

    // Delete a client
    const handleDeleteClient = (idClient) => {
        fetch(`http://localhost:8080/api/client/${idClient}`, { method: 'DELETE' })
            .then(() => setClients(clients.filter(client => client.idClient !== idClient)))
            .catch(error => console.error("Eroare la ștergerea clientului:", error));
    };

    return (
        <div>
            <h2>Management Clienți</h2>
            <p>Aici poți șterge clienții din listă.</p>

            {/* Client List */}
            <div className="client-list">
                {clients.length > 0 ? (
                    clients.map(client => (
                        <div key={client.idClient} className="client-card">
                            <h3>{client.firstName} {client.lastName}</h3>
                            <p><strong>Telefon:</strong> {client.phone}</p>
                            <p><strong>Adresa:</strong> {client.address}</p>
                            <p><strong>Email:</strong> {client.email}</p>
                            <button onClick={() => handleDeleteClient(client.idClient)}>Șterge</button>
                        </div>
                    ))
                ) : (
                    <p>Nu există clienți înregistrați.</p>
                )}
            </div>
        </div>
    );
}

export default ClientManagement;
