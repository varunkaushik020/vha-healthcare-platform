import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientAPI } from '../services/api';
import './HealthDataPrompt.css';

const HealthDataPrompt = ({ onHealthDataSubmitted, isPeriodicCheck = false }) => {
    const [healthData, setHealthData] = useState({
        heartRate: '',
        bloodPressure: '',
        glucose: '',
        weight: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!healthData.heartRate) {
            newErrors.heartRate = 'Heart rate is required';
        } else if (isNaN(healthData.heartRate) || healthData.heartRate < 30 || healthData.heartRate > 200) {
            newErrors.heartRate = 'Please enter a valid heart rate (30-200 bpm)';
        }

        if (!healthData.bloodPressure) {
            newErrors.bloodPressure = 'Blood pressure is required';
        } else if (!/^\d+\/\d+$/.test(healthData.bloodPressure)) {
            newErrors.bloodPressure = 'Please enter blood pressure in format systolic/diastolic (e.g., 120/80)';
        }

        if (!healthData.glucose) {
            newErrors.glucose = 'Glucose level is required';
        } else if (isNaN(healthData.glucose) || healthData.glucose < 50 || healthData.glucose > 500) {
            newErrors.glucose = 'Please enter a valid glucose level (50-500 mg/dL)';
        }

        if (!healthData.weight) {
            newErrors.weight = 'Weight is required';
        } else if (isNaN(healthData.weight) || healthData.weight < 20 || healthData.weight > 500) {
            newErrors.weight = 'Please enter a valid weight (20-500 kg)';
        }

        return newErrors;
    };

    const validateBloodPressureValues = (systolic, diastolic) => {
        if (systolic < 70 || systolic > 250) {
            return 'Systolic pressure should be between 70 and 250';
        }
        if (diastolic < 40 || diastolic > 150) {
            return 'Diastolic pressure should be between 40 and 150';
        }
        if (systolic <= diastolic) {
            return 'Systolic pressure should be higher than diastolic pressure';
        }
        return null;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHealthData(prev => ({
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsLoading(true);
        setApiError('');

        try {
            const token = localStorage.getItem('token');
            const userDataString = localStorage.getItem('userData');

            if (!token || !userDataString) {
                setApiError('Not authenticated. Please log in again.');
                setIsLoading(false);
                return;
            }

            const userData = JSON.parse(userDataString);

            if (!userData._id) {
                setApiError('Invalid user data. Please log in again.');
                setIsLoading(false);
                return;
            }

            const bpParts = healthData.bloodPressure.split('/');
            if (bpParts.length !== 2) {
                setApiError('Please enter blood pressure in the correct format (systolic/diastolic)');
                setIsLoading(false);
                return;
            }
            const systolic = parseInt(bpParts[0]);
            const diastolic = parseInt(bpParts[1]);

            if (isNaN(systolic) || isNaN(diastolic)) {
                setApiError('Please enter valid numbers for blood pressure');
                setIsLoading(false);
                return;
            }

            const bpValidationError = validateBloodPressureValues(systolic, diastolic);
            if (bpValidationError) {
                setApiError(bpValidationError);
                setIsLoading(false);
                return;
            }

            const updateData = {
                heartRate: parseInt(healthData.heartRate),
                bloodPressure: {
                    systolic: systolic,
                    diastolic: diastolic
                },
                glucose: parseInt(healthData.glucose),
                weight: parseFloat(healthData.weight)
            };

            if (isNaN(updateData.heartRate) || isNaN(updateData.glucose) || isNaN(updateData.weight)) {
                setApiError('Please enter valid numbers for all fields');
                setIsLoading(false);
                return;
            }

            const response = await patientAPI.updateHealthData(userData._id, updateData, token);

            if (response && response.healthData) {
                const updatedUserData = {
                    ...userData,
                    healthData: response.healthData
                };
                localStorage.setItem('userData', JSON.stringify(updatedUserData));

                onHealthDataSubmitted(response.healthData);

                navigate('/dashboard');
            } else {
                setApiError('Failed to update health data: Invalid response format');
            }
        } catch (error) {
            console.error('Health data update error:', error);
            if (error.message && error.message.includes('HTTP 400')) {
                setApiError('Please check your data format and try again');
            } else {
                setApiError(error.message || 'Failed to update health data. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="health-data-prompt-container">
            <div className="health-data-prompt-card">
                <h2 className="health-data-prompt-title">
                    {isPeriodicCheck ? "Time for Your Health Check!" : "Welcome! Please Enter Your Health Information"}
                </h2>
                <p className="health-data-prompt-description">
                    {isPeriodicCheck
                        ? "It's been 7 hours since your last health update. To provide you with personalized health insights, please enter your current health metrics."
                        : "To provide you with personalized health insights, please enter your current health metrics."}
                </p>

                {apiError && <div className="health-data-prompt-error api-error">{apiError}</div>}

                <form className="health-data-prompt-form" onSubmit={handleSubmit}>
                    <div className="health-data-prompt-form-group">
                        <label className="health-data-prompt-form-label">Heart Rate (bpm):</label>
                        <input
                            type="number"
                            name="heartRate"
                            className="health-data-prompt-form-input"
                            value={healthData.heartRate}
                            onChange={handleChange}
                            placeholder="Enter your heart rate (e.g., 72)"
                            min="30"
                            max="200"
                        />
                        {errors.heartRate && <div className="health-data-prompt-error">{errors.heartRate}</div>}
                    </div>

                    <div className="health-data-prompt-form-group">
                        <label className="health-data-prompt-form-label">Blood Pressure (systolic/diastolic):</label>
                        <input
                            type="text"
                            name="bloodPressure"
                            className="health-data-prompt-form-input"
                            value={healthData.bloodPressure}
                            onChange={handleChange}
                            placeholder="Enter blood pressure (e.g., 120/80)"
                        />
                        {errors.bloodPressure && <div className="health-data-prompt-error">{errors.bloodPressure}</div>}
                    </div>

                    <div className="health-data-prompt-form-group">
                        <label className="health-data-prompt-form-label">Glucose Level (mg/dL):</label>
                        <input
                            type="number"
                            name="glucose"
                            className="health-data-prompt-form-input"
                            value={healthData.glucose}
                            onChange={handleChange}
                            placeholder="Enter your glucose level (e.g., 95)"
                            min="50"
                            max="500"
                        />
                        {errors.glucose && <div className="health-data-prompt-error">{errors.glucose}</div>}
                    </div>

                    <div className="health-data-prompt-form-group">
                        <label className="health-data-prompt-form-label">Weight (kg):</label>
                        <input
                            type="number"
                            step="0.1"
                            name="weight"
                            className="health-data-prompt-form-input"
                            value={healthData.weight}
                            onChange={handleChange}
                            placeholder="Enter your weight (e.g., 70.5)"
                            min="20"
                            max="500"
                        />
                        {errors.weight && <div className="health-data-prompt-error">{errors.weight}</div>}
                    </div>

                    <button
                        type="submit"
                        className="health-data-prompt-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save Health Data'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default HealthDataPrompt;