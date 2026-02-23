import {useState} from "react";
import '../Styles/LoginStyles.css';

export default function LogIn({open, onClose, onSuccess}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    if (!open) return null;

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        fetch('http://localhost:8080/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password}),
        })
            .then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        throw new Error(text);
                    });
                }
                return res.json();
            })

            .then(data => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.userId);
                    localStorage.setItem("role", data.role);
                    onSuccess(data.username);
                } else {
                    throw new Error("Token lipsă");
                }
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
            });
    };


    const handleRegister = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        fetch('http://localhost:8080/user/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password, email, phoneNumber}),
        })
            .then(res => {
                if (!res.ok) throw new Error("Înregistrare eșuată");
                return res.json();
            })
            .then(() => {
                setSuccess("Cont creat cu succes! Te poți loga.");
                setIsRegistering(false);
            })
            .catch(err => {
                console.error(err);
                setError("Eroare la înregistrare. Încearcă un alt nume de utilizator.");
            });
    };

    return (
        <div className="login-page">
            <div className="form">
                {isRegistering ? (
                    <form className="register-form" onSubmit={handleRegister}>
                        <input
                            type="text"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="tel"
                            placeholder="phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                        <button type="submit">create</button>
                        {error && <p style={{color: 'red', fontSize: '12px'}}>{error}</p>}
                        {success && <p style={{color: 'green', fontSize: '12px'}}>{success}</p>}
                        <p className="message">
                            Already registered? <button type="button" onClick={() => setIsRegistering(false)}
                                                        className="link-button">Sign In</button>
                        </p>
                    </form>

                ) : (
                    <form className="login-form" onSubmit={handleLogin}>
                        <input
                            type="text"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">login</button>
                        {error && <p style={{color: 'red', fontSize: '12px'}}>{error}</p>}
                        {success && <p style={{color: 'green', fontSize: '12px'}}>{success}</p>}
                        <p className="message">
                            <button type="button" onClick={onClose} className="link-button">Close</button>
                        </p>
                        <p className="message">
                            Not registered? <button type="button" onClick={() => setIsRegistering(true)}
                                                    className="link-button">Create an account</button>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
