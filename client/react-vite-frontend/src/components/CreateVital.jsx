/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
//
import { useNavigate } from 'react-router-dom';

import "./entryform.css"


const CreateVital = () => {
    const [createVitalStatus, setCreateVitalStatus] = useState('');
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/home');
    };

    async function handleCreateVital(patient, timestamp, heartRate, bloodPressure, temperature, respiratoryRate) {
        try {
            const response = await fetch('http://localhost:3000/vital/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ patient, timestamp, heartRate, bloodPressure, temperature, respiratoryRate }),
            });
            const data = await response.json();
            setCreateVitalStatus(data);
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
                    const patient = e.target.patient.value;
                    const timestamp = new Date().toISOString();
                    const heartRate = e.target.heartRate.value;
                    const bloodPressure = e.target.bloodPressure.value;
                    const temperature = e.target.temperature.value;
                    const respiratoryRate = e.target.respiratoryRate.value;
                    handleCreateVital(patient, timestamp, heartRate, bloodPressure, temperature, respiratoryRate);
                }}>

                    <Form.Group>
                        <Form.Label>Patient Name:</Form.Label>
                        <Form.Control type="text" id="patient" name="patient" required/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Heart Rate:</Form.Label>
                        <Form.Control type="number" id="heartRate" name="heartRate" required/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Blood Pressure:</Form.Label>
                        <Form.Control type="text" id="bloodPressure" name="bloodPressure" required/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Temperature:</Form.Label>
                        <Form.Control type="number" step="0.1" id="temperature" name="temperature" required/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Respiratory Rate:</Form.Label>
                        <Form.Control type="number" id="respiratoryRate" name="respiratoryRate" required/>
                    </Form.Group>

                    
                    <div className="d-flex justify-content-between"> {/* Align buttons to the sides */}
                        <Button className='mt-3' variant="btn btn-success" type="submit">Create</Button>
                        <Button className='mt-3' variant="btn btn-warning" onClick={handleCancel}>Cancel</Button>
                    </div>


                </form>
            </div>
        </div>
    );
}

export default CreateVital;
