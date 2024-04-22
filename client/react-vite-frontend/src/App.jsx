/* eslint-disable no-unused-vars */
import './App.css';
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Container, Row, Col } from 'react-bootstrap';
import Login from './components/Login';
import Home from './components/Home';
import CreateUser from './components/CreateUser';
import CreateVital from './components/CreateVital';
import CreateAlert from './components/CreateAlert';
import UpdateVital from './components/UpdateVital';
import FitnessGames from './components/FitnessGames';
import PatientAlerts from './components/PatientAlerts';
import CovidSurvey from './components/CovidSurvey';
import PredictDisease from './components/PredictDisease';
import CreateDailyMotivation from './components/CreateDailyMotivation';
import { checkTokenValidity } from './utils/authUtils';

function App() {

  const [token, setToken] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [userRole, setUserRole] = useState(''); 

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    checkTokenValidity(setLoggedInEmail, setUserRole, setLoginStatus);
  }, []);

  async function handleLogout() {
    try {
      const response = await fetch('http://localhost:3000/user/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.message === 'Logged out successfully!') {
        console.log("Logged out successfully!")
        localStorage.removeItem('token'); 
      }
      window.location.href = '/home'; 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  return (
    <Router>
      <Navbar bg="primary" variant="dark" expand="lg" style={{ marginBottom: '5%'}}>
        <Container>
          <Navbar.Brand as={Link} to="/home">Centennial College Health Clinic</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>

            {userRole === "patient" && (
              <>
                <Nav.Link as={Link} to="/fitness-games">Fitness Games</Nav.Link>
                <Nav.Link as={Link} to="/covid-survey">Covid Survey</Nav.Link>
                <Nav.Link as={Link} to="/createalert">Emergency Alert</Nav.Link>
              </>
            )}

            {userRole === "nurse" && (
              <>
                <Nav.Link as={Link} to="/home">View Patient Vitals</Nav.Link>
                <Nav.Link as={Link} to="/patient-alerts">Patient Alerts</Nav.Link>
                <Nav.Link as={Link} to="/create-daily-message">Create Daily Message</Nav.Link>
                <Nav.Link as={Link} to="/createvital">Create Vital</Nav.Link>
              </>
            )}
            {!token ? (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/createuser">Sign Up</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/predict-disease">Disease Predictor</Nav.Link>
                <Nav.Link as={Link} to="/" onClick={handleLogout}>Logout</Nav.Link>
              </>
            )}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div>
        <Routes>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="createuser" element={<CreateUser />} />
          <Route path="fitness-games" element={<FitnessGames />} />
          <Route path="createvital" element={<CreateVital />} />
          <Route path="createalert" element={<CreateAlert />} />
          <Route path="/create-daily-message" element={<CreateDailyMotivation />} />
          <Route path="patient-alerts" element={<PatientAlerts />} />
          <Route path="covid-survey" element={<CovidSurvey />} />
          <Route path="predict-disease" element={<PredictDisease />} />
          <Route path="updatevital/:id" element={<UpdateVital />} />
        </Routes>
      </div>
      
      <footer className="bg-primary text-white text-center py-4" style={{ marginTop: '5%' }}>
        <Container>
          <Row>
            <Col>
              <h4>Site Map</h4>
              <ul className="list-unstyled">
                <li><Link className="text-white" to="/home">Home</Link></li>
                {userRole === "patient" && (
                  <>
                    <li><Link className="text-white" to="/fitness-games">Fitness Games</Link></li>
                    <li><Link className="text-white" to="/covid-survey">Covid Survey</Link></li>
                    <li><Link className="text-white" to="/createalert">Emergency Alert</Link></li>
                  </>
                )}
                {userRole === "nurse" && (
                  <>
                    <li><Link className="text-white" to="/home">View Patient Vitals</Link></li>
                    <li><Link className="text-white" to="/patient-alerts">Patient Alerts</Link></li>
                    <li><Link className="text-white" to="/create-daily-message">Create Daily Message</Link></li>
                    <li><Link className="text-white" to="/createvital">Create Vital</Link></li>
                  </>
                )}
                {userRole === "nurse" || userRole === "patient" && (
                  <>
                <li><Link className="text-white" to="/predict-disease">Disease Predictor</Link></li>
                  </>
                )}
              </ul>
            </Col>
          </Row>
        </Container>
      </footer>

      
    </Router>
  );
}

export default App;
