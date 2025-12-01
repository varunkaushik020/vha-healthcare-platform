import React from 'react';
import { motion } from 'framer-motion';
import './Diseases.css';

const Diseases = () => {
    const diseases = [
        {
            id: 1,
            name: 'Diabetes',
            description: 'A group of metabolic disorders characterized by high blood sugar levels over a prolonged period.',
            stats: [
                { label: 'Global Cases', value: '537M' },
                { label: 'Deaths', value: '6.7M' },
                { label: 'Prevalence', value: '10.5%' }
            ]
        },
        {
            id: 2,
            name: 'Hypertension',
            description: 'A long-term medical condition in which the blood pressure in the arteries is persistently elevated.',
            stats: [
                { label: 'Global Cases', value: '1.28B' },
                { label: 'Deaths', value: '10.4M' },
                { label: 'Prevalence', value: '22.2%' }
            ]
        },
        {
            id: 3,
            name: 'Heart Disease',
            description: 'A range of conditions that affect your heart, including coronary artery disease and arrhythmias.',
            stats: [
                { label: 'Global Cases', value: '625M' },
                { label: 'Deaths', value: '17.9M' },
                { label: 'Prevalence', value: '8.3%' }
            ]
        }
    ];

    return (
        <div className="diseases-container">
            <motion.h1
                className="diseases-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Chronic Diseases Overview
            </motion.h1>

            <div className="diseases-grid">
                {diseases.map((disease) => (
                    <motion.div
                        key={disease.id}
                        className="disease-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: disease.id * 0.1 }}
                    >
                        <div className="disease-card-header">
                            <h2 className="disease-card-title">{disease.name}</h2>
                        </div>
                        <div className="disease-card-content">
                            <p>{disease.description}</p>
                            <div className="disease-dashboard-grid">
                                {disease.stats.map((stat, index) => (
                                    <div key={index} className="disease-stat">
                                        <div className="disease-stat-value">{stat.value}</div>
                                        <div className="disease-stat-label">{stat.label}</div>
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

export default Diseases;