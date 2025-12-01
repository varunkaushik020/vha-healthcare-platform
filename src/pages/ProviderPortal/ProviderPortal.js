import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { patientAPI } from '../../services/api';
import { determineCondition, determineStatus } from '../../utils/patientHealthAnalyzer';
import './ProviderPortal.css';

const ProviderPortal = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [selectedPatientHealthData, setSelectedPatientHealthData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');

                if (!token) {
                    setError('Not authenticated. Please log in again.');
                    setLoading(false);
                    return;
                }

                const patientsResponse = await patientAPI.getAll(token);

                const transformedPatients = patientsResponse.map((patient) => {
                    const condition = determineCondition(patient.healthData);
                    const status = determineStatus(patient.healthData);

                    return {
                        id: patient._id,
                        name: `${patient.firstName} ${patient.lastName}`,
                        condition: condition,
                        lastVisit: patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : 'Unknown',
                        status: status,
                        appointments: []
                    };
                });

                setPatients(transformedPatients);

                if (transformedPatients.length > 0) {
                    setSelectedPatientId(transformedPatients[0].id);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching patients:', err);
                setError('Failed to load patient data');
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const selectedPatient = patients.find(patient => patient.id === selectedPatientId) || null;

    useEffect(() => {
        const fetchPatientHealthData = async () => {
            if (!selectedPatientId || !localStorage.getItem('token')) return;

            try {
                const token = localStorage.getItem('token');
                const healthResponse = await patientAPI.getHealthData(selectedPatientId, token);

                console.log('Health data response:', healthResponse);

                if (healthResponse && healthResponse.healthData) {
                    setSelectedPatientHealthData(healthResponse.healthData);

                    setPatients(prevPatients =>
                        prevPatients.map(patient => {
                            if (patient.id === selectedPatientId) {
                                const newCondition = determineCondition(healthResponse.healthData);
                                const newStatus = determineStatus(healthResponse.healthData);

                                return {
                                    ...patient,
                                    condition: newCondition,
                                    status: newStatus
                                };
                            }
                            return patient;
                        })
                    );
                }
            } catch (err) {
                console.error('Error fetching patient health data:', err);
            }
        };

        fetchPatientHealthData();
    }, [selectedPatientId]);

    const generateTimeSlots = () => {
        const slots = [];
        const now = new Date();
        const startTime = new Date();
        startTime.setHours(8, 0, 0, 0);

        if (now.getHours() >= 20) {
            startTime.setDate(startTime.getDate() + 1);
            startTime.setHours(8, 0, 0, 0);
        }

        for (let i = 0; i < 24; i++) {
            const slotTime = new Date(startTime);
            slotTime.setMinutes(startTime.getMinutes() + i * 30);

            if (slotTime.toDateString() === now.toDateString() && slotTime < now) {
                continue;
            }

            const hours = slotTime.getHours();
            const minutes = slotTime.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            const formattedTime = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;

            slots.push({
                time: formattedTime,
                value: slotTime.toISOString(),
                date: slotTime.toDateString()
            });
        }

        return slots;
    };

    const timeSlots = generateTimeSlots();

    const filteredPatients = patients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || patient.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusClass = (status) => {
        switch (status) {
            case 'Stable': return 'status-stable';
            case 'Improving': return 'status-improving';
            case 'Critical': return 'status-critical';
            default: return '';
        }
    };

    const handleScheduleAppointment = (patientId) => {
        setSelectedPatientId(patientId);
        setShowAppointmentModal(true);
        setSelectedTimeSlot('');
    };

    const confirmAppointment = () => {
        if (selectedTimeSlot && selectedPatientId) {
            const patient = patients.find(p => p.id === selectedPatientId);
            if (!patient) return;

            const newAppointment = {
                id: Date.now(),
                date: appointmentDate,
                time: selectedTimeSlot,
                patientId: selectedPatientId,
                patientName: patient.name
            };

            setPatients(prevPatients =>
                prevPatients.map(patient => {
                    if (patient.id === selectedPatientId) {
                        return {
                            ...patient,
                            appointments: [...patient.appointments, newAppointment]
                        };
                    }
                    return patient;
                })
            );

            alert(`Appointment scheduled for ${patient.name} on ${appointmentDate} at ${selectedTimeSlot}`);
            setShowAppointmentModal(false);
        }
    };

    if (loading) {
        return (
            <div className="provider-container">
                <div className="loading">Loading patient data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="provider-container">
                <div className="error">Error: {error}</div>
            </div>
        );
    }

    let heartRateData = [];
    let glucoseData = [];
    let bloodPressureData = [];

    if (selectedPatientHealthData) {
        const healthData = selectedPatientHealthData;

        console.log('Processing health data for charts:', healthData);

        if (healthData.heartRate !== undefined && healthData.heartRate !== null) {
            heartRateData = [
                { date: 'Previous', heartRate: Math.max(60, healthData.heartRate - 5) },
                { date: 'Current', heartRate: healthData.heartRate }
            ];
        }

        if (healthData.glucose !== undefined && healthData.glucose !== null) {
            glucoseData = [
                { date: 'Previous', glucose: Math.max(70, healthData.glucose - 5) },
                { date: 'Current', glucose: healthData.glucose }
            ];
        }

        if ((healthData.bloodPressure?.systolic !== undefined && healthData.bloodPressure?.systolic !== null) ||
            (healthData.bloodPressure?.diastolic !== undefined && healthData.bloodPressure?.diastolic !== null)) {
            bloodPressureData = [
                {
                    date: 'Previous',
                    systolic: Math.max(90, (healthData.bloodPressure?.systolic || 120) - 5),
                    diastolic: Math.max(60, (healthData.bloodPressure?.diastolic || 80) - 5)
                },
                {
                    date: 'Current',
                    systolic: healthData.bloodPressure?.systolic || 0,
                    diastolic: healthData.bloodPressure?.diastolic || 0
                }
            ];
        }

        console.log('Chart data prepared:', { heartRateData, glucoseData, bloodPressureData });
    }

    return (
        <div className="provider-container">
            <motion.h1
                className="provider-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Healthcare Provider Portal
            </motion.h1>

            <div className="provider-dashboard-grid">
                <motion.div
                    className="provider-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="provider-card-header">
                        <h2 className="provider-card-title">Patient Management</h2>
                    </div>
                    <div className="provider-card-content">
                        <div className="search-filter-container">
                            <input
                                type="text"
                                placeholder="Search patients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="filter-select"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Stable">Stable</option>
                                <option value="Improving">Improving</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>

                        <div className="patients-list">
                            {filteredPatients.map((patient) => (
                                <div
                                    key={patient.id}
                                    className={`patient-item ${selectedPatientId === patient.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedPatientId(patient.id)}
                                >
                                    <div className="patient-info">
                                        <h3>{patient.name}</h3>
                                        <p>{patient.condition}</p>
                                    </div>
                                    <div className="patient-meta">
                                        <span className="last-visit">Last visit: {patient.lastVisit}</span>
                                        <span className={`status-badge ${getStatusClass(patient.status)}`}>
                                            {patient.status}
                                        </span>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleScheduleAppointment(patient.id);
                                            }}
                                            style={{ marginTop: '5px' }}
                                        >
                                            Schedule
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {selectedPatient && (
                    <motion.div
                        className="provider-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="provider-card-header">
                            <h2 className="provider-card-title">Patient Overview: {selectedPatient.name}</h2>
                        </div>
                        <div className="provider-card-content">
                            <div className="patient-details">
                                <div className="detail-item">
                                    <h4>Condition</h4>
                                    <p>{selectedPatient.condition}</p>
                                </div>
                                <div className="detail-item">
                                    <h4>Last Visit</h4>
                                    <p>{selectedPatient.lastVisit}</p>
                                </div>
                                <div className="detail-item">
                                    <h4>Status</h4>
                                    <span className={`status-badge large ${getStatusClass(selectedPatient.status)}`}>
                                        {selectedPatient.status}
                                    </span>
                                </div>
                            </div>

                            <div className="health-charts">
                                <h3>Health Metrics</h3>
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={heartRateData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="heartRate" stroke="#8884d8" activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={glucoseData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="glucose" fill="#82ca9d" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={bloodPressureData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="systolic" stroke="#ff6b6b" name="Systolic" />
                                            <Line type="monotone" dataKey="diastolic" stroke="#4ecdc4" name="Diastolic" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {selectedPatient.appointments && selectedPatient.appointments.length > 0 && (
                                <div className="appointments-section">
                                    <h3>Upcoming Appointments</h3>
                                    <div className="appointments-list">
                                        {selectedPatient.appointments.map((appointment) => (
                                            <div key={appointment.id} className="appointment-item">
                                                <span>{appointment.date} at {appointment.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>

            {showAppointmentModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Schedule Appointment</h2>
                        <p>Patient: {selectedPatient?.name}</p>

                        <div className="form-group">
                            <label>Date:</label>
                            <input
                                type="date"
                                value={appointmentDate}
                                onChange={(e) => setAppointmentDate(e.target.value)}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Time:</label>
                            <select
                                value={selectedTimeSlot}
                                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                                className="form-select"
                            >
                                <option value="">Select a time slot</option>
                                {timeSlots.map((slot, index) => (
                                    <option key={index} value={slot.time}>
                                        {slot.time} - {slot.date}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowAppointmentModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={confirmAppointment}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProviderPortal;