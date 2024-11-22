import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const fetchTickets = async () => {
            const response = await axios.get('http://localhost:5000/api/support-tickets');
            setTickets(response.data);
        };
        fetchTickets();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/support-tickets/${id}`, { status });
            setTickets((prevTickets) =>
                prevTickets.map((ticket) =>
                    ticket._id === id ? { ...ticket, status } : ticket
                )
            );
        } catch (err) {
            console.error('Failed to update ticket status');
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <ul>
                {tickets.map((ticket) => (
                    <li key={ticket._id}>
                        <p>{ticket.description}</p>
                        <select
                            value={ticket.status}
                            onChange={(e) => updateStatus(ticket._id, e.target.value)}
                        >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;