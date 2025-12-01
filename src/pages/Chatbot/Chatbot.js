import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { patientAPI } from '../../services/api';
import './Chatbot.css';

const Chatbot = () => {
    const [patientInfo, setPatientInfo] = useState({
        firstName: 'Patient',
        lastName: '',
        dateOfBirth: '',
        phone: '',
        email: ''
    });

    const [messages, setMessages] = useState([
        { id: 1, text: `Hello ${patientInfo.firstName}! I'm your Virtual Health Assistant. How can I help you today?`, sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [appointmentState, setAppointmentState] = useState({
        isScheduling: false,
        timeSlots: [],
        selectedSlot: null
    });
    const [loading, setLoading] = useState(true);
    const chatContainerRef = useRef(null);
    const inputRef = useRef(null);
    const lastMessageRef = useRef(null);
    const botTimeoutRef = useRef(null);
    const nextId = useRef(2);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userData = JSON.parse(localStorage.getItem('userData'));

                if (!token || !userData) {
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

                setMessages([
                    { id: 1, text: `Hello ${patientResponse.firstName || 'Patient'}! I'm your Virtual Health Assistant. How can I help you today?`, sender: 'bot' }
                ]);

                setLoading(false);
            } catch (err) {
                console.error('Failed to load patient data:', err);
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

    const quickReplies = [
        "Medication reminder",
        "Symptom check",
        "Appointment scheduling",
        "Health tips"
    ];

    useEffect(() => {
        if (lastMessageRef.current) {
            try {
                lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } catch (err) {
                lastMessageRef.current.scrollIntoView();
            }
        }
    }, [messages, isTyping]);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            const { scrollHeight, clientHeight } = chatContainerRef.current;
            chatContainerRef.current.scrollTop = scrollHeight - clientHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
                date: slotTime.toDateString(),
                index: i + 1
            });
        }

        return slots;
    };

    const generateBotResponse = async (userMessage) => {
        try {
            if (appointmentState.isScheduling) {
                const lowerCaseMessage = userMessage.toLowerCase();

                if (lowerCaseMessage.includes('ok') || lowerCaseMessage.includes('yes') || lowerCaseMessage.includes('confirm')) {
                    return `Great ${patientInfo.firstName}! Your appointment has been scheduled for ${appointmentState.selectedSlot.time} on ${appointmentState.selectedSlot.date}. Here is your meeting link: https://meetx-1-8vl0.onrender.com/`;
                }

                const timeSlots = appointmentState.timeSlots;
                let selectedSlot = null;

                const numberMatch = userMessage.match(/\b([1-9]|1[0-9]|2[0-4])\b/);
                if (numberMatch) {
                    const slotIndex = parseInt(numberMatch[1]);
                    selectedSlot = timeSlots.find(slot => slot.index === slotIndex);
                }

                if (!selectedSlot) {
                    for (const slot of timeSlots) {
                        if (userMessage.includes(slot.time)) {
                            selectedSlot = slot;
                            break;
                        }
                    }
                }

                if (selectedSlot) {
                    setAppointmentState(prev => ({
                        ...prev,
                        selectedSlot: selectedSlot
                    }));
                    return `You've selected ${selectedSlot.time} on ${selectedSlot.date}. Would you like to confirm this appointment? Please reply with "OK" or "Yes" to confirm.`;
                }

                return "I didn't understand your selection. Please choose a time slot by mentioning the number or time, or reply with 'OK' to confirm your previously selected slot.";
            }

            const API_KEY = 'AIzaSyAH-S0rpi4NcLjCk5XPg5CRvvAjZF_6HGQ';
            const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

            const lowerCaseMessage = userMessage.toLowerCase();
            if (lowerCaseMessage.includes('appointment') || lowerCaseMessage.includes('schedule')) {
                const timeSlots = generateTimeSlots();
                if (timeSlots.length > 0) {
                    setAppointmentState({
                        isScheduling: true,
                        timeSlots: timeSlots,
                        selectedSlot: null
                    });

                    let response = `I can help you schedule an appointment ${patientInfo.firstName}. Here are the available time slots for the next 24 hours:\n\n`;
                    timeSlots.slice(0, 8).forEach((slot, index) => {
                        response += `${index + 1}. ${slot.time} - ${slot.date}\n`;
                    });
                    response += "\nPlease let me know which time slot works best for you by mentioning the number or time.";
                    return response;
                }
            }

            const requestBody = {
                contents: [{
                    parts: [{
                        text: `You are a healthcare assistant. Provide concise, accurate health information in 1-2 short sentences. Keep responses brief and helpful. For medication questions, suggest best medicine options. The patient's name is ${patientInfo.firstName} ${patientInfo.lastName}. User message: ${userMessage}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 100,
                    topK: 40,
                    topP: 0.95
                }
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();

            if (data.candidates && data.candidates.length > 0 &&
                data.candidates[0].content && data.candidates[0].content.parts &&
                data.candidates[0].content.parts.length > 0) {
                return data.candidates[0].content.parts[0].text;
            } else {
                return "I'm having trouble processing your request right now. Please try again.";
            }
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            return "I'm experiencing technical difficulties at the moment. Please try again later.";
        }
    };

    const handleSend = async () => {
        if (inputText.trim() === '') return;

        const userMessage = {
            id: nextId.current++,
            text: inputText,
            sender: 'user'
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        try {
            const botResponseText = await generateBotResponse(inputText);

            const botResponse = {
                id: nextId.current++,
                text: botResponseText,
                sender: 'bot'
            };

            setMessages(prev => [...prev, botResponse]);

            if (botResponseText.includes('meeting link')) {
                setAppointmentState({
                    isScheduling: false,
                    timeSlots: [],
                    selectedSlot: null
                });
            }
        } catch (error) {
            console.error('Error in handleSend:', error);
            const errorMessage = {
                id: nextId.current++,
                text: "I'm experiencing technical difficulties at the moment. Please try again later.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleQuickReply = (reply) => {
        setInputText(reply);
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 10);
    };

    useEffect(() => {
        return () => {
            if (botTimeoutRef.current) {
                clearTimeout(botTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="chatbot-container">
            <motion.h1
                className="chatbot-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                AI Health Assistant
            </motion.h1>

            <div className="chat-container" ref={chatContainerRef}>
                <div className="chat-messages">
                    <AnimatePresence>
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                ref={message.id === messages[messages.length - 1].id ? lastMessageRef : null}
                                className={`message ${message.sender}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {message.text}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div
                            className="message bot typing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="chat-input-container">
                    <div className="quick-replies">
                        {quickReplies.map((reply, index) => (
                            <button
                                key={index}
                                className="quick-reply-btn"
                                onClick={() => handleQuickReply(reply)}
                            >
                                {reply}
                            </button>
                        ))}
                    </div>

                    <div className="input-area">
                        <textarea
                            ref={inputRef}
                            className="chat-input"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={`Hi ${patientInfo.firstName}, type your health question here...`}
                            rows="3"
                        />
                        <button
                            className="send-button"
                            onClick={handleSend}
                            disabled={inputText.trim() === ''}
                        >
                            Send
                        </button>
                    </div>
                    <div className="flex-shrink-zero"></div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;