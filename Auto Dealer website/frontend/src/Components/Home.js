import React from 'react';
import {useNavigate} from 'react-router-dom';
import '../Styles/Home.css';

function Home({isAuthenticated, userRole, setAuthenticated, setUserRole}) {
    const navigate = useNavigate();

    // Funcția de logout
    const handleLogout = () => {
        // Resetează stările de autentificare și rolul utilizatorului
        setAuthenticated(false);
        setUserRole('');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        navigate('/');
    };

    const handleGoToCarList = () => {
        navigate('/cars');
    };
    const handleGoToShowRoomList = () => {
        navigate('/show-room-list');
    };
    const handleGoToLogIn = () => {
        navigate('/login');
    };
    const handleGoToDataManagement = () => {
        navigate('/data-management');
    };
    const handleGoToCarHistory = () => {
        navigate('/carHistory');
    };
    const handleGoToManagementShowrooms = () => {
        navigate('/management-showrooms');
    };
    const handleGoToManagementClients = () => {
        navigate('/management-clients');
    };
    const handleGoToManagementCars = () => {
        navigate('/management-cars');
    };
    const handleGoToViewCart = () => {
        navigate('/view-cart');
    };
    const handleGoToFavorites = () => navigate('/favorites');

    return (
        <div className="home">
            <div className="home-title">
                <h1>Dealer Auto</h1>
                <p1>Cele mai bune oferte de mașini noi și rulate!</p1>
            </div>
            <main className="home-content">
                <p>La Dealer Auto, oferim o selecție variată de vehicule pentru toate gusturile și bugetele.</p>
                <p>Vizitează secțiunea noastră de oferte pentru a găsi mașina perfectă pentru tine!</p>
                <div className="button-group">
                    {!isAuthenticated && (
                        <>
                            <button onClick={handleGoToCarList}>Vezi Lista de Mașini</button>
                            <button onClick={handleGoToShowRoomList}>Vezi Showroom-uri</button>
                            <button onClick={handleGoToLogIn}>Creare Cont/Autentificare</button>
                        </>
                    )}
                    {isAuthenticated && userRole === 'Client' && (
                        <>
                            <button onClick={handleGoToCarList}>Vezi Lista de Mașini</button>
                            <button onClick={handleGoToShowRoomList}>Vezi Showroom-uri</button>
                            <button onClick={handleGoToDataManagement}>Vezi Date Personale</button>
                            <button onClick={handleGoToCarHistory}>Istoric Comenzi</button>
                            <button onClick={handleGoToViewCart}>Vezi Cosul</button>
                            <button onClick={handleGoToFavorites}>Favorite</button>
                        </>
                    )}

                    {isAuthenticated && userRole === 'Admin' && (
                        <>
                            <button onClick={handleGoToManagementShowrooms}>Management Showroom-uri</button>
                            <button onClick={handleGoToManagementClients}>Management Clienți</button>
                            <button onClick={handleGoToManagementCars}>Management Mașini</button>
                        </>
                    )}
                    {isAuthenticated && (
                        <button onClick={handleLogout}>Logout</button>
                    )}
                </div>
            </main>
            <footer>
                <p>&copy; 2024 Dealer Auto. Toate drepturile rezervate.</p>
            </footer>
        </div>
    );
}

export default Home;
