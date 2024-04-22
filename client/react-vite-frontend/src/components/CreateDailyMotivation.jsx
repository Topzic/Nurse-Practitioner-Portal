/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { checkTokenValidity } from '../utils/authUtils';
import { useNavigate } from 'react-router-dom';
import "./entryform.css"


const CreateDailyMotivation = () => {
    const [createDailyMotivationStatus, setDailyMotivationStatus] = useState('');
    const [loginStatus, setLoginStatus] = useState('');
    const [loggedInEmail, setLoggedInEmail] = useState('');
    const [userRole, setUserRole] = useState(''); // Add userRole state
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/home');
    };

    useEffect(() => {
        checkTokenValidity(setLoggedInEmail, setUserRole, setLoginStatus);
    }, []);


    async function handleCreateDailyMotivation(message) {
        try {
            const response = await fetch('http://localhost:3000/daily-motivation/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ author: loggedInEmail, message }),
            });
            const data = await response.json();
            setDailyMotivationStatus(data);
            window.location.href = '/home';
        } catch (error) {
            console.error('Error creating vital:', error);
        }
    }

    return (
        <div className='mt-3'>
            <div className='container'>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const message = e.target.message.value;
                    handleCreateDailyMotivation(message);
                }}>

                    <Form.Group>
                        <Form.Label>Daily Motivational Message:</Form.Label>
                        <Form.Control as="textarea" rows={3} id="message" name="message" required/>
                    </Form.Group>

                    
                    <div className="d-flex justify-content-between"> {/* Align buttons to the sides */}
                        <Button className='mt-3' variant="btn btn-primary" type="submit">Create</Button>
                        <Button className='mt-3' variant="btn btn-warning" onClick={handleCancel}>Cancel</Button>
                    </div>


                </form>
            </div>
        </div>
    );
}

export default CreateDailyMotivation;