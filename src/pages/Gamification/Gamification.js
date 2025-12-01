import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { patientAPI } from '../../services/api';
import './Gamification.css';

const Gamification = () => {
    const [patientInfo, setPatientInfo] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        phone: '',
        email: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const healthStats = {
        steps: { current: 8432, goal: 10000 },
        water: { current: 6, goal: 8 },
        meditation: { current: 3, goal: 7 }
    };

    const rewards = [
        { id: 1, title: 'Bronze Badge', icon: '🥇', description: 'First Week Completion' },
        { id: 2, title: 'Silver Badge', icon: '🥈', description: 'Consistent for 2 Weeks' },
        { id: 3, title: 'Gold Badge', icon: '🥉', description: 'Monthly Achievement' },
        { id: 4, title: 'Platinum Badge', icon: '🏅', description: 'Quarterly Excellence' }
    ];

    const challenges = [
        { id: 1, title: 'Hydration Hero', description: 'Drink 8 glasses of water daily for a week', progress: '5/7 days' },
        { id: 2, title: 'Step Master', description: 'Reach 10,000 steps daily for 5 days', progress: '3/5 days' },
        { id: 3, title: 'Mindfulness Journey', description: 'Complete 10 minutes of meditation daily', progress: '7/10 days' }
    ];

    const getProgressPercentage = (current, goal) => {
        return Math.min((current / goal) * 100, 100);
    };

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const userDataString = localStorage.getItem('userData');

                if (!token || !userDataString) {
                    setPatientInfo({
                        firstName: 'Patient',
                        lastName: '',
                        dateOfBirth: '',
                        phone: '',
                        email: ''
                    });
                    setLoading(false);
                    return;
                }

                const userData = JSON.parse(userDataString);

                if (!userData._id) {
                    setPatientInfo({
                        firstName: 'Patient',
                        lastName: '',
                        dateOfBirth: '',
                        phone: '',
                        email: ''
                    });
                    setLoading(false);
                    return;
                }

                const patientResponse = await patientAPI.getById(userData._id, token);

                setPatientInfo({
                    firstName: patientResponse.firstName || 'Patient',
                    lastName: patientResponse.lastName || '',
                    dateOfBirth: patientResponse.dateOfBirth || '',
                    phone: patientResponse.phone || '',
                    email: patientResponse.email || ''
                });

                setLoading(false);
            } catch (err) {
                console.error('Error fetching patient data:', err);
                setPatientInfo({
                    firstName: 'Patient',
                    lastName: '',
                    dateOfBirth: '',
                    phone: '',
                    email: ''
                });
                setLoading(false);
            }
        };

        fetchPatientData();
    }, []);

    if (loading) {
        return (
            <div className="gamification-container">
                <div className="loading">Loading patient data...</div>
            </div>
        );
    }

    return (
        <div className="gamification-container">
            <motion.h1
                className="gamification-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Health Gamification Center
            </motion.h1>

            <motion.div
                className="patient-welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <h2>Welcome, {patientInfo.firstName || 'Patient'}!</h2>
                <p>Track your health journey and earn rewards for your progress.</p>
            </motion.div>

            <div className="gamification-dashboard-grid">
                <motion.div
                    className="gamification-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="gamification-card-header">
                        <h2 className="gamification-card-title">Daily Progress</h2>
                    </div>
                    <div className="gamification-card-content">
                        <div className="gamification-progress-container">
                            <p>Steps: {healthStats.steps.current}/{healthStats.steps.goal}</p>
                            <div className="gamification-progress-bar">
                                <div
                                    className="gamification-progress-fill"
                                    style={{ width: `${getProgressPercentage(healthStats.steps.current, healthStats.steps.goal)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="gamification-progress-container">
                            <p>Water Intake: {healthStats.water.current}/{healthStats.water.goal} glasses</p>
                            <div className="gamification-progress-bar">
                                <div
                                    className="gamification-progress-fill"
                                    style={{ width: `${getProgressPercentage(healthStats.water.current, healthStats.water.goal)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="gamification-progress-container">
                            <p>Meditation: {healthStats.meditation.current}/{healthStats.meditation.goal} days</p>
                            <div className="gamification-progress-bar">
                                <div
                                    className="gamification-progress-fill"
                                    style={{ width: `${getProgressPercentage(healthStats.meditation.current, healthStats.meditation.goal)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="gamification-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="gamification-card-header">
                        <h2 className="gamification-card-title">Achievements</h2>
                    </div>
                    <div className="gamification-card-content">
                        <div className="gamification-rewards-grid">
                            {rewards.map((reward) => (
                                <div key={reward.id} className="gamification-reward-card">
                                    <div className="gamification-reward-icon">{reward.icon}</div>
                                    <h3 className="gamification-reward-title">{reward.title}</h3>
                                    <p className="gamification-reward-description">{reward.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div
                className="gamification-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <div className="gamification-card-header">
                    <h2 className="gamification-card-title">Weekly Challenges</h2>
                </div>
                <div className="gamification-card-content">
                    <div className="gamification-challenges-grid">
                        {challenges.map((challenge) => (
                            <div key={challenge.id} className="gamification-challenge-card">
                                <h3 className="gamification-challenge-title">{challenge.title}</h3>
                                <p className="gamification-challenge-description">{challenge.description}</p>
                                <p className="gamification-challenge-progress">Progress: {challenge.progress}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Gamification;