import './App.css';

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';
import Agent from './components/AgentDash';
import Investor from './components/InvestorDash';
import Owner from './components/HomeOwnerDash';
import SignIn from './signIn';
import SignUp from './signUp';
import Account from './components/Account';
//import TestFirebase from './testFirebase';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  // Check if the user is authenticated using cookies or localStorage
  useEffect(() => {
    // Decode the JWT token and get user role
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role); // Assuming `role` is provided in the token
    }
  }, []);


  const renderDashboard = () => {
    if (role === 1) return <Navigate to="/owner" />;
    if (role === 2) return <Navigate to="/investor" />;
    if (role === 3) return <Navigate to="/broker" />;
    if (role === 4) return <Navigate to="/realEstate" />;
    return <Navigate to="/" />;
  };


  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Redirect user to their dashboard based on role */}
          <Route path="/dashboard" element={isAuthenticated ? renderDashboard() : <Navigate to="/" />} />
          <Route path="/account" element={isAuthenticated ? <Account /> : <Navigate to="/" />} />

          {/* Protected Routes */}
          {isAuthenticated && (
            <>
              <Route path="/search" element={<Main />} />
              <Route path="/owner" element={<Owner />} />
              <Route path="/realEstate" element={<Agent />} />
              <Route path="/investor" element={<Investor />} />
            </>
          )}

          {/* Redirect to SignIn if the user is not authenticated */}
          {!isAuthenticated && <Route path="*" element={<Navigate to="/" />} />}
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
