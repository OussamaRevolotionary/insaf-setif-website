import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  return (
    <div style={{ padding: '2rem', fontSize: '2rem', color: '#101828' }}>
      <h1>Insaf Test</h1>
      <p>If you see this, React is working.</p>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
