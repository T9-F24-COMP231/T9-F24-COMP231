import React, { useState } from 'react';
import axios from 'axios';

const SupportForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        issue: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/support-tickets', formData);
            if (response.status === 201) {
                alert('Support request submitted successfully!');
                setFormData({ name: '', email: '', issue: '', description: '' });
            }
        } catch (err) {
            alert('Failed to submit support request.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </label>
            <label>
                Email:
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </label>
            <label>
                Issue:
                <select name="issue" value={formData.issue} onChange={handleChange} required>
                    <option value="">Select an issue</option>
                    <option value="login">Login Issues</option>
                    <option value="listing">Listing Errors</option>
                    <option value="other">Other</option>
                </select>
            </label>
            <label>
                Description:
                <textarea name="description" value={formData.description} onChange={handleChange} required />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
};

export default SupportForm;