import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

export default function MenuAppBar({ isLoggedIn, username, role, onLoginClick, onLogout, showUserList, setShowUserList }) {
    const [accountAnchorEl, setAccountAnchorEl] = React.useState(null);
    const navigate = useNavigate();

    const handleAccountMenu = (event) => {
        setAccountAnchorEl(event.currentTarget);
    };

    const handleAccountClose = () => {
        setAccountAnchorEl(null);
    };

    const handleLogoutClick = () => {
        handleAccountClose();
        onLogout();
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleReportBug = () => {
        navigate('/report-bug');
    };

    const handleViewBugs = () => {
        navigate('/view-bugs');
    };

    const handlePromoteClick = () => {
        const usernameToPromote = prompt("Introdu username-ul de promovat la admin:");
        if (!usernameToPromote) return;

        fetch(`http://localhost:8080/admin/promote/${usernameToPromote}`, {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Promovarea a eșuat");
                return res.text();
            })
            .then((msg) => alert(msg))
            .catch((err) => alert(err.message));
    };

    const handleProfileClick = () => {
        handleAccountClose();
        navigate('/profile');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar 
                position="static" 
                sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="home"
                            onClick={handleHomeClick}
                            sx={{ 
                                mr: 2,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                }
                            }}
                        >
                            <HomeIcon />
                        </IconButton>

                        {isLoggedIn && (
                            <Button 
                                color="inherit" 
                                onClick={handleReportBug}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    }
                                }}
                            >
                                Report a bug
                            </Button>
                        )}

                        {isLoggedIn && role !== "ADMIN" && (
                            <Button 
                                color="inherit" 
                                onClick={handleViewBugs}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    }
                                }}
                            >
                                My Bugs
                            </Button>
                        )}
                    </Box>

                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ 
                            flexGrow: 1, 
                            textAlign: 'center',
                            fontWeight: 'bold',
                            letterSpacing: '1px'
                        }}
                    >
                        Bug Reporter
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {isLoggedIn ? (
                            <>
                                {role === "ADMIN" && (
                                    <Button
                                        color="inherit"
                                        onClick={handlePromoteClick}
                                        sx={{ 
                                            mr: 2,
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            }
                                        }}
                                    >
                                        Promovează la Admin
                                    </Button>
                                )}
                                {role === "ADMIN" && (
                                    <Button
                                        color="inherit"
                                        onClick={() => setShowUserList(prev => !prev)}
                                        sx={{ 
                                            mr: 2,
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            }
                                        }}
                                    >
                                        {showUserList ? "Vezi Buguri" : "Vezi Utilizatori"}
                                    </Button>
                                )}
                                {role === "ADMIN" && (
                                    <Button
                                        color="inherit"
                                        onClick={() => navigate('/admin-users')}
                                        sx={{ 
                                            mr: 2,
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            }
                                        }}
                                    >
                                        Administrează utilizatori
                                    </Button>
                                )}

                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        mr: 2,
                                        fontWeight: 'medium'
                                    }}
                                >
                                    Salut, {username}
                                </Typography>

                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleAccountMenu}
                                    color="inherit"
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        }
                                    }}
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={accountAnchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(accountAnchorEl)}
                                    onClose={handleAccountClose}
                                    sx={{
                                        '& .MuiPaper-root': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            backdropFilter: 'blur(10px)',
                                        }
                                    }}
                                >
                                    <MenuItem onClick={handleProfileClick}>Profil</MenuItem>
                                    <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Typography
                                onClick={onLoginClick}
                                sx={{
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        opacity: 0.8,
                                    }
                                }}
                            >
                                Login
                            </Typography>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
