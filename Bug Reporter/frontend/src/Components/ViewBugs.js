import React, {useState, useEffect} from 'react';
import {
    Box,
    Paper,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Grid,
    CardActions,
    Button
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import Appbar from './AppBar';
import '../App.css';

export default function ViewBugs() {
    const [bugs, setBugs] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
    const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
    const [userId, setUserId] = useState(() => localStorage.getItem('userId') || '');
    const navigate = useNavigate();
    const [userScores, setUserScores] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }

        fetch('http://localhost:8080/bug/getAll', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(response => response.json())
            .then(data => {
                const validBugs = data.filter(bug => {
                    const date = new Date(bug.date);
                    return !isNaN(date);
                });
                const sortedBugs = validBugs.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB - dateA;
                });

                setBugs(sortedBugs);
                const uniqueUserIds = [...new Set(sortedBugs.map(bug => bug.userId))];
                const scores = {};
                Promise.all(uniqueUserIds.map(userId =>
                    fetch(`http://localhost:8081/score/${userId}`, {
                        method: 'GET',
                        headers: {
/*
                            'Authorization': `Bearer ${token}`,
*/
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Unauthorized or error');
                            }
                            return response.json();
                        })
                        .then(data => {
                            scores[userId] = data.score;
                        })
                        .catch(error => {
                            console.error(`Error fetching score for user ${userId}:`, error);
                            scores[userId] = 0;
                        })
                )).then(() => {
                    setUserScores(scores);
                });
            })
            .catch(error => {
                console.error('Error fetching bugs:', error);
                alert('An error occurred while fetching the bugs.');
            });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        setUsername('');
        setUserId('');
        navigate('/');
    };

    const handleView = (bug) => {
        navigate("/view-comments", {state: {bug}});
    };

    const handleDelete = (idBug) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:8080/bug/deleteById/${idBug}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(response => {
                if (response.ok) {
                    setBugs(bugs.filter(bug => bug.id !== idBug));
                    alert('Bug deleted successfully');
                } else {
                    alert('Failed to delete the bug');
                }
            })
            .catch(error => {
                console.error('Error deleting bug:', error);
                alert('An error occurred while deleting the bug.');
            });
    };

    const handleUpdate = (bugId) => {
        navigate(`/bug/update/${bugId}`);
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

            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4}}>
                <Paper elevation={3} sx={{p: 4, width: '100%', maxWidth: 1200}}>
                    <Typography variant="h5" sx={{mb: 2}}>
                        Listă Bug-uri
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        {bugs
                            .filter(bug => String(bug.userId) === String(userId))
                            .map(bug => (
                                <Grid container item xs={12} sm={6} md={4} key={bug.id}>
                                    <Card sx={{maxWidth: 345}}>
                                        {bug.imageURL && (
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={bug.imageURL}
                                                alt="Bug Image"
                                            />
                                        )}
                                        <CardContent sx={{textAlign: 'center'}}>
                                            <Typography variant="h6" component="div">
                                                {bug.title}
                                            </Typography>
                                            {/*<Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                                                {bug.text}
                                            </Typography>*/}
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                📅 {new Date(bug.date).toLocaleString()}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                👤 Autor: <strong>{bug.username}</strong>
                                                {userScores[bug.userId] !== undefined && (
                                                    <> (Score: {userScores[bug.userId].toFixed(1)})</>
                                                )}
                                            </Typography>
                                            <Typography variant="caption" display="block" textAlign="center"
                                                        sx={{mt: 1}}>
                                                <strong>Tag-uri:</strong> {bug.tagNames?.join(', ') || 'N/A'}
                                            </Typography>
                                            <Typography variant="caption" display="block" textAlign="center">
                                                <strong>Status:</strong> {bug.status}
                                            </Typography>
                                        </CardContent>

                                        <CardActions sx={{justifyContent: 'center'}}>
                                            <Button size="small" onClick={() => handleView(bug)}>
                                                View
                                            </Button>
                                            {bug.userId === Number(userId) && (
                                                <>
                                                    <Button size="small" onClick={() => handleUpdate(bug.id)}>
                                                        Update
                                                    </Button>
                                                    <Button size="small" color="error"
                                                            onClick={() => handleDelete(bug.id)}>
                                                        Delete
                                                    </Button>
                                                </>
                                            )}
                                        </CardActions>

                                    </Card>
                                </Grid>
                            ))}
                    </Grid>
                </Paper>
            </Box>
        </div>
    );
}
