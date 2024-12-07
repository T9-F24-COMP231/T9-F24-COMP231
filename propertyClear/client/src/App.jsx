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
import Help from './components/Help';
import Admin from './components/Admin';
//import TestFirebase from './testFirebase';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setRole } = useState(null);
  // Check if the user is authenticated using cookies or localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsAuthenticated(true);
        setRole(decodedToken.role);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('authToken');
      }
    }
  }, [setIsAuthenticated, setRole]);



  return (
    <div className="App">
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<SignIn setAuth={setIsAuthenticated} />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          {isAuthenticated && (
            <>
              <Route path="/account" element={<Account />} />
              <Route path="/help" element={<Help />} />
              <Route path="/search" element={<Main />} />
              <Route path="/owner" element={<Owner />} />
              <Route path="/realEstate" element={<Agent />} />
              <Route path="/investor" element={<Investor />} />
              <Route path="/admin" element={<Admin />} />
            </>
          )}

          {/* Redirect unauthenticated users */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
