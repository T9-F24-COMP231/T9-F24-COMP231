import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import "./assets/styles/auth.css";


const SignIn = ({ setAuth }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    // In fetchProperty function

    const handleSignIn = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
    
            const result = await response.json();
            if (response.ok) {
                if (result.token) {
                    localStorage.setItem("authToken", result.token);
    
                    // Decode the token to extract user role
                    const decodedToken = jwtDecode(result.token);
    
                    // Update state immediately
                    setAuth(true);
                    navigate(getDashboardRoute(decodedToken.role)); // Navigate directly
    
                    console.log(`Logged in as role: ${decodedToken.role}`);
                }
            } else {
                alert(`Sign-in failed: ${result.message}`);
            }
        } catch (error) {
            console.error("Error during sign-in:", error);
            alert("An error occurred. Please try again.");
        }
    };
    
    // Helper function for role-based navigation
    const getDashboardRoute = (role) => {
        switch (role) {
            case 1: return "/owner";
            case 2: return "/investor";
            case 3: return "/broker";
            case 4: return "/realEstate";
            default: return "/";
        }
    };
    

    return (
        <div className="signIn_component">
            <h2>Sign In</h2>
            <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignIn}>Sign In</button>
        </div>
    );
};

export default SignIn;
