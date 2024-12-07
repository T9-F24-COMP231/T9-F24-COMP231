import React, { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [actionInProgress, setActionInProgress] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                const userInfo = jwtDecode(token);
                setCurrentUserId(parseInt(userInfo.id));
                setIsAuthorized([3, 4, 7, 8].includes(parseInt(userInfo.id)));
                await fetchUsers(token);
            }
        };

        initialize();
    }, []);

    const fetchUsers = async (token) => {
        try {
            const response = await fetch('http://localhost:5001/users', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch users');
            
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeactivateStatus = async (userId, currentStatus) => {
        setActionInProgress(true);
        const token = localStorage.getItem('authToken');
        const newStatus = currentStatus === 'YES' ? 'NO' : 'YES';
        
        try {
            const response = await fetch('http://localhost:5001/deactivateUser', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    userId,
                    userStatus: newStatus 
                })
            });

            if (!response.ok) throw new Error('Failed to update user status');
            await fetchUsers(token);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setActionInProgress(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toString().includes(searchTerm)
    );

    if (!isAuthorized) {
        return (
            <div className="access-denied">
                <div className="error-card">
                    <h2>Access Denied</h2>
                    <p>You don't have administrative access.</p>
                    <p>User ID: {currentUserId}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>User Management</h1>
                    <p>Manage system users and permissions</p>
                </div>
            </div>

            <div className="search-section">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search users by name, email, or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                {!isLoading && (
                    <div className="search-stats">
                        Found {filteredUsers.length} of {users.length} users
                    </div>
                )}
            </div>

            <div className="content-section">
                {isLoading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading users...</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Email Alerts</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className="role-badge">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${user.receive_email ? 'active' : 'inactive'}`}>
                                                {user.receive_email ? "Enabled" : "Disabled"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${user.deactivated === 'YES' ? 'deactivated' : 'active'}`}>
                                                {user.deactivated === 'YES' ? 'Deactivated' : 'Active'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleDeactivateStatus(user.id, user.deactivated)}
                                                disabled={actionInProgress}
                                                className={`action-button ${user.deactivated === 'YES' ? 'activate' : 'deactivate'}`}
                                            >
                                                {user.deactivated === 'YES' ? 'Activate' : 'Deactivate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && (
                            <div className="empty-state">
                                No users match your search criteria
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;