import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper
} from '@mui/material';

export default function UpdateBug() {
    const { bugId } = useParams();
    const navigate = useNavigate();
    const [bugData, setBugData] = useState({
        title: '',
        text: '',
        imageURL: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:8080/bug/getById/${bugId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setBugData({
                    id:data.id,
                    title: data.title,
                    text: data.text,
                    date:data.date,
                    imageURL: data.imageURL,
                    userId: data.userId,
                    tagNames:data.tagNames
                });
            })
            .catch(err => {
                console.error('Eroare la încărcarea bugului:', err);
                alert('Eroare la încărcarea datelor bugului.');
            });
    }, [bugId]);

    const handleChange = (e) => {
        setBugData({ ...bugData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        fetch(`http://localhost:8080/bug/updateBug/${bugId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bugData)
        })
            .then(res => {
                if (res.ok) {
                    alert('Bug actualizat cu succes!');
                    navigate('/');
                } else {
                    alert('Eroare la actualizarea bugului.');
                }
            })
            .catch(err => {
                console.error('Eroare la actualizare:', err);
            });
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 600 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Actualizează Bug
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Titlu"
                        name="title"
                        value={bugData.title}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Descriere"
                        name="text"
                        value={bugData.text}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Imagine URL"
                        name="imageURL"
                        value={bugData.imageURL}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Tag uri"
                        name="tagNames"
                        value={bugData.tagNames?.join(', ') || ''}
                        onChange={(e) =>
                            setBugData({
                                ...bugData,
                                tagNames: e.target.value.split(',').map(tag => tag.trim())
                            })
                        }
                        fullWidth
                        placeholder="ex: UI, Backend, Bug Critic"
                        margin="normal"
                    />


                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                        Actualizează
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}
