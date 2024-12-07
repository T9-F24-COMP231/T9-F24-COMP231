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

      // Fetch the user's alert preferences
      fetchAlertPreference(token);
    }
  }, []);

  const fetchAlertPreference = async (token) => {
    try {
      const response = await fetch("http://localhost:5001/account", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch alert preferences');
      const data = await response.json();
      setReceiveAlerts(data[0].receive_emails === 'YES' ? true : false);
    } catch (error) {
      console.error('Error fetching alert preferences:', error);
    }
  };

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
    <div className="account-page">
      <div className="account-container">
        <div className="account-header">
          <h1>Account Settings</h1>
          <p>Manage your profile and preferences</p>
        </div>
        
        <div className="account-content">
          <div className="info-grid">
            <div className="info-item">
              <div className="label">Name</div>
              <div className="value">{user.name}</div>
            </div>

            <div className="info-item">
              <div className="label">Email Address</div>
              <div className="value">{user.email}</div>
            </div>

            <div className="info-item">
              <div className="label">Role</div>
              <div className="value">Role {user.role}</div>
            </div>

            <div className="info-item">
              <div className="label">Password</div>
              <div className="value">•••••••••• (Protected)</div>
            </div>

            <div className="info-item">
              <div className="toggle-container">
                <div>
                  <div className="label">Notification Settings</div>
                  <div className="toggle-label">
                    Receive important updates and alerts
                  </div>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={receiveAlerts ?? false}
                    onChange={handleAlertToggle}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div>
                <span className={`status-badge ${receiveAlerts ? 'active' : 'inactive'}`}>
                  {receiveAlerts ? '✓ Notifications Enabled' : '× Notifications Disabled'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;