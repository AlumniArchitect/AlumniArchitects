// Dashboard.js
import React from 'react';
import './Dashboard.css'; // Import the CSS file

const Dashboard = ({ admin }) => {
    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <div className="stats">
                <div>
                    <h3>Total Moderators</h3>
                    <p>{admin?.moderators?.length || 0}</p>
                </div>
                <div>
                    <h3>Total Unverified Alumni</h3>
                    <p>{admin?.unverifiedAlumni?.length || 0}</p>
                </div>
                <div>
                    <h3>Total Users</h3>
                    <p>{admin?.users?.length || 0}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
