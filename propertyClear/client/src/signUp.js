import React, { useState } from "react";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRoleNumber] = useState(1);

    const handleSignUp = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password, role }),
            });

            const result = await response.json();
            if (response.ok) {
                alert("User signed up successfully!");
            } else {
                alert(`Sign-up failed: ${result.message}`);
            }
        } catch (error) {
            console.error("Error during sign-up:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
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
            <input
                type="number"
                placeholder="Role Number"
                value={role}
                onChange={(e) => setRoleNumber(parseInt(e.target.value))}
            />
            <button onClick={handleSignUp}>Sign Up</button>
        </div>
    );
};

export default SignUp;
