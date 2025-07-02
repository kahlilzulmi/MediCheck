import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Assuming an api helper for authenticated requests
import './Account.css'; // We'll create this for styling in the next step

const Account = ({ onLogout }) => {
    const [currentUser, setCurrentUser] = useState({ username: '' });
    const [formData, setFormData] = useState({ username: '' });
    const [notification, setNotification] = useState({ message: '', type: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/users/me');
                setCurrentUser(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                setNotification({ message: 'Failed to load user data.', type: 'error' });
            }
        };
        fetchUser();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setNotification({ message: '', type: '' });

        // Only include fields that have actually changed
        const updatedFields = {};
        if (formData.username.trim() && formData.username !== currentUser.username) {
            updatedFields.username = formData.username;
        }

        if (Object.keys(updatedFields).length === 0) {
            setNotification({ message: 'No changes to update.', type: 'info' });
            return;
        }

        try {
            await api.put('/users/me', updatedFields);
            setNotification({ message: 'Account updated successfully! Please log in again with your new details.', type: 'success' });
            
            // Force logout to re-authenticate with new details, especially if username changed
            setTimeout(() => {
                onLogout();
                navigate('/login');
            }, 3000);

        } catch (error) {
            const errorMessage = error.response?.data?.detail || 'An error occurred during update.';
            setNotification({ message: errorMessage, type: 'error' });
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action is irreversible and will remove all your data.')) {
            try {
                await api.delete('/users/me');
                setNotification({ message: 'Account deleted successfully.', type: 'success' });
                
                // Force logout and redirect to home
                setTimeout(() => {
                    onLogout();
                    navigate('/');
                }, 2000);

            } catch (error) {
                const errorMessage = error.response?.data?.detail || 'Failed to delete account.';
                setNotification({ message: errorMessage, type: 'error' });
            }
        }
    };

    return (
        <div className="account-container">
            <button onClick={() => navigate('/')} className="btn-back">Back to Home</button>
            <h2>Account Management</h2>
            
            {notification.message && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}

            <div className="account-section">
                <h3>Update Your Details</h3>
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required />
                    </div>
                    <button type="submit" className="btn-update">Update Details</button>
                </form>
            </div>

            <div className="account-section danger-zone">
                <h3>Danger Zone</h3>
                <p>Deleting your account will permanently remove all your data, including your prediction history.</p>
                <button onClick={handleDelete} className="btn-delete">Delete My Account</button>
            </div>
        </div>
    );
};

export default Account;
