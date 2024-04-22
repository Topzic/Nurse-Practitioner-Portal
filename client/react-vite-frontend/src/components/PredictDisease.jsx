/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { checkTokenValidity } from '../utils/authUtils';
import { useNavigate } from 'react-router-dom';

const CreateDisease = () => {
    const [loginStatus, setLoginStatus] = useState('');
    const [loggedInEmail, setLoggedInEmail] = useState('');
    const [userRole, setUserRole] = useState('');
    const [symptoms, setSymptoms] = useState({
        itching: false,
        skin_rash: false,
        nodal_skin_eruptions: false,
        continuous_sneezing: false,
        shivering: false,
        chills: false,
        joint_pain: false,
        stomach_pain: false,
        acidity: false,
        ulcers_on_tongue: false,
        muscle_wasting: false,
        vomiting: false,
        burning_micturition: false,
        spotting_urination: false,
        fatigue: false,
        weight_gain: false,
        anxiety: false,
        cold_hands_and_feets: false, 
        mood_swings: false,
        weight_loss: false,
        restlessness: false,
        lethargy: false,
        patches_in_throat: false,
        irregular_sugar_level: false,
        cough: false,
        high_fever: false,
        sunken_eyes: false,
        breathlessness: false,
        sweating: false,
        dehydration: false,
        indigestion: false,
        headache: false,
        yellowish_skin: false,
        dark_urine: false,
        nausea: false,
        loss_of_appetite: false,
        pain_behind_the_eyes: false,
        back_pain: false,
        constipation: false,
        abdominal_pain: false,
        diarrhoea: false,
        mild_fever: false,
        yellow_urine: false,
        yellowing_of_eyes: false,
        acute_liver_failure: false,
        fluid_overload: false,
        swelling_of_stomach: false,
        swelled_lymph_nodes: false,
        malaise: false,
        blurred_and_distorted_vision: false,
        phlegm: false,
        throat_irritation: false,
        redness_of_eyes: false,
        sinus_pressure: false,
        runny_nose: false,
        congestion: false,
        chest_pain: false,
        weakness_in_limbs: false,
        fast_heart_rate: false,
        pain_during_bowel_movements: false,
        pain_in_anal_region: false,
        bloody_stool: false,
        irritation_in_anus: false,
        neck_pain: false,
        dizziness: false,
        cramps: false,
        bruising: false,
        obesity: false,
        swollen_legs: false,
        swollen_blood_vessels: false,
        puffy_face_and_eyes: false,
        enlarged_thyroid: false,
        brittle_nails: false,
        swollen_extremeties: false, 
        excessive_hunger: false,
        extra_marital_contacts: false,
        drying_and_tingling_lips: false,
        slurred_speech: false,
        knee_pain: false,
        hip_joint_pain: false,
        muscle_weakness: false,
        stiff_neck: false,
        swelling_joints: false,
        movement_stiffness: false,
        spinning_movements: false,
        loss_of_balance: false,
        unsteadiness: false,
        weakness_of_one_body_side: false,
        loss_of_smell: false,
        bladder_discomfort: false,
        foul_smell_of_urine: false, 
        continuous_feel_of_urine: false,
        passage_of_gases: false,
        internal_itching: false,
        toxic_look_typhos: false,
        depression: false,
        irritability: false,
        muscle_pain: false,
        altered_sensorium: false,
        red_spots_over_body: false,
        belly_pain: false,
        abnormal_menstruation: false,
        dischromic_patches: false, 
        watering_from_eyes: false,
        increased_appetite: false,
        polyuria: false,
        family_history: false,
        mucoid_sputum: false,
        rusty_sputum: false,
        lack_of_concentration: false,
        visual_disturbances: false,
        receiving_blood_transfusion: false,
        receiving_unsterile_injections: false,
        coma: false,
        stomach_bleeding: false,
        distention_of_abdomen: false,
        history_of_alcohol_consumption: false,
        blood_in_sputum: false,
        prominent_veins_on_calf: false,
        palpitations: false,
        painful_walking: false,
        pus_filled_pimples: false,
        blackheads: false,
        scurring: false,
        skin_peeling: false,
        silver_like_dusting: false,
        small_dents_in_nails: false,
        inflammatory_nails: false,
        blister: false,
        red_sore_around_nose: false,
        yellow_crust_ooze: false,
        prognosis: false,
    });
    const [predictedDisease, setPredictedDisease] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkTokenValidity(setLoggedInEmail, setUserRole, setLoginStatus);
    }, []);

    const handleCancel = () => {
        navigate('/home');
    };

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setSymptoms({
            ...symptoms,
            [name]: checked,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(symptoms)
            });

            if (!response.ok) {
                throw new Error('Failed to predict disease');
            }

            const data = await response.json();
            console.log('Predicted Disease:', data.predicted_disease);
            setPredictedDisease(data.predicted_disease); 
        } catch (error) {
            console.error('Error predicting disease:', error.message);
        }
    };

    return (
<Container className="mt-3">
    <Row>
        <Col>
            <h2>Predict Disease</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        {Object.entries(symptoms)
                            .slice(0, 33)
                            .map(([symptom, checked]) => (
                                <Form.Check
                                    key={symptom}
                                    type='checkbox'
                                    id={symptom}
                                    label={symptom.replace(/_/g, ' ')}
                                    name={symptom}
                                    checked={checked}
                                    onChange={handleCheckboxChange}
                                />
                        ))}
                    </Col>
                    <Col>
                        {Object.entries(symptoms)
                            .slice(33, 66)
                            .map(([symptom, checked]) => (
                                <Form.Check
                                    key={symptom}
                                    type='checkbox'
                                    id={symptom}
                                    label={symptom.replace(/_/g, ' ')}
                                    name={symptom}
                                    checked={checked}
                                    onChange={handleCheckboxChange}
                                />
                        ))}
                    </Col>
                    <Col>
                        {Object.entries(symptoms)
                            .slice(66, 99)
                            .map(([symptom, checked]) => (
                                <Form.Check
                                    key={symptom}
                                    type='checkbox'
                                    id={symptom}
                                    label={symptom.replace(/_/g, ' ')}
                                    name={symptom}
                                    checked={checked}
                                    onChange={handleCheckboxChange}
                                />
                        ))}
                    </Col>
                    <Col>
                        {Object.entries(symptoms)
                            .slice(99)
                            .map(([symptom, checked]) => (
                                <Form.Check
                                    key={symptom}
                                    type='checkbox'
                                    id={symptom}
                                    label={symptom.replace(/_/g, ' ')}
                                    name={symptom}
                                    checked={checked}
                                    onChange={handleCheckboxChange}
                                />
                        ))}
                    </Col>
                </Row>
                <Button className="ml-3" variant='primary' type='submit'>
                    Predict Disease
                </Button>
                <Button className="m-3" variant='secondary' onClick={handleCancel}>
                    Cancel
                </Button>
            </Form>
            {/* Display predicted disease result */}
            {predictedDisease && (
                <Alert variant="danger" className="mt-3">
                    Predicted Disease: {predictedDisease}
                </Alert>
            )}
            {predictedDisease && (
                <h5 className="mt-3 text-center text-danger">
                    Based on the symptoms you have selected, there is a chance that you may have {predictedDisease}. We recommend taking action and notifying the nurse. Consider sending an <a href="/createalert">emergency alert</a> to ensure prompt attention and care.
                </h5>
            )}
        </Col>
    </Row>
</Container>
    );
};

export default CreateDisease;