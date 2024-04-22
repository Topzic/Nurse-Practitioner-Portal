/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { checkTokenValidity } from '../utils/authUtils';

function FitnessGames() {
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [loginStatus, setLoginStatus] = useState('');

  useEffect(() => {
    checkTokenValidity(setLoggedInEmail, setUserRole, setLoginStatus);
  }, []);

  // Sample fitness games data
// Sample fitness games data
const fitnessGames = [
    {
      id: 1,
      title: 'Jump Rope Challenge',
      description: 'A fun jump rope challenge to get your heart pumping!',
    },
    {
      id: 2,
      title: 'Yoga Flow',
      description: 'Relax your mind and body with a soothing yoga flow session.',
    },
    {
      id: 3,
      title: 'High-Intensity Interval Training (HIIT)',
      description: 'Burn calories and build strength with this intense workout.',
    },
    {
      id: 4,
      title: 'Soccer Shootout',
      description: 'Test your accuracy and agility with penalty shootout challenges.',
    },
    {
      id: 5,
      title: 'Basketball Dunk Contest',
      description: 'Show off your dunking skills in this exciting basketball contest.',
    },
    {
      id: 6,
      title: 'Cycling Adventure',
      description: 'Take a virtual cycling tour through scenic landscapes and challenging terrains.',
    },
    {
      id: 7,
      title: 'Hiking Expedition',
      description: 'Embark on a virtual hiking adventure to explore breathtaking trails and nature views.',
    },
    {
      id: 8,
      title: 'Boxing Workout',
      description: 'Train like a boxer and improve your strength, speed, and agility.',
    },
    {
      id: 9,
      title: 'Dance Party',
      description: 'Get your groove on with energetic dance routines and music.',
    },
    {
      id: 10,
      title: 'Martial Arts Training',
      description: 'Learn martial arts techniques and enhance your self-defense skills.',
    },
  ];  

  return (
    <Container className="mt-4">
      {!(loginStatus && loginStatus !== 'auth') ? (
      <div>
          <p>
            Please <Link to="/login">login</Link> to access fitness games.
          </p>
      </div>
      ) : (
      <div>
        <Row>
          {fitnessGames.map((game) => (
            <Col key={game.id} md={4} className="mb-4">
              <Card className="h-100">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{game.title}</Card.Title>
                  <Card.Text>{game.description}</Card.Text>
                  <div className="mt-auto">
                    <Button variant="primary">Play Now</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      )}
    </Container>
  );
}

export default FitnessGames;
