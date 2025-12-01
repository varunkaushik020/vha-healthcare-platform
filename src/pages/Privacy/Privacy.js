import React from 'react';
import { motion } from 'framer-motion';
import './Privacy.css';

const Privacy = () => {
    return (
        <div className="privacy-container">
            <motion.h1
                className="privacy-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Privacy Policy
            </motion.h1>

            <div className="privacy-dashboard-grid">
                <motion.div
                    className="privacy-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="privacy-card-header">
                        <h2 className="privacy-card-title">Data Protection</h2>
                    </div>
                    <div className="privacy-card-content">
                        <p>We are committed to protecting your personal health information. Our platform implements industry-standard security measures to ensure your data remains private and secure.</p>
                        <ul className="privacy-list text-left mt-1">
                            <li className="mb-05">Encrypted transmission of all health data</li>
                            <li className="mb-05">Secure storage with access controls</li>
                            <li className="mb-05">Regular security audits and assessments</li>
                            <li className="mb-05">Staff training on privacy practices</li>
                        </ul>
                    </div>
                </motion.div>

                <motion.div
                    className="privacy-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="privacy-card-header">
                        <h2 className="privacy-card-title">Your Rights</h2>
                    </div>
                    <div className="privacy-card-content">
                        <p>As a user, you have specific rights regarding your personal health information. We respect and uphold these rights in accordance with healthcare privacy regulations.</p>
                        <ul className="privacy-list text-left mt-1">
                            <li className="mb-05">Explicit consent for data processing</li>
                            <li className="mb-05">Right to access your personal data</li>
                            <li className="mb-05">Right to data portability</li>
                            <li className="mb-05">Right to erasure ("right to be forgotten")</li>
                        </ul>
                    </div>
                </motion.div>
            </div>

            <motion.div
                className="privacy-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <div className="privacy-card-header">
                    <h2 className="privacy-card-title">Compliance & Security</h2>
                </div>
                <div className="privacy-card-content">
                    <div className="privacy-flex-container">
                        <div className="privacy-flex-item">
                            <h3>Regulatory Compliance</h3>
                            <p>Our platform adheres to healthcare privacy regulations including HIPAA and GDPR. We conduct regular compliance audits to ensure ongoing adherence to these standards.</p>

                            <h4 className="mt-15">Access Controls</h4>
                            <p>We implement role-based access controls to ensure that only authorized personnel can access sensitive health information. All access is logged and monitored.</p>
                        </div>

                        <div className="privacy-flex-item">
                            <div className="privacy-placeholder-container text-center my-1">
                                <div className="privacy-placeholder-image"></div>
                                <p className="text-muted">Security Certification</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Privacy;