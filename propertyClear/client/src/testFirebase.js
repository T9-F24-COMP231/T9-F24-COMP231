// src/TestFirebase.js
import React, { useState } from "react";
import { signup, signin, signout } from "./auth";

const TestFirebase = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        await signup(email, password, "Test User", 1);
    };

    const handleSignin = async () => {
        await signin(email, password);
    };

    const handleSignout = async () => {
        await signout();
    };

    return (
        <div>
            <h1>Firebase Auth Test</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignup}>Sign Up</button>
            <button onClick={handleSignin}>Sign In</button>
            <button onClick={handleSignout}>Sign Out</button>
        </div>
    );
};

export default TestFirebase;
