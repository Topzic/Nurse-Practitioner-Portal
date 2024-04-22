/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "./entryform.css"

const UpdateVital = () => {
    const [updateVitalStatus, setUpdateVitalStatus] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); 

    const handleCancel = () => {
        navigate('/home');
    };

    useEffect(() => {
        if (id) {
            fetchVitalData(id);
        }
    }, [id]);

    async function fetchVitalData(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/vital/${id}`);
            const data = await response.json();
            document.getElementById('heartRate').value = data.heartRate;
            document.getElementById('bloodPressure').value = data.bloodPressure;
            document.getElementById('temperature').value = data.temperature;
            document.getElementById('respiratoryRate').value = data.respiratoryRate;
        } catch (error) {
            console.error('Error fetching vital data:', error);
        }
    }

    async function handleUpdateVital(timestamp, heartRate, bloodPressure, temperature, respiratoryRate) {
        try {
            const response = await fetch(`http://localhost:3000/vital/update/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ timestamp, heartRate, bloodPressure, temperature, respiratoryRate }),
            });
            const data = await response.json();
            setUpdateVitalStatus(data);
            window.location.href = '/home';
        } catch (error) {
            console.error('Error updating vital:', error);
        }
    }

    return (
        <div className='mt-3'>
            <div className='container'>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const timestamp = new Date().toISOString();
                    const heartRate = e.target.heartRate.value;
                    const bloodPressure = e.target.bloodPressure.value;
                    const temperature = e.target.temperature.value;
                    const respiratoryRate = e.target.respiratoryRate.value;
                    handleUpdateVital(timestamp, heartRate, bloodPressure, temperature, respiratoryRate);
                }}>

                    <Form.Group>
                        <Form.Label>ID:</Form.Label>
                        <Form.Control type="text" id="id" name="id" value={id} readOnly/>
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

                    <div className="d-flex justify-content-between">
                        <Button className='mt-3' variant="btn btn-success" type="submit">Update</Button>
                        <Button className='mt-3' variant="btn btn-warning" onClick={handleCancel}>Cancel</Button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default UpdateVital;
