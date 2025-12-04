import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f9fafb',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '600px',
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '16px',
          color: '#111827'
        }}>
          <span style={{ color: '#000' }}>chec</span>
          <span style={{ color: '#10B981' }}>K</span>
          <span style={{ color: '#000' }}>it</span>
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#6B7280',
          marginBottom: '24px'
        }}>
          Food Health Mobile App
        </p>
        <div style={{
          backgroundColor: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#047857',
            margin: 0
          }}>
            The mobile app is running on port 8081
          </p>
        </div>
        <a
          href="http://localhost:8081"
          style={{
            display: 'inline-block',
            backgroundColor: '#10B981',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '16px'
          }}
        >
          Open Mobile App
        </a>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
