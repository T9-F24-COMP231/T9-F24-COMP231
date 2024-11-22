require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Database Connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
});

// Define the SupportTicket Model
const SupportTicket = sequelize.define('SupportTicket', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    issue: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Open',
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
});

// Initialize Database
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully!');
        await sequelize.sync({ alter: true }); // Sync models to database
    } catch (error) {
        console.error('Database connection failed:', error);
    }
})();

// API Endpoints

// Create a new ticket
app.post('/api/support-tickets', async (req, res) => {
    try {
        const ticket = await SupportTicket.create(req.body);
        res.status(201).json(ticket);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create ticket' });
    }
});

// Fetch all tickets
app.get('/api/support-tickets', async (req, res) => {
    try {
        const tickets = await SupportTicket.findAll();
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});

// Update ticket status
app.put('/api/support-tickets/:id', async (req, res) => {
    try {
        const ticket = await SupportTicket.findByPk(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        ticket.status = req.body.status;
        await ticket.save();
        res.json(ticket);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update ticket' });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));