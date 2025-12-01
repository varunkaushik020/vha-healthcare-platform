import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer>
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Virtual Health Assistant</h3>
                    <p>Empowering patients with chronic diseases through technology and personalized care.</p>
                </div>
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/chatbot">Chatbot</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Contact Us</h4>
                    <p>Email: support@vha.com</p>
                    <p>Phone: (123) 456-7890</p>
                </div>
            </div>

        </footer>
    );
};

export default Footer;