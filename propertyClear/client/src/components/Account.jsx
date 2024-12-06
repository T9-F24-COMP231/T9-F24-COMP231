import React, { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';

const Account = () => {
  const [user, setUser] = useState({});
  const [receiveAlerts, setReceiveAlerts] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }

    const fetchAlertPreference = async () => {
      try {
        const response = await fetch("http://localhost:5001/account", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch alert preferences');
        }

        const data = await response.json();
        console.log(data[0].receive_emails === 'YES' ? true : false);
        setReceiveAlerts(data[0].receive_emails === 'YES' ? true : false);
      } catch (error) {
        console.error('Error fetching alert preferences:', error);
      }
    };

    fetchAlertPreference();
  }, []);

  const handleAlertToggle = async (event) => {
    const newValue = event.target.checked;
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch("http://localhost:5001/account/update", {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receive_emails: newValue ? 'YES' : 'NO'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update alert preferences');

      }
      setReceiveAlerts(newValue);
    } catch (error) {
      console.error('Error updating alert preferences:', error);
      setReceiveAlerts(!newValue);
    }
  };

  return (
    <div>
      <h2>Account Information</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Password:</strong> ******** (hidden for security)</p>
      <p>
        <strong>Receive alert emails?:</strong>
        <input
          type="checkbox"
          checked={receiveAlerts ?? false}
          onChange={handleAlertToggle}
        />
      </p>
    </div>
  );
};

export default Account;