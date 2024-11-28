import React, { useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode';


const Account = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded); // Assuming the token contains `name`, `email`, `role`, etc.
    }
  }, []);

  return (
    <div>
      <h2>Account Information</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Password:</strong> ******** (hidden for security)</p>
    </div>
  );
};

export default Account;
