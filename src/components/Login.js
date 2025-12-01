import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, patientAPI, providerAPI } from '../services/api';
import './Login.css';

const Login = ({ onLogin }) => {
    const [activeTab, setActiveTab] = useState('patient');
    const [authMode, setAuthMode] = useState('login'); 
    const [patientCredentials, setPatientCredentials] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        password: '',
        confirmPassword: '' 
    });
    const [providerCredentials, setProviderCredentials] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        licenseNumber: '',
        specialty: '',
        yearsOfExperience: '',
        password: '',
        confirmPassword: '', 
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const navigate = useNavigate();

    const validatePatientForm = () => {
        const newErrors = {};
        if (authMode === 'signup') {
            if (!patientCredentials.firstName) {
                newErrors.firstName = 'First name is required';
            }

            if (!patientCredentials.lastName) {
                newErrors.lastName = 'Last name is required';
            }

            if (!patientCredentials.dateOfBirth) {
                newErrors.dateOfBirth = 'Date of birth is required';
            }

            if (!patientCredentials.phone) {
                newErrors.phone = 'Phone number is required';
            } else if (!/^\d{10}$/.test(patientCredentials.phone)) {
                newErrors.phone = 'Phone number must be 10 digits';
            }
        }

        if (!patientCredentials.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(patientCredentials.email)) {
            newErrors.email = 'Email address is invalid';
        }

        if (!patientCredentials.password) {
            newErrors.password = 'Password is required';
        } else if (patientCredentials.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Additional validation for signup
        if (authMode === 'signup') {
            if (!patientCredentials.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (patientCredentials.password !== patientCredentials.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        return newErrors;
    };

    const validateProviderForm = () => {
        const newErrors = {};
        if (authMode === 'signup') {
            if (!providerCredentials.firstName) {
                newErrors.firstName = 'First name is required';
            }

            if (!providerCredentials.lastName) {
                newErrors.lastName = 'Last name is required';
            }

            if (!providerCredentials.licenseNumber) {
                newErrors.licenseNumber = 'License number is required';
            }

            if (!providerCredentials.phone) {
                newErrors.phone = 'Phone number is required';
            } else if (!/^\d{10}$/.test(providerCredentials.phone)) {
                newErrors.phone = 'Phone number must be 10 digits';
            }

            if (!providerCredentials.yearsOfExperience) {
                newErrors.yearsOfExperience = 'Years of experience is required';
            } else if (isNaN(providerCredentials.yearsOfExperience) || providerCredentials.yearsOfExperience < 0) {
                newErrors.yearsOfExperience = 'Years of experience must be a valid number';
            }
        }

        if (!providerCredentials.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(providerCredentials.email)) {
            newErrors.email = 'Email address is invalid';
        }

        if (!providerCredentials.password) {
            newErrors.password = 'Password is required';
        } else if (providerCredentials.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Additional validation for signup
        if (authMode === 'signup') {
            if (!providerCredentials.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (providerCredentials.password !== providerCredentials.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        if (!providerCredentials.specialty) {
            newErrors.specialty = 'Specialty is required';
        }

        return newErrors;
    };

    const handlePatientAuth = async (e) => {
        e.preventDefault();
        const formErrors = validatePatientForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsLoading(true);
        setApiError('');

        try {
            if (authMode === 'signup') {
                const patientData = {
                    firstName: patientCredentials.firstName,
                    lastName: patientCredentials.lastName,
                    email: patientCredentials.email,
                    phone: patientCredentials.phone,
                    dateOfBirth: patientCredentials.dateOfBirth,
                    password: patientCredentials.password
                };

                const response = await patientAPI.register(patientData);
                localStorage.setItem('token', response.token);
                localStorage.setItem('userType', 'patient');
                localStorage.setItem('userData', JSON.stringify(response.patient));
                onLogin('patient');
                navigate('/health-data');
            } else {
                const credentials = {
                    email: patientCredentials.email,
                    password: patientCredentials.password
                };

                const response = await authAPI.patientLogin(credentials);
                localStorage.setItem('token', response.token);
                localStorage.setItem('userType', 'patient');
                localStorage.setItem('userData', JSON.stringify(response.patient));
                onLogin('patient');
                if (!response.patient.healthData ||
                    response.patient.healthData.heartRate === 72 ||
                    response.patient.healthData.bloodPressure.systolic === 120 ||
                    response.patient.healthData.glucose === 95 ||
                    response.patient.healthData.weight === 70) {
                    navigate('/health-data');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (error) {
            setApiError(error.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleProviderAuth = async (e) => {
        e.preventDefault();
        const formErrors = validateProviderForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsLoading(true);
        setApiError('');

        try {
            if (authMode === 'signup') {
                const providerData = {
                    firstName: providerCredentials.firstName,
                    lastName: providerCredentials.lastName,
                    email: providerCredentials.email,
                    phone: providerCredentials.phone,
                    licenseNumber: providerCredentials.licenseNumber,
                    specialty: providerCredentials.specialty,
                    yearsOfExperience: parseInt(providerCredentials.yearsOfExperience),
                    password: providerCredentials.password
                };

                const response = await providerAPI.register(providerData);
                localStorage.setItem('token', response.token);
                localStorage.setItem('userType', 'provider');
                localStorage.setItem('userData', JSON.stringify(response.provider));
                onLogin('provider');
                navigate('/provider');
            } else {
                const credentials = {
                    email: providerCredentials.email,
                    password: providerCredentials.password
                };

                const response = await authAPI.providerLogin(credentials);
                localStorage.setItem('token', response.token);
                localStorage.setItem('userType', 'provider');
                localStorage.setItem('userData', JSON.stringify(response.provider));
                onLogin('provider');
                navigate('/provider');
            }
        } catch (error) {
            setApiError(error.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePatientChange = (e) => {
        const { name, value } = e.target;
        setPatientCredentials(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleProviderChange = (e) => {
        const { name, value } = e.target;
        setProviderCredentials(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Virtual Health Assistant</h2>

                <div className="login-tabs">
                    <div
                        className={`login-tab ${activeTab === 'patient' ? 'active' : ''}`}
                        onClick={() => setActiveTab('patient')}
                    >
                        {authMode === 'login' ? 'Patient Login' : 'Patient Signup'}
                    </div>
                    <div
                        className={`login-tab ${activeTab === 'provider' ? 'active' : ''}`}
                        onClick={() => setActiveTab('provider')}
                    >
                        {authMode === 'login' ? 'Provider Login' : 'Provider Signup'}
                    </div>
                </div>

                <div className="auth-mode-toggle">
                    {authMode === 'login' ? (
                        <p>
                            Don't have an account?{' '}
                            <span
                                className="auth-mode-link"
                                onClick={() => setAuthMode('signup')}
                            >
                                Sign up here
                            </span>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{' '}
                            <span
                                className="auth-mode-link"
                                onClick={() => setAuthMode('login')}
                            >
                                Log in here
                            </span>
                        </p>
                    )}
                </div>

                {apiError && <div className="login-error api-error">{apiError}</div>}

                {activeTab === 'patient' ? (
                    <form className="login-form" onSubmit={handlePatientAuth}>
                        {authMode === 'signup' && (
                            <>
                                <div className="login-form-row">
                                    <div className="login-form-group">
                                        <label className="login-form-label">First Name:</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            className="login-form-input"
                                            value={patientCredentials.firstName}
                                            onChange={handlePatientChange}
                                            placeholder="Enter your first name"
                                        />
                                        {errors.firstName && <div className="login-error">{errors.firstName}</div>}
                                    </div>

                                    <div className="login-form-group">
                                        <label className="login-form-label">Last Name:</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            className="login-form-input"
                                            value={patientCredentials.lastName}
                                            onChange={handlePatientChange}
                                            placeholder="Enter your last name"
                                        />
                                        {errors.lastName && <div className="login-error">{errors.lastName}</div>}
                                    </div>
                                </div>

                                <div className="login-form-group">
                                    <label className="login-form-label">Date of Birth:</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        className="login-form-input"
                                        value={patientCredentials.dateOfBirth}
                                        onChange={handlePatientChange}
                                    />
                                    {errors.dateOfBirth && <div className="login-error">{errors.dateOfBirth}</div>}
                                </div>

                                <div className="login-form-group">
                                    <label className="login-form-label">Phone Number:</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="login-form-input"
                                        value={patientCredentials.phone}
                                        onChange={handlePatientChange}
                                        placeholder="Enter 10-digit phone number"
                                    />
                                    {errors.phone && <div className="login-error">{errors.phone}</div>}
                                </div>
                            </>
                        )}

                        <div className="login-form-group">
                            <label className="login-form-label">Email:</label>
                            <input
                                type="email"
                                name="email"
                                className="login-form-input"
                                value={patientCredentials.email}
                                onChange={handlePatientChange}
                                placeholder="Enter your email"
                            />
                            {errors.email && <div className="login-error">{errors.email}</div>}
                        </div>

                        <div className="login-form-group">
                            <label className="login-form-label">Password:</label>
                            <input
                                type="password"
                                name="password"
                                className="login-form-input"
                                value={patientCredentials.password}
                                onChange={handlePatientChange}
                                placeholder="Enter your password"
                            />
                            {errors.password && <div className="login-error">{errors.password}</div>}
                        </div>

                        {authMode === 'signup' && (
                            <div className="login-form-group">
                                <label className="login-form-label">Confirm Password:</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="login-form-input"
                                    value={patientCredentials.confirmPassword}
                                    onChange={handlePatientChange}
                                    placeholder="Confirm your password"
                                />
                                {errors.confirmPassword && <div className="login-error">{errors.confirmPassword}</div>}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? (authMode === 'login' ? 'Logging in...' : 'Signing up...')
                                : (authMode === 'login' ? 'Login as Patient' : 'Sign Up as Patient')}
                        </button>
                    </form>
                ) : (
                    <form className="login-form" onSubmit={handleProviderAuth}>
                        {authMode === 'signup' && (
                            <>
                                <div className="login-form-row">
                                    <div className="login-form-group">
                                        <label className="login-form-label">First Name:</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            className="login-form-input"
                                            value={providerCredentials.firstName}
                                            onChange={handleProviderChange}
                                            placeholder="Enter your first name"
                                        />
                                        {errors.firstName && <div className="login-error">{errors.firstName}</div>}
                                    </div>

                                    <div className="login-form-group">
                                        <label className="login-form-label">Last Name:</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            className="login-form-input"
                                            value={providerCredentials.lastName}
                                            onChange={handleProviderChange}
                                            placeholder="Enter your last name"
                                        />
                                        {errors.lastName && <div className="login-error">{errors.lastName}</div>}
                                    </div>
                                </div>

                                <div className="login-form-group">
                                    <label className="login-form-label">License Number:</label>
                                    <input
                                        type="text"
                                        name="licenseNumber"
                                        className="login-form-input"
                                        value={providerCredentials.licenseNumber}
                                        onChange={handleProviderChange}
                                        placeholder="Enter your license number"
                                    />
                                    {errors.licenseNumber && <div className="login-error">{errors.licenseNumber}</div>}
                                </div>

                                <div className="login-form-group">
                                    <label className="login-form-label">Phone Number:</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="login-form-input"
                                        value={providerCredentials.phone}
                                        onChange={handleProviderChange}
                                        placeholder="Enter 10-digit phone number"
                                    />
                                    {errors.phone && <div className="login-error">{errors.phone}</div>}
                                </div>

                                <div className="login-form-group">
                                    <label className="login-form-label">Years of Experience:</label>
                                    <input
                                        type="number"
                                        name="yearsOfExperience"
                                        className="login-form-input"
                                        value={providerCredentials.yearsOfExperience}
                                        onChange={handleProviderChange}
                                        placeholder="Enter years of experience"
                                    />
                                    {errors.yearsOfExperience && <div className="login-error">{errors.yearsOfExperience}</div>}
                                </div>
                            </>
                        )}

                        <div className="login-form-group">
                            <label className="login-form-label">Email:</label>
                            <input
                                type="email"
                                name="email"
                                className="login-form-input"
                                value={providerCredentials.email}
                                onChange={handleProviderChange}
                                placeholder="Enter your email"
                            />
                            {errors.email && <div className="login-error">{errors.email}</div>}
                        </div>

                        <div className="login-form-group">
                            <label className="login-form-label">Password:</label>
                            <input
                                type="password"
                                name="password"
                                className="login-form-input"
                                value={providerCredentials.password}
                                onChange={handleProviderChange}
                                placeholder="Enter your password"
                            />
                            {errors.password && <div className="login-error">{errors.password}</div>}
                        </div>

                        {authMode === 'signup' && (
                            <div className="login-form-group">
                                <label className="login-form-label">Confirm Password:</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="login-form-input"
                                    value={providerCredentials.confirmPassword}
                                    onChange={handleProviderChange}
                                    placeholder="Confirm your password"
                                />
                                {errors.confirmPassword && <div className="login-error">{errors.confirmPassword}</div>}
                            </div>
                        )}

                        <div className="login-form-group">
                            <label className="login-form-label">Specialty:</label>
                            <input
                                type="text"
                                name="specialty"
                                className="login-form-input"
                                value={providerCredentials.specialty}
                                onChange={handleProviderChange}
                                placeholder="Enter your specialty"
                            />
                            {errors.specialty && <div className="login-error">{errors.specialty}</div>}
                        </div>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? (authMode === 'login' ? 'Logging in...' : 'Signing up...')
                                : (authMode === 'login' ? 'Login as Provider' : 'Sign Up as Provider')}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;