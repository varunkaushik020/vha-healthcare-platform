import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-container">
            <section className="landing-hero">
                <motion.div
                    className="landing-hero-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="landing-hero-title">Your Personal Virtual Health Assistant</h1>
                    <p className="landing-hero-text">Managing chronic diseases with AI-powered insights, real-time monitoring, and personalized care plans.</p>
                    <div className="landing-hero-buttons">
                        <Link to="/dashboard">
                            <button className="btn btn-primary">Get Started</button>
                        </Link>
                        <Link to="/diseases">
                            <button className="btn btn-secondary">Learn More</button>
                        </Link>
                    </div>
                </motion.div>
                <motion.div
                    className="landing-hero-image"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="landing-hero-image-placeholder">
                        Health Assistant Visualization
                    </div>
                </motion.div>
            </section>

            <section className="landing-features">
                <motion.h2
                    className="landing-features-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    Powerful Health Management Features
                </motion.h2>
                <div className="landing-features-grid">
                    <motion.div
                        className="landing-feature-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -10 }}
                    >
                        <div className="landing-feature-icon one">
                            <div className="landing-feature-icon-placeholder"></div>
                        </div>
                        <h3 className="landing-feature-card-title">AI-Powered Insights</h3>
                        <p className="landing-feature-card-text">Get personalized recommendations based on your health data and medical history.</p>
                    </motion.div>

                    <motion.div
                        className="landing-feature-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -10 }}
                    >
                        <div className="landing-feature-icon two">
                            <div className="landing-feature-icon-placeholder"></div>
                        </div>
                        <h3 className="landing-feature-card-title">Real-Time Monitoring</h3>
                        <p className="landing-feature-card-text">Track vital signs, symptoms, and medication adherence in real-time.</p>
                    </motion.div>

                    <motion.div
                        className="landing-feature-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -10 }}
                    >
                        <div className="landing-feature-icon three">
                            <div className="landing-feature-icon-placeholder"></div>
                        </div>
                        <h3 className="landing-feature-card-title">Personalized Care Plans</h3>
                        <p className="landing-feature-card-text">Receive customized treatment plans tailored to your specific condition.</p>
                    </motion.div>

                    <motion.div
                        className="landing-feature-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -10 }}
                    >
                        <div className="landing-feature-icon four">
                            <div className="landing-feature-icon-placeholder"></div>
                        </div>
                        <h3 className="landing-feature-card-title">24/7 Chat Support</h3>
                        <p className="landing-feature-card-text">Access our virtual assistant anytime for health-related questions.</p>
                    </motion.div>
                </div>
            </section>

            <section className="landing-how-it-works">
                <motion.h2
                    className="landing-how-it-works-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    How Our Virtual Health Assistant Works
                </motion.h2>
                <div className="landing-steps">
                    <motion.div
                        className="landing-step"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="landing-step-number one">1</div>
                        <h3 className="landing-step-title">Connect Your Devices</h3>
                        <p className="landing-step-text">Sync your wearable devices and health apps to centralize your data.</p>
                    </motion.div>

                    <motion.div
                        className="landing-step"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <div className="landing-step-number two">2</div>
                        <h3 className="landing-step-title">Get Personalized Insights</h3>
                        <p className="landing-step-text">Our AI analyzes your data to provide actionable health recommendations.</p>
                    </motion.div>

                    <motion.div
                        className="landing-step"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="landing-step-number three">3</div>
                        <h3 className="landing-step-title">Track Progress</h3>
                        <p className="landing-step-text">Monitor improvements and stay motivated with our gamification features.</p>
                    </motion.div>

                    <motion.div
                        className="landing-step"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <div className="landing-step-number four">4</div>
                        <h3 className="landing-step-title">Consult Professionals</h3>
                        <p className="landing-step-text">Share your data with healthcare providers for informed decisions.</p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;