import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    CardActions,
    Button
} from '@mui/material';

export default function BugList({searchText, searchTag, searchUser, onlyMyBugs, currentUser, isLoggedIn}) {
    const [bugs, setBugs] = useState([]);
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const handleVote = async (bugId, voteType) => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        const voteData = {voteType};

        try {
            const response = await fetch(`http://localhost:8080/vote/addVoteBug/${userId}/${bugId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(voteData)
            });

            if (!response.ok) {
                throw new Error('Error voting the bug');
            }

            const [likes, dislikes] = await Promise.all([
                fetchLikes(bugId),
                fetchDislikes(bugId)
            ]);

            setBugs(prevBugs =>
                prevBugs.map(bug =>
                    bug.id === bugId ? {...bug, likes, dislikes} : bug
                )
            );
        } catch (error) {
            console.error('Error voting bug:', error);
            alert('Error voting bug.');
        }
    };


    const handleLike = (bugId) => {
        handleVote(bugId, 'UPVOTE');
    };

    const handleDislike = (bugId) => {
        handleVote(bugId, 'DOWNVOTE');
    };


    const handleEdit = (bug) => {
        navigate(`/bug/update/${bug.id}`);
    };



    const handleDelete = (id) => {
        const token = localStorage.getItem("token");

        if (!window.confirm("Ești sigur că vrei să ștergi bug-ul?")) return;

        fetch(`http://localhost:8080/bug/deleteById/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error("Eroare la ștergere");
                setBugs(prev => prev.filter(b => b.id !== id));
                alert("Bug șters!");
            })
            .catch(err => alert(err.message));
    };


    const fetchLikes = async (bugId) => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:8080/vote/getLikes/${bugId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch likes');
            }

            const count = await response.json();
            return count;
        } catch (error) {
            console.error('Error fetching likes:', error);
            return 0;
        }
    };

    const fetchDislikes = async (bugId) => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:8080/vote/getDislikes/${bugId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch dislikes');
            }

            const count = await response.json();
            return count;
        } catch (error) {
            console.error('Error fetching dislikes:', error);
            return 0;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!isLoggedIn || !token) return;

        fetch('http://localhost:8080/bug/getAll', {
            headers: {'Authorization': `Bearer ${token}`}
        })
            .then(res => res.json())
            .then(async data => {
                const sortedBugs = data
                    .filter(bug => !isNaN(new Date(bug.date)))
                    .sort((a, b) => new Date(b.date) - new Date(a.date));

                const bugsWithVotes = await Promise.all(
                    sortedBugs.map(async bug => {
                        const likes = await fetchLikes(bug.id);
                        const dislikes = await fetchDislikes(bug.id);
                        return {...bug, likes, dislikes};
                    })
                );

                setBugs(bugsWithVotes);
            })
            .catch(err => {
                console.error('Eroare la încărcarea bugurilor:', err);
                setBugs([]);
            });
    }, [isLoggedIn]);


    const handleView = (bug) => {
        navigate("/view-comments", {state: {bug}});
    };

    if (!isLoggedIn) {
        return null;
    }

    const filteredBugs = bugs.filter(bug => {
        const matchesTitle = bug.title?.toLowerCase().includes(searchText.toLowerCase());
        const matchesTag = searchTag === '' || bug.tagNames?.some(tag => tag.toLowerCase().includes(searchTag.toLowerCase()));
        const matchesUser = searchUser === '' || bug.username?.toLowerCase().includes(searchUser.toLowerCase());
        const isMyBug = !onlyMyBugs || bug.username === currentUser;
        return matchesTitle && matchesTag && matchesUser && isMyBug;
    });

    return (
        <Grid container spacing={3} sx={{padding: 4}}>
            {filteredBugs.length > 0 ? (
                filteredBugs.map(bug => (
                    <Grid item xs={12} sm={6} md={4} key={bug.id}>
                        <Card sx={{maxWidth: 400, minHeight: 400}}>

                            {bug.imageURL && (
                                <CardMedia
                                    component="img"
                                    image={bug.imageURL}
                                    alt="Bug Image"
                                    sx={{
                                        height: 200,
                                        objectFit: "contain",
                                        backgroundColor: "#f5f5f5",
                                        padding: "8px"
                                    }}
                                />

                            )}
                            <CardContent>
                                <Typography variant="h6" component="div" textAlign="center">
                                    {bug.title}
                                </Typography>
                                {/*<Typography variant="body2" color="text.secondary" textAlign="center">
                                    {bug.text}
                                </Typography>*/}
                                <Typography variant="caption" color="text.secondary" display="block">
                                    👤 Autor: <strong>{bug.username}</strong>
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    📅 {new Date(bug.date).toLocaleString()}
                                </Typography>
                                <Typography variant="caption" display="block" textAlign="center" sx={{mt: 1}}>
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
                                <Button size="small" color="success" onClick={() => handleLike(bug.id)}>
                                    👍 Like
                                </Button>
                                <Button size="small" color="error" onClick={() => handleDislike(bug.id)}>
                                    👎 Dislike
                                </Button>
                                <Typography variant="caption" display="block" textAlign="center" sx={{mt: 1}}>
                                    Vote count: {bug.likes - bug.dislikes}
                                </Typography>
                                {role === "ADMIN" && (
                                    <>
                                        <Button size="small" color="warning" onClick={() => handleEdit(bug)}>
                                            ✏️ Edit
                                        </Button>
                                        <Button size="small" color="error" onClick={() => handleDelete(bug.id)}>
                                            🗑️ Delete
                                        </Button>
                                    </>
                                )}

                            </CardActions>
                        </Card>
                    </Grid>
                ))
            ) : (
                <Typography sx={{mt: 4, textAlign: 'center', width: '100%', color: '#FFFFFFFF'}}>
                    Niciun bug găsit cu filtrele selectate.
                </Typography>
            )}
        </Grid>
    );
}
