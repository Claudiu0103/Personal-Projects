import React, {useState, useEffect} from 'react';
import Appbar from './AppBar';
import LogIn from './LogIn';
import BugList from './BugList';
import UserList from './UserList';
import Footer from './Footer';
import LandingPage from './LandingPage';
import {Box, TextField, MenuItem, InputAdornment, Paper} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [searchText, setSearchText] = useState('');
    const [searchType, setSearchType] = useState('title');
    const [openLogin, setOpenLogin] = useState(false);

    useEffect(() => {
        // Check if user is already logged in from localStorage
        const storedToken = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        const storedRole = localStorage.getItem('role');
        
        if (storedToken && storedUsername && storedRole) {
            setIsLoggedIn(true);
            setUsername(storedUsername);
            setRole(storedRole);
        }
    }, []);

    const handleLoginSuccess = (username) => {
        setIsLoggedIn(true);
        setUsername(username);
        setRole(localStorage.getItem("role"));
        setOpenLogin(false);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        setRole('');
        localStorage.clear();
    };

    const searchTypes = [
        { value: 'title', label: 'Search by Title' },
        { value: 'tag', label: 'Search by Tag' },
        { value: 'author', label: 'Search by Author' }
    ];

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
        setSearchText('');
    };

    if (!isLoggedIn) {
        return (
            <>
                <Appbar
                    onLoginClick={() => setOpenLogin(true)}
                    onLogout={handleLogout}
                    isLoggedIn={isLoggedIn}
                    username={username}
                    role={role}
                />
                <LandingPage onLoginClick={() => setOpenLogin(true)} />
                <LogIn
                    open={openLogin}
                    onClose={() => setOpenLogin(false)}
                    onSuccess={handleLoginSuccess}
                />
            </>
        );
    }

    return (
        <div className="App">
            <Appbar
                onLoginClick={() => setOpenLogin(true)}
                onLogout={handleLogout}
                isLoggedIn={isLoggedIn}
                username={username}
                role={role}
            />
            <Box sx={{p: 3}}>
                <Paper 
                    elevation={0}
                    sx={{
                        p: 2,
                        mb: 3,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        <TextField
                            select
                            value={searchType}
                            onChange={handleSearchTypeChange}
                            size="small"
                            sx={{
                                width: '180px',
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'white',
                                    borderRadius: 2,
                                    '& fieldset': {
                                        borderColor: 'rgba(0, 0, 0, 0.1)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                            }}
                        >
                            {searchTypes.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            placeholder={`Search by ${searchType}...`}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'white',
                                    borderRadius: 2,
                                    '& fieldset': {
                                        borderColor: 'rgba(0, 0, 0, 0.1)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </Paper>
                <BugList
                    searchText={searchType === 'title' ? searchText : ''}
                    searchTag={searchType === 'tag' ? searchText : ''}
                    searchUser={searchType === 'author' ? searchText : ''}
                    currentUser={username}
                    isLoggedIn={isLoggedIn}
                />
            </Box>
            <Footer/>
            <LogIn
                open={openLogin}
                onClose={() => setOpenLogin(false)}
                onSuccess={handleLoginSuccess}
            />
        </div>
    );
}
