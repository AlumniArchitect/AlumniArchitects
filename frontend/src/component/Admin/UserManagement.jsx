// UserManagement.js
import React, { useState, useEffect } from 'react';
import Constant from '../../utils/Constant'; // Adjust the path as needed
import { Plus } from 'lucide-react';

const UserManagement = ({ admin, jwt }) => {
    const [newModeratorEmail, setNewModeratorEmail] = useState('');
    const [moderators, setModerators] = useState([]);
    const [unverifiedAlumni, setUnverifiedAlumni] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (admin) {
            setModerators(admin.moderators || []);
            setUnverifiedAlumni(admin.unverifiedAlumni || []);
            setUsers(admin.users || []);
        }
    }, [admin]);

    const handleAddModerator = async () => {
        try {
            const response = await fetch(`${Constant.BASE_URL}/api/admin/addModerator?adminId=${admin.id}&moderatorEmail=${newModeratorEmail}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to add moderator: ${response.status}`);
            }

            const updatedAdmin = await response.json();
            setModerators(updatedAdmin.moderators || []);
            setNewModeratorEmail(''); // Clear the input field
        } catch (error) {
            console.error('Error adding moderator:', error);
            // Handle error (e.g., display an error message)
        }
    };

    return (
        <div className="user-management">
            <h1>User Management</h1>

            {/* Add Moderator Section */}
            <div className="add-moderator">
                <h2>Add Moderator</h2>
                <input
                    type="email"
                    placeholder="Enter moderator email"
                    value={newModeratorEmail}
                    onChange={(e) => setNewModeratorEmail(e.target.value)}
                />
                <button onClick={handleAddModerator}>
                    <Plus size={16} /> Add Moderator
                </button>
            </div>

            {/* List of Moderators */}
            <div className="moderators-list">
                <h2>Moderators</h2>
                {moderators.length > 0 ? (
                    <ul>
                        {moderators.map((moderator, index) => (
                            <li key={index}>{moderator}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No moderators found.</p>
                )}
            </div>

            {/* List of Unverified Alumni */}
            <div className="unverified-alumni-list">
                <h2>Unverified Alumni</h2>
                {unverifiedAlumni.length > 0 ? (
                    <ul>
                        {unverifiedAlumni.map((alumnus, index) => (
                            <li key={index}>{alumnus}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No unverified alumni found.</p>
                )}
            </div>

            {/* List of Users */}
            <div className="users-list">
                <h2>Users</h2>
                {users.length > 0 ? (
                    <ul>
                        {users.map((user) => (
                            <li key={user.id}>{user.fullName} ({user.email})</li>
                        ))}
                    </ul>
                ) : (
                    <p>No users found.</p>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
