import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { patientAPI } from '../../services/api';
import './Education.css';

const Education = () => {
    const [patientInfo, setPatientInfo] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        phone: '',
        email: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const topics = [
        {
            id: 1,
            title: 'Diabetes Management',
            content: 'Learn how to monitor blood sugar levels, administer insulin, and maintain a balanced diet.',
            resources: [
                { label: 'Articles', value: '24' },
                { label: 'Videos', value: '12' },
                { label: 'Quizzes', value: '8' }
            ]
        },
        {
            id: 2,
            title: 'Heart Health',
            content: 'Understand cardiovascular exercises, medication adherence, and lifestyle modifications.',
            resources: [
                { label: 'Articles', value: '18' },
                { label: 'Videos', value: '9' },
                { label: 'Quizzes', value: '6' }
            ]
        },
        {
            id: 3,
            title: 'Respiratory Care',
            content: 'Master breathing techniques, inhaler usage, and environmental triggers to avoid.',
            resources: [
                { label: 'Articles', value: '15' },
                { label: 'Videos', value: '7' },
                { label: 'Quizzes', value: '5' }
            ]
        }
    ];

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
            <div className="education-container">
                <div className="loading">Loading patient data...</div>
            </div>
        );
    }

    return (
        <div className="education-container">
            <motion.h1
                className="education-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Patient Education Center
            </motion.h1>

            <motion.div
                className="patient-welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <h2>Welcome, {patientInfo.firstName || 'Patient'}!</h2>
                <p>Explore our educational resources tailored to your health needs.</p>
            </motion.div>

            <div className="education-grid">
                {topics.map((topic) => (
                    <motion.div
                        key={topic.id}
                        className="education-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: topic.id * 0.1 }}
                    >
                        <div className="education-card-header">
                            <h2 className="education-card-title">{topic.title}</h2>
                        </div>
                        <div className="education-card-content">
                            <p>{topic.content}</p>
                            <ul>
                                <li>Personalized learning paths</li>
                                <li>Interactive modules</li>
                                <li>Progress tracking</li>
                                <li>Certification upon completion</li>
                            </ul>
                            <div className="education-dashboard-grid">
                                {topic.resources.map((resource, index) => (
                                    <div key={index} className="education-resource">
                                        <div className="education-resource-value">{resource.value}</div>
                                        <div className="education-resource-label">{resource.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Education;