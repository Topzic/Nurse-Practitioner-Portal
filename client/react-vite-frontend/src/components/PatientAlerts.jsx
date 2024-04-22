/* eslint-disable no-unused-vars */
// Home.js
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { checkTokenValidity } from '../utils/authUtils';


function PatientAlerts() {
  
  const [alerts, setAlerts] = useState(null);
  const [loginStatus, setLoginStatus] = useState('');
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
  
      async function fetchAlerts() {
        try {
          const response = await fetch('http://localhost:3000/emergency-alert/all');
          const data = await response.json();
          setAlerts(data);
        } catch (error) {
          console.error('Error fetching alerts:', error);
        }
      }

      checkTokenValidity(setLoggedInEmail, setUserRole, setLoginStatus);
      fetchAlerts();
  }, []);
  
  return (
    
<div className='container'>
  {userRole === 'nurse' && alerts && loginStatus && loginStatus !== 'auth' && (
    <div className='mt-3'>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Time</th>
            <th>Patient</th>
            <th>Alert Details</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <tr key={alert._id}>
              <td>{new Date(alert.createdAt).toLocaleString()}</td>
              <td>{alert.patient}</td>
              <td>{alert.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

  );
}

export default PatientAlerts;
