import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { patientAPI } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const [patientInfo, setPatientInfo] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        phone: '',
        email: ''
    });

    const [healthData, setHealthData] = useState({
        heartRate: "",
        bloodPressure:
        {
            systolic: "",
            diastolic: ""
        },
        glucose: "",
        weight: ""
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const userDataString = localStorage.getItem('userData');

                if (!token || !userDataString) {
                    setError('Not authenticated. Please log in again.');
                    setLoading(false);
                    return;
                }

                const userData = JSON.parse(userDataString);

                if (!userData._id) {
                    setError('Invalid user data. Please log in again.');
                    setLoading(false);
                    return;
                }


                console.log('Fetching patient info...');
                const patientResponse = await patientAPI.getById(userData._id, token);
                console.log('Patient info response:', patientResponse);
                setPatientInfo({
                    firstName: patientResponse.firstName,
                    lastName: patientResponse.lastName,
                    dateOfBirth: patientResponse.dateOfBirth,
                    phone: patientResponse.phone,
                    email: patientResponse.email
                });


                console.log('Fetching health data...');
                const healthResponse = await patientAPI.getHealthData(userData._id, token);
                console.log('Health data response:', healthResponse);

                if (healthResponse && healthResponse.healthData) {
                    setHealthData({
                        heartRate: healthResponse.healthData.heartRate || 72,
                        bloodPressure: {
                            systolic: healthResponse.healthData.bloodPressure?.systolic || 120,
                            diastolic: healthResponse.healthData.bloodPressure?.diastolic || 80
                        },
                        glucose: healthResponse.healthData.glucose || 95,
                        weight: healthResponse.healthData.weight || 70
                    });
                } else {
                    setError('Failed to load health data: Invalid response format');
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching patient data:', err);
                setError(`Failed to load patient data: ${err.message || 'Unknown error'}`);
                setLoading(false);
            }
        };

        fetchPatientData();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading">Loading patient data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <div className="error">Error: {error}</div>
            </div>
        );
    }


    const currentDate = new Date().toLocaleDateString();

    const heartRateData = [{
        date: currentDate,
        heartRate: healthData.heartRate
    }];

    const glucoseData = [{
        date: currentDate,
        glucose: healthData.glucose
    }];

    const bloodPressureData = [{
        date: currentDate,
        systolic: healthData.bloodPressure.systolic,
        diastolic: healthData.bloodPressure.diastolic
    }];

    const weightData = [{
        date: currentDate,
        weight: healthData.weight
    }];

    return (
        <div className="dashboard-container">
            <motion.h1
                className="dashboard-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Patient Dashboard
            </motion.h1>


            <motion.div
                className="profile-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <h2>Patient Profile</h2>
                <div className="profile-info">
                    <div className="profile-row">
                        <div className="profile-item">
                            <label>Name:</label>
                            <span>{patientInfo.firstName} {patientInfo.lastName}</span>
                        </div>
                        <div className="profile-item">
                            <label>Date of Birth:</label>
                            <span>{new Date(patientInfo.dateOfBirth).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="profile-row">
                        <div className="profile-item">
                            <label>Phone:</label>
                            <span>{patientInfo.phone}</span>
                        </div>
                        <div className="profile-item">
                            <label>Email:</label>
                            <span>{patientInfo.email}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="dashboard-grid">
                <motion.div
                    className="stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h3>Heart Rate</h3>
                    <div className="stat-value">{healthData.heartRate} <span className="stat-unit">bpm</span></div>
                    <p className="stat-label">Resting</p>
                </motion.div>

                <motion.div
                    className="stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h3>Blood Pressure</h3>
                    <div className="stat-value">
                        {healthData.bloodPressure.systolic}/{healthData.bloodPressure.diastolic}
                    </div>
                    <p className="stat-label">Current</p>
                </motion.div>

                <motion.div
                    className="stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h3>Glucose Level</h3>
                    <div className="stat-value">{healthData.glucose} <span className="stat-unit">mg/dL</span></div>
                    <p className="stat-label">Fasting</p>
                </motion.div>

                <motion.div
                    className="stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <h3>Weight</h3>
                    <div className="stat-value">{healthData.weight} <span className="stat-unit">kg</span></div>
                    <p className="stat-label">Current</p>
                </motion.div>
            </div>


            <div className="dashboard-grid">
                <motion.div
                    className="chart-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <h3>Heart Rate</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={heartRateData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={[Math.max(0, healthData.heartRate - 20), parseInt(healthData.heartRate) + 20]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="heartRate" stroke="#2563eb" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    className="chart-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                >
                    <h3>Glucose Level</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={glucoseData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={[Math.max(0, healthData.glucose - 30), parseInt(healthData.glucose) + 30]} />
                                <Tooltip />
                                <Bar dataKey="glucose" fill="#34a853" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>


            <motion.div
                className="chart-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                <h3>Blood Pressure</h3>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={bloodPressureData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[
                                Math.max(0, Math.min(healthData.bloodPressure.systolic, healthData.bloodPressure.diastolic) - 20),
                                Math.max(healthData.bloodPressure.systolic, healthData.bloodPressure.diastolic) + 20
                            ]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="systolic" stroke="#ff6b6b" name="Systolic" />
                            <Line type="monotone" dataKey="diastolic" stroke="#4ecdc4" name="Diastolic" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            <motion.div
                className="chart-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
            >
                <h3>Weight</h3>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={weightData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[Math.max(0, healthData.weight - 10), parseFloat(healthData.weight) + 10]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="weight" stroke="#9b59b6" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;