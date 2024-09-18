// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Chat from './components/Chat';
import Onboarding from './components/Onboarding';

function App() {
  const [userName, setUserName] = useState('');

  // Load userName from localStorage on initial load
  useEffect(() => {
    const savedUserName = localStorage.getItem('userName');
    if (savedUserName) {
      setUserName(savedUserName);
    }
  }, []);

  return (
    <div className="App">
      {userName ? <Chat userName={userName} /> : <Onboarding setUserName={setUserName} />}
    </div>
  );
}

export default App;
