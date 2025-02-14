// AdminPanel.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import HomepageManagement from './HomepageManagement';
import UserManagement from './UserManagement';
import EventOrganization from './EventOrganization';
import PaymentGatewayDetails from './PaymentGatewayDetails';
import Constant from '../../utils/Constant'; // Adjust the path as needed
import './AdminPanel.css'; // Import your CSS file for styling

const AdminPanel = () => {
  const [admin, setAdmin] = useState(null);
  const jwt = localStorage.getItem('jwt'); // Retrieve JWT token
  const adminEmail = localStorage.getItem('email');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch(`${Constant.BASE_URL}/api/admin/by-email?email=${adminEmail}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`, // Include JWT token in the header
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch admin data: ${response.status}`);
        }

        const adminData = await response.json();
        setAdmin(adminData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        // Handle error (e.g., display an error message)
      }
    };

    fetchAdminData();
  }, [jwt]);

  return (
    <Router>
      <div className="admin-panel">
        <aside className="sidebar">
          <h2>Admin Panel</h2>
          <nav>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/homepage">Homepage Management</Link></li>
              <li><Link to="/users">User Management</Link></li>
              <li><Link to="/events">Event Organization</Link></li>
              <li><Link to="/payments">Payment Gateway Details</Link></li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          <Switch>
            <Route path="/dashboard">
              <Dashboard admin={admin} />
            </Route>
            <Route path="/homepage" component={HomepageManagement} />
            <Route path="/users">
              <UserManagement admin={admin} jwt={jwt} />
            </Route>
            <Route path="/events" component={EventOrganization} />
            <Route path="/payments" component={PaymentGatewayDetails} />
          </Switch>
        </main>
      </div>
    </Router>
  );
};

export default AdminPanel;
