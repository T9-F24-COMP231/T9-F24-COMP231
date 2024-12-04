import React, { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // Check authorization
        const token = localStorage.getItem('authToken');
        if (token) {
            const userInfo = jwtDecode(token);
            const userId = parseInt(userInfo.id);
            setCurrentUserId(userId);
            setIsAuthorized([3, 4, 7, 8].includes(userId));
        }

        // Fetch users
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5001/users', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                console.log(data);
                setUsers(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDeactivateStatus = async (currentStatus) => {
        try {
            const token = localStorage.getItem('authToken');
            const newStatus = currentStatus === 'YES' ? 'NO' : 'YES';
            
            const response = await fetch(`http://localhost:5001/deactivateUser`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userStatus: newStatus })
            });
    
            if (!response.ok) {
                throw new Error(`Failed to ${newStatus === 'YES' ? 'deactivate' : 'reactivate'} user`);
            }
    
            // After successful update, fetch fresh user list
            const refreshResponse = await fetch('http://localhost:5001/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!refreshResponse.ok) {
                throw new Error('Failed to refresh user list');
            }
            
            const updatedUsers = await refreshResponse.json();
            setUsers(Array.isArray(updatedUsers) ? updatedUsers : []);
            
        } catch (error) {
            console.error('Error updating user status:', error);
            alert(`Failed to ${currentStatus === 'YES' ? 'reactivate' : 'deactivate'} user. Please try again.`);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toString().includes(searchTerm)
    );

    if (!isAuthorized) {
        return (
            <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-red-600 text-center mb-4">
                    Access Denied
                </h2>
                <p className="text-center text-gray-600">
                    You don't have administrative access to view this page.
                    Current user ID: {currentUserId}
                </p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">User Management</h1>
                <input
                    type="text"
                    placeholder="Search users by name, email, or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md"
                />
            </div>

            {isLoading ? (
                <div className="text-center py-8">
                    <p>Loading users...</p>
                </div>
            ) : (
                <>
                    <div className="text-sm text-gray-500 mb-4">
                        Showing {filteredUsers.length} of {users.length} users
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Receive Emails
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsers.map((user, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.role}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.receive_email ? "Yes" : "No"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={user.deactivated === 'YES' ? 'text-red-500' : 'text-green-500'}>
                                                {user.deactivated === 'YES' ? 'Deactivated' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleDeactivateStatus(user.deactivated)}
                                                className={`${
                                                    user.deactivated === 'YES' 
                                                        ? 'bg-green-500 hover:bg-green-600' 
                                                        : 'bg-red-500 hover:bg-red-600'
                                                } text-white px-4 py-2 rounded`}
                                            >
                                                {user.deactivated === 'YES' ? 'Reactivate User' : 'Deactivate User'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No users match your search criteria.
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Admin;