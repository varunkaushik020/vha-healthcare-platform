import React, { useState, useEffect } from 'react';

const TestConnection = () => {
    const [connectionStatus, setConnectionStatus] = useState('Testing...');
    const [apiResponse, setApiResponse] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const testConnection = async () => {
            try {
                console.log('Testing connection to backend...');
                const response = await fetch('http://localhost:5000/api');
                console.log('Raw response:', response);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('API response data:', data);
                setApiResponse(data);
                setConnectionStatus('Success!');
            } catch (err) {
                console.error('Connection test failed:', err);
                setError(err.message);
                setConnectionStatus('Failed');
            }
        };

        testConnection();
    }, []);

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
            <h2>Connection Test</h2>
            <p>Status: {connectionStatus}</p>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {apiResponse && (
                <div>
                    <p>Response:</p>
                    <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default TestConnection;