import React, {useState, useEffect} from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import Appbar from './AppBar';
import '../App.css';

export default function ReportBug() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        tags: '',
        pictureUrl: '',
    });

    const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm({...form, [name]: value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Obține data curentă și formateaz-o
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;

        const userId = localStorage.getItem('userId');
        console.log("User ID: ", userId);
        const bug = {
            title: form.title,
            text: form.description,
            date: formattedDate,
            imageURL: form.pictureUrl,
            userId: userId,
            tagNames: form.tags.split(',').map(tag => tag.trim()),
        };
        console.log("Bug object:", bug);

        const token = localStorage.getItem('token');

        fetch('http://localhost:8080/bug/addBug', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(bug),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Server error');
                }
                return response.json();
            })
            .then(data => {
                console.log('Bug adăugat:', data);
                alert('Bug trimis cu succes!');
                setForm({
                    title: '',
                    description: '',
                    tags: '',
                    pictureUrl: '',
                });
            })
            .catch(error => {
                console.error('Eroare la trimiterea bug-ului:', error);
                alert('A apărut o eroare. Te rugăm să încerci din nou.');
            });
    };

    const handleClose = () => {
        navigate('/');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
        navigate('/');
    };

    return (
        <div className="App">
            <Appbar
                onLoginClick={() => {
                }}
                onLogout={handleLogout}
                isLoggedIn={isLoggedIn}
                username={username}
            />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: 4,
                }}
            >
                <Paper elevation={3} sx={{p: 4, width: '100%', maxWidth: 600}}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Typography variant="h5">Report a Bug</Typography>
                        <Button color="error" onClick={handleClose}>
                            Close
                        </Button>
                    </Box>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Titlu"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />

                        <TextField
                            label="Descriere"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                            margin="normal"
                            required
                        />

                        <TextField
                            label="Etichete (separate prin virgulă)"
                            name="tags"
                            value={form.tags}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />

                        <TextField
                            label="URL imagine"
                            name="pictureUrl"
                            value={form.pictureUrl}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />

                        <Button type="submit" variant="contained" sx={{mt: 3}}>
                            Trimite
                        </Button>
                    </form>
                </Paper>
            </Box>
        </div>
    );
}
