import React, { useState, useEffect } from 'react';

const ConnectionTest = () => {
    const [connectionStatus, setConnectionStatus] = useState('Testing...');
    const [backendData, setBackendData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/')
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                setConnectionStatus('✅ Connected to backend successfully!');
                setBackendData(data);
            })
            .catch(error => {
                setConnectionStatus('❌ Failed to connect to backend');
                console.error('Connection error:', error);
            });
    }, []);

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
            <h3>Frontend-Backend Connection Test</h3>
            <p><strong>Status:</strong> {connectionStatus}</p>
            {backendData && (
                <div>
                    <p><strong>Backend Response:</strong></p>
                    <pre>{JSON.stringify(backendData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default ConnectionTest;