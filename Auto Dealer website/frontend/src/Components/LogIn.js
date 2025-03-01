import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../Styles/LogIn.css';

function LogIn({setAuthenticated,setUserRole,setIdUser}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const handleGoToCreateAccount = () => {
        navigate('/create-account');
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password}),
            credentials: 'include'
        })
            .then(response => {
                if (response.ok) {
                    navigate('/');
                    setAuthenticated(true);
                    localStorage.setItem('isAuthenticated', 'true');
                    response.json().then(data => {
                        localStorage.setItem('userRole', data.Type);
                        localStorage.setItem('idUser', data.ID);
                        setUserRole(data.Type);
                        setIdUser(data.ID);
                    });
                } else {
                    throw new Error('Eroare la autentificare');
                }
            })
            .catch(error => {
                console.error('Eroare:', error);
                alert('Autentificare eșuată. Te rog să verifici datele introduse.');
            });
    }

        return (
            <div className="login-container">
                <h2>Autentificare</h2>
                <p>Introdu datele necesare pentru a te autentifica:</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Nume utilizator:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Introdu numele de utilizator sau email-ul"
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
                    <button type="submit" className="login-button">Autentificare</button>
                </form>
                <div className="create-account-section">
                    <p>Nu ai cont?</p>
                    <button onClick={handleGoToCreateAccount} className="create-account-button">Creare Cont</button>
                </div>
            </div>
        );
}

export default LogIn;
