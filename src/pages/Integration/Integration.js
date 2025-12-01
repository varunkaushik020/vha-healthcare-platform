import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Integration.css';

const Integration = () => {
    const [integrations, setIntegrations] = useState([
        { id: 1, name: 'Hospital Systems', description: 'Connect with electronic health records (EHR) systems', status: 'Active' },
        { id: 2, name: 'Wearable Devices', description: 'Sync data from fitness trackers and health monitors', status: 'Active' },
        { id: 3, name: 'Telemedicine Platforms', description: 'Integrate with video consultation services', status: 'Active' },
        { id: 4, name: 'Lab Results', description: 'Automatically import laboratory test results', status: 'Active' },
        { id: 5, name: 'Pharmacy Systems', description: 'Connect with prescription management systems', status: 'Planned' },
        { id: 6, name: 'Insurance Portals', description: 'Integrate with health insurance providers', status: 'Planned' }
    ]);

    const toggleStatus = (id) => {
        setIntegrations(integrations.map(integration => {
            if (integration.id === id) {
                return {
                    ...integration,
                    status: integration.status === 'Active' ? 'Planned' : 'Active'
                };
            }
            return integration;
        }));
    };

    return (
        <div className="container integration-container">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                System Integration
            </motion.h1>

            <motion.div
                className="card integration-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="card-header integration-card-header">
                    <h2 className="card-title integration-card-title">Seamless Healthcare Ecosystem</h2>
                </div>
                <div className="card-content integration-card-content">
                    <p>
                        Our platform integrates with various healthcare systems to provide a comprehensive view
                        of your health data. This interconnected approach ensures all your healthcare providers
                        have access to the most up-to-date information.
                    </p>
                </div>
            </motion.div>

            <div className="integration-dashboard-grid">
                <motion.div
                    className="card integration-card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="card-header integration-card-header">
                        <h3 className="card-title integration-card-title">Current Integrations</h3>
                    </div>
                    <div className="card-content integration-card-content">
                        {integrations.map(integration => (
                            <div key={integration.id} className="integration-item">
                                <div className="integration-item-content">
                                    <h4>{integration.name}</h4>
                                    <p>{integration.description}</p>
                                </div>
                                <span
                                    className={`integration-status-badge ${integration.status === 'Active' ? 'success' : 'warning'}`}
                                    onClick={() => toggleStatus(integration.id)}
                                >
                                    {integration.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    className="card integration-card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div className="card-header integration-card-header">
                        <h3 className="card-title integration-card-title">Integration Flow</h3>
                    </div>
                    <div className="card-content integration-card-content">
                        <div className="integration-placeholder-image">
                            Integration Flow Diagram
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div
                className="card integration-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <div className="card-header integration-card-header">
                    <h3 className="card-title integration-card-title">How Integration Works</h3>
                </div>
                <div className="card-content integration-card-content">
                    <div className="integration-how-it-works">
                        <div className="integration-how-it-works-item">
                            <div className="integration-how-it-works-number one">1</div>
                            <div>
                                <h4>Connect Devices</h4>
                                <p>Link your wearable devices, health apps, and medical equipment to our platform.</p>
                            </div>
                        </div>

                        <div className="integration-how-it-works-item">
                            <div className="integration-how-it-works-number two">2</div>
                            <div>
                                <h4>Data Synchronization</h4>
                                <p>Your health data is automatically synchronized and securely stored in our system.</p>
                            </div>
                        </div>

                        <div className="integration-how-it-works-item">
                            <div className="integration-how-it-works-number three">3</div>
                            <div>
                                <h4>Healthcare Access</h4>
                                <p>Authorized healthcare providers can access your data for better care decisions.</p>
                            </div>
                        </div>

                        <div className="integration-placeholder-image">
                            Data Flow Animation
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="card integration-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <div className="card-header integration-card-header">
                    <h3 className="card-title integration-card-title">Security in Integration</h3>
                </div>
                <div className="card-content integration-card-content">
                    <div className="integration-security-grid">
                        <div className="integration-feature-card">
                            <div className="integration-feature-icon one"></div>
                            <h3>Encrypted Transfer</h3>
                            <p>All data transferred between systems is encrypted using industry-standard protocols.</p>
                        </div>

                        <div className="integration-feature-card">
                            <div className="integration-feature-icon two"></div>
                            <h3>Access Control</h3>
                            <p>Role-based permissions ensure only authorized personnel can access sensitive data.</p>
                        </div>

                        <div className="integration-feature-card">
                            <div className="integration-feature-icon three"></div>
                            <h3>Audit Trails</h3>
                            <p>Comprehensive logging of all data access and modifications for compliance.</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Integration;