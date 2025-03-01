import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Components/Home';
import CarList from './Components/CarList';
import './Styles/App.css';
import ShowroomList from "./Components/ShowroomList";
import LogIn from "./Components/LogIn";
import DataManagement from "./Components/DataManagement";
import CarHistory from "./Components/IstoricMasini";
import ShowroomManagement from "./Components/ShowroomManagement";
import ClientManagement from "./Components/ClientManagement";
import CarManagement from "./Components/CarManagement";
import {useEffect, useState} from "react";
import CreateAccount from "./Components/CreateAccount";
import ViewCart from "./Components/ViewCart";
import Order from "./Components/Order";
import Favorites from "./Components/Favorites";


function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [idUser, setIdUser] = useState('');
    const [viewCarList, setViewCarList] = useState(false);
    const [isViewCart, setIsViewCart] = useState(false);


    useEffect(() => {
        const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
        const storedUserRole = localStorage.getItem('userRole');
        const storedIdUser = localStorage.getItem('idUser');
        if (storedIsAuthenticated === 'true' && storedUserRole && storedIdUser) {
            setIsAuthenticated(true);
            setUserRole(storedUserRole);
            setIdUser(storedIdUser);
        } else {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userRole');
            localStorage.removeItem('idUser');
            setIsAuthenticated(false);
            setUserRole('');
            setIdUser(null);
        }
    }, []);
    return (
        <Router>
            <div className="App">
                <main>
                    <Routes>
                        <Route path="/" element={<Home isAuthenticated={isAuthenticated} userRole={userRole}
                                                       setAuthenticated={setIsAuthenticated}
                                                       setUserRole={setUserRole}/>}/>
                        <Route path="/cars"
                               element={<CarList viewCarList={viewCarList} setViewCarList={setViewCarList}/>}/>
                        <Route path="/show-room-list" element={<ShowroomList userRole={userRole}/>}/>
                        <Route path="/login"
                               element={<LogIn setAuthenticated={setIsAuthenticated} setUserRole={setUserRole}
                                               setIdUser={setIdUser}/>}/>
                        <Route path="/data-management" element={<DataManagement idUser={idUser}/>}/>
                        <Route path="/carHistory" element={<CarHistory/>}/>
                        <Route path="/management-showrooms" element={<ShowroomManagement userRole={userRole}/>}/>
                        <Route path="/management-clients" element={<ClientManagement/>}/>
                        <Route path="/management-cars" element={<CarManagement/>}/>
                        <Route path="/create-account"
                               element={<CreateAccount setAuthenticated={setIsAuthenticated} setUserRole={setUserRole}
                                                       setIdUser={setIdUser}/>}/>
                        <Route path="/view-cart" element={<ViewCart idUser={idUser} setIsViewCart={setIsViewCart}/>}/>
                        <Route path="/order" element={<Order/>}/>
                        <Route path="/favorites" element={<Favorites/>}/>

                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
