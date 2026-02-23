import React, {useState, useEffect} from 'react';
import {
    Box, Typography, Dialog, DialogTitle, DialogContent, Button
} from '@mui/material';
import {useNavigate, useLocation} from 'react-router-dom';
import Appbar from './AppBar';

export default function ViewComments() {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedBug = location.state?.bug;
    const role = localStorage.getItem('role');

    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    const [comments, setComments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newCommentText, setNewCommentText] = useState('');
    const [newCommentImage, setNewCommentImage] = useState('');
    const [openDialog, setOpenDialog] = useState(true);
    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');

    const currentDate2 = new Date();
    const formattedDate2 = `${currentDate2.getFullYear()}-${String(currentDate2.getMonth() + 1).padStart(2, '0')}-${String(currentDate2.getDate()).padStart(2, '0')} ${String(currentDate2.getHours()).padStart(2, '0')}:${String(currentDate2.getMinutes()).padStart(2, '0')}:${String(currentDate2.getSeconds()).padStart(2, '0')}`;

    useEffect(() => {
        if (!selectedBug) return;
        fetch(`http://localhost:8080/comment/getAll/${selectedBug.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Eroare la obținerea comentariilor");
                return res.json();
            })
            .then(async data => {
                const withVotes = await Promise.all(
                    data.map(async comment => {
                        const votes = await getCommentVotes(comment.id);
                        return {...comment, likes: votes.likes || 0, dislikes: votes.dislikes || 0};
                    })
                );
                setComments(withVotes.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes)));

            })

            .catch(err => {
                console.error(err);
                alert("Nu s-au putut încărca comentariile.");
            });
    }, [selectedBug, token]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        navigate('/');
    };

    const voteComment = async (commentId, voteType) => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        try {
            const res = await fetch(`http://localhost:8080/vote/addVoteComment/${userId}/${commentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({voteType})
            });

            if (!res.ok) throw new Error("Eroare la votarea comentariului");
            return await res.json();
        } catch (err) {
            console.error(err);
            alert("Nu s-a putut trimite votul.");
        }
    };

    const getCommentVotes = async (commentId) => {
        const token = localStorage.getItem('token');
        try {
            const [likesRes, dislikesRes] = await Promise.all([
                fetch(`http://localhost:8080/vote/getLikesComment/${commentId}`, {
                    headers: {'Authorization': `Bearer ${token}`}
                }),
                fetch(`http://localhost:8080/vote/getDislikesComment/${commentId}`, {
                    headers: {'Authorization': `Bearer ${token}`}
                })
            ]);
            return {
                likes: await likesRes.json(),
                dislikes: await dislikesRes.json()
            };
        } catch (err) {
            console.error(err);
            return {likes: 0, dislikes: 0};
        }
    };


    const handleSubmitComment = (e) => {
        e.preventDefault();
        const newComment = {
            bugId: selectedBug.id,
            userId: Number(userId),
            text: newCommentText,
            imageURL: newCommentImage,
            date: formattedDate2
        };

        fetch('http://localhost:8080/comment/addComment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newComment)
        })
            .then(res => {
                if (!res.ok) throw new Error("Eroare la adăugarea comentariului");
                return res.json();
            })
            .then(async data => {
                const votes = await getCommentVotes(data.id);
                setComments(prev => [...prev, {...data, likes: votes.likes || 0, dislikes: votes.dislikes || 0}]);
                setNewCommentText('');
                setNewCommentImage('');
                setShowForm(false);
            })

            .catch(err => {
                console.error(err);
                alert("Nu s-a putut adăuga comentariul.");
            });
    };

    const handleDeleteComment = (commentId) => {

        fetch(`http://localhost:8080/comment/deleteById/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Eroare la ștergerea comentariului");
                setComments(prev => prev.filter(c => c.id !== commentId));
            })
            .catch(err => {
                console.error(err);
                alert("Nu s-a putut șterge comentariul.");
            });
    };

    const handleMarkSolved = () => {
        const updatedBugDTO = {
            ...selectedBug,
            status: "Solved"
        };

        fetch(`http://localhost:8080/bug/updateBug/${selectedBug.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedBugDTO)
        })
            .then(res => {
                if (!res.ok) throw new Error("Eroare la actualizarea statusului.");
                return res.json();
            })
            .then(updatedBug => {
                navigate("/view-comments", { state: { bug: updatedBug } });
            })
            .catch(err => {
                console.error(err);
                alert("Nu s-a putut marca bug-ul ca rezolvat.");
            });
    };



    const handleEditSubmit = (e) => {
        e.preventDefault();

        const updatedComment = {
            text: editCommentText,
            imageURL: comments.find(c => c.id === editCommentId)?.imageURL || '',
            bugId: selectedBug.id,
            userId: Number(userId),
            date: formattedDate2
        };

        fetch(`http://localhost:8080/comment/updateComment/${editCommentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedComment)
        })
            .then(res => {
                if (!res.ok) throw new Error("Eroare la actualizarea comentariului");
                return res.json();
            })
            .then(updatedComment => {
                setComments(prev =>
                    prev.map(c => c.id === editCommentId ? updatedComment : c)
                );
                setEditCommentId(null);
                setEditCommentText('');
            })
            .catch(err => {
                console.error(err);
                alert("Nu s-a putut actualiza comentariul.");
            });
    };


    return (
        <div className="App">
            <Appbar
                onLoginClick={() => {
                }}
                onLogout={handleLogout}
                isLoggedIn={!!token}
                username={username}
            />

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>Detalii Bug & Comentarii</DialogTitle>
                <DialogContent dividers>
                    {selectedBug ? (
                        <>
                            <Typography variant="h6" gutterBottom>{selectedBug.title}</Typography>

                            {(selectedBug.username === username || role === "ADMIN") && selectedBug.status !== "Solved" && (
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="success"
                                    onClick={handleMarkSolved}
                                    sx={{ mt: 1, mb: 2 }}
                                >
                                    Marchează ca rezolvat
                                </Button>
                            )}

                            <Typography variant="body2" gutterBottom>{selectedBug.text}</Typography>
                            <Typography variant="caption" display="block" gutterBottom>
                                Autor: {selectedBug.username} • {new Date(selectedBug.date).toLocaleString()}
                            </Typography>

                            <Box sx={{mt: 3}}>
                                <Typography variant="subtitle1">Comentarii:</Typography>
                                {comments.length > 0 ? (
                                    comments.map((comment, idx) => (
                                        <Box key={idx} sx={{mt: 2, pl: 2, borderLeft: '2px solid #ccc'}}>
                                            {editCommentId === comment.id ? (
                                                <Box component="form" onSubmit={handleEditSubmit} sx={{mb: 1}}>
                                                    <textarea
                                                        value={editCommentText}
                                                        onChange={(e) => setEditCommentText(e.target.value)}
                                                        rows={3}
                                                        style={{width: '100%', padding: '8px'}}
                                                        required
                                                    />
                                                    <Box sx={{mt: 1, display: 'flex', gap: 1}}>
                                                        <Button type="submit" variant="contained"
                                                                size="small">Salvează</Button>
                                                        <Button onClick={() => setEditCommentId(null)}
                                                                variant="outlined" size="small">Anulează</Button>
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <>
                                                    <Typography variant="body2">{comment.text}</Typography>
                                                    {comment.imageURL && (
                                                        <img src={comment.imageURL} alt="Comentariu"
                                                             style={{maxWidth: '100%', marginTop: '8px'}}/>
                                                    )}
                                                    <Typography variant="caption" display="block">
                                                        👤 {comment.username === username ? 'Tu' : comment.username} • {new Date(comment.date).toLocaleString()}
                                                    </Typography><Box sx={{
                                                    mt: 1,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}>
                                                    <Typography variant="caption" display="block">
                                                        Vote count: {(comment.likes || 0) - (comment.dislikes || 0)}
                                                    </Typography>
                                                    <Box sx={{display: 'flex', gap: 2}}>
                                                        <Button
                                                            size="small"
                                                            color="success"
                                                            onClick={async () => {
                                                                await voteComment(comment.id, 'UPVOTE');
                                                                const votes = await getCommentVotes(comment.id);
                                                                setComments(prev =>
                                                                    [...prev.map(c =>
                                                                        c.id === comment.id
                                                                            ? { ...c, likes: votes.likes || 0, dislikes: votes.dislikes || 0 }
                                                                            : c
                                                                    )].sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes))
                                                                );

                                                            }}
                                                        >
                                                            👍 Like
                                                        </Button>

                                                        <Button
                                                            size="small"
                                                            color="error"
                                                            onClick={async () => {
                                                                await voteComment(comment.id, 'DOWNVOTE');
                                                                const votes = await getCommentVotes(comment.id);
                                                                setComments(prev =>
                                                                    [...prev.map(c =>
                                                                        c.id === comment.id
                                                                            ? { ...c, likes: votes.likes || 0, dislikes: votes.dislikes || 0 }
                                                                            : c
                                                                    )].sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes))
                                                                );

                                                            }}
                                                        >
                                                            👎 Dislike
                                                        </Button>
                                                    </Box>
                                                </Box>
                                                    {(comment.userId === Number(userId) || role === "ADMIN") && (
                                                        <Box sx={{mt: 1, display: 'flex', gap: 1}}>
                                                            <Button onClick={() => {
                                                                setEditCommentId(comment.id);
                                                                setEditCommentText(comment.text);
                                                            }} size="small" variant="text">Modifică</Button>
                                                            <Button onClick={() => handleDeleteComment(comment.id)}
                                                                    size="small" variant="text"
                                                                    color="error">Șterge</Button>
                                                        </Box>
                                                    )}
                                                </>
                                            )}
                                        </Box>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
                                        Nu există comentarii.
                                    </Typography>
                                )}
                            </Box>

                            {selectedBug.status === "Solved" ? (
                                <Typography variant="body2" color="error" sx={{mt: 3}}>
                                    Acest bug a fost marcat ca <strong>"Solved"</strong>. Nu mai pot fi adăugate comentarii.
                                </Typography>
                            ) : (
                                <>
                                    <Button
                                        variant="outlined"
                                        sx={{mt: 3}}
                                        onClick={() => setShowForm(prev => !prev)}
                                    >
                                        {showForm ? 'Anulează' : 'Adaugă comentariu'}
                                    </Button>

                                    {showForm && (
                                        <Box component="form" sx={{mt: 2}} onSubmit={handleSubmitComment}>
                                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                    <textarea
                        placeholder="Scrie comentariul..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        rows={3}
                        style={{padding: '10px', fontSize: '14px'}}
                        required
                    />
                                                <input
                                                    type="url"
                                                    placeholder="Imagine URL (opțional)"
                                                    value={newCommentImage}
                                                    onChange={(e) => setNewCommentImage(e.target.value)}
                                                />
                                                <Button type="submit" variant="contained">Trimite</Button>
                                            </Box>
                                        </Box>
                                    )}
                                </>
                            )}


                        </>
                    ) : (
                        <Typography color="error">Eroare: Bug-ul nu a fost transmis corect.</Typography>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
