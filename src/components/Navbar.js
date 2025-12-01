import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isLoggedIn, onLogout, userType }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    return (
        <header>
            <nav className="navbar">
                <div className="nav-container">
                    <div className="nav-logo">
                        <h2>VHA</h2>
                    </div>
                    <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                        <li className="nav-item">
                            <Link to="/" className="nav-link" onClick={toggleMenu}>
                                Home
                            </Link>
                        </li>

                        {isLoggedIn && userType === 'patient' && (
                            <>
                                <li className="nav-item">
                                    <Link to="/dashboard" className="nav-link" onClick={toggleMenu}>
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/chatbot" className="nav-link" onClick={toggleMenu}>
                                        Chatbot
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/education" className="nav-link" onClick={toggleMenu}>
                                        Education
                                    </Link>
                                </li>
                            </>
                        )}

                        {isLoggedIn && userType === 'provider' && (
                            <>
                                <li className="nav-item">
                                    <Link to="/provider" className="nav-link" onClick={toggleMenu}>
                                        Provider
                                    </Link>
                                </li>
                            </>
                        )}

                        <li className="nav-item">
                            <Link to="/privacy" className="nav-link" onClick={toggleMenu}>
                                Privacy
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/integration" className="nav-link" onClick={toggleMenu}>
                                Integration
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/diseases" className="nav-link" onClick={toggleMenu}>
                                Diseases
                            </Link>
                        </li>
                    </ul>

                    <div className="nav-auth">
                        {isLoggedIn ? (
                            <button className="btn btn-secondary" onClick={handleLogout}>
                                Logout
                            </button>
                        ) : (
                            <Link to="/login" className="btn btn-primary">
                                Login
                            </Link>
                        )}
                    </div>

                    <div className="nav-toggle" onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;