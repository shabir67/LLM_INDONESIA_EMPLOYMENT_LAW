// // src/components/Chat.js
// import React, { useState, useEffect } from 'react';

// const Chat = ({ userName }) => {
//   const [prompt, setPrompt] = useState('');
//   const [messages, setMessages] = useState([]);

//   // Load chat history from localStorage on initial load
//   useEffect(() => {
//     const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
//     setMessages(savedMessages);
//   }, []);

//   // Save chat history to localStorage whenever messages change
//   useEffect(() => {
//     localStorage.setItem('chatMessages', JSON.stringify(messages));
//   }, [messages]);

//   // Handle sending message
//   const handleSendMessage = async () => {
//     if (prompt.trim() === '') return;

//     const userMessage = { role: 'user', text: prompt, userName };
//     setMessages((prev) => [...prev, userMessage]);

//     try {
//       const response = await fetch('http://129.150.35.80:5000/generate', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ prompt }),
//       });

//       const data = await response.json();
//       const botMessage = { role: 'bot', text: data.generated_text || 'No response from server' };
//       setMessages((prev) => [...prev, botMessage]);

//     } catch (error) {
//       setMessages((prev) => [...prev, { role: 'bot', text: 'Error fetching response' }]);
//     }

//     setPrompt('');
//   };

//   return (
//     <div className="bg-red-500 text-center p-10">
//     <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
//       <h1>Welcome, {userName}</h1>
//       <div style={{ border: '1px solid #ccc', padding: '10px', height: '400px', overflowY: 'scroll' }}>
//         {messages.map((message, index) => (
//           <div key={index} style={{ marginBottom: '10px' }}>
//             <strong>{message.role === 'user' ? `${message.userName}` : 'Bung Rocky'}:</strong> {message.text}
//           </div>
//         ))}
//       </div>
//       <div style={{ marginTop: '20px' }}>
//         <input
//           type="text"
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//           placeholder="Tanya terkait undang-undang cipta kerja!"
//           style={{ width: '80%', padding: '10px', fontSize: '16px' }}
//         />
//         <button onClick={handleSendMessage} style={{ padding: '10px 20px', fontSize: '16px' }}>
//           Kirim
//         </button>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default Chat;


// import React, { useState, useEffect } from 'react';
// import './Chat.css'; // Import the dark theme CSS

// const Chat = ({ userName }) => {
//   const [prompt, setPrompt] = useState('');
//   const [messages, setMessages] = useState([]);

//   // Load chat history from localStorage on initial load
//   useEffect(() => {
//     const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
//     setMessages(savedMessages);
//   }, []);

//   // Save chat history to localStorage whenever messages change
//   useEffect(() => {
//     localStorage.setItem('chatMessages', JSON.stringify(messages));
//   }, [messages]);

//   // Handle sending message
//   const handleSendMessage = async () => {
//     if (prompt.trim() === '') return;

//     const userMessage = { role: 'user', text: prompt, userName };
//     setMessages((prev) => [...prev, userMessage]);

//     try {
//       const response = await fetch('http://129.150.35.80:5000/generate', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ prompt }),
//       });

//       const data = await response.json();
//       const botMessage = { role: 'bot', text: data.generated_text || 'No response from server' };
//       setMessages((prev) => [...prev, botMessage]);

//     } catch (error) {
//       setMessages((prev) => [...prev, { role: 'bot', text: 'Error fetching response' }]);
//     }

//     setPrompt('');
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-box">
//         <h1>Welcome, {userName}</h1>
//         <div className="chat-messages">
//           {messages.map((message, index) => (
//             <div key={index} className="chat-message">
//               <strong>{message.role === 'user' ? `${message.userName}` : 'Bung Rocky'}:</strong> {message.text}
//             </div>
//           ))}
//         </div>
//         <div style={{ marginTop: '20px' }}>
//           <input
//             type="text"
//             value={prompt}
//             onChange={(e) => setPrompt(e.target.value)}
//             placeholder="Tanya terkait undang-undang cipta kerja!"
//           />
//           <button onClick={handleSendMessage}>Kirim</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;

import React, { useState, useEffect } from 'react';
import './Chat.css'; // Import the dark theme CSS

const Chat = ({ userName, setUserName }) => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);

  // Load chat history from localStorage on initial load
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    setMessages(savedMessages);
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (prompt.trim() === '') return;

    const userMessage = { role: 'user', text: prompt, userName };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch('http://129.150.35.80:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      const botMessage = { role: 'bot', text: data.generated_text || 'No response from server' };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Error fetching response' }]);
    }

    setPrompt('');
  };

  // Reset chat history and userName
  const handleReset = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
    setUserName('');
    localStorage.removeItem('userName');
  };

  return (
    <div className="chat-container">
      <button className="reset-button" onClick={handleReset}>
        Reset Chat & Name
      </button>
      <div className="chat-box">
        <h1>Welcome, {userName}</h1>
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className="chat-message">
              <strong>{message.role === 'user' ? `${message.userName}` : 'Bung Rocky'}:</strong> {message.text}
            </div>
          ))}
        </div>
        <div>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Tanya terkait undang-undang cipta kerja!"
          />
          <button onClick={handleSendMessage}>Kirim</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

