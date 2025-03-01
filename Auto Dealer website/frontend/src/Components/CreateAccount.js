import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Register({ setAuthenticated, setUserRole,setIdUser}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    const handleRegister = (event) => {
        event.preventDefault();

        fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                firstName,
                lastName,
                phone,
                address,
                email
            })
        })
            .then(response => {
                if (response.ok) {
                    navigate('/');
                    setAuthenticated(true);
                    setUserRole("Client");
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('userRole', "Client");
                    response.json().then(data => {
                        localStorage.setItem('idUser', data.ID);
                        setIdUser(data.ID);
                        console.log(data.ID);
                    });
                } else {
                    alert('A apărut o problemă la înregistrare.');
                }
            })
            .catch(error => {
                console.error('Eroare:', error);
                alert('Eroare la conexiunea cu serverul.');
            });
    };

    return (
        <div className="register-container">
            <h2>Înregistrare</h2>
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label htmlFor="username">Nume Utilizator:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Introdu numele de utilizator"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Parolă:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Introdu parola"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="firstName">Prenume:</label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Introdu prenumele"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Nume:</label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Introdu numele"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Număr de Telefon:</label>
                    <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Introdu numărul de telefon"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Adresă:</label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Introdu adresa"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Introdu adresa de email"
                        required
                    />
                </div>
                <button type="submit" className="register-button">Înregistrează-te</button>
            </form>
        </div>
    );
}

export default Register;
