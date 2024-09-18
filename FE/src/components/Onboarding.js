// // // src/components/Onboarding.js
// // import React, { useState } from 'react';

// // const Onboarding = ({ setUserName }) => {
// //   const [name, setName] = useState('');

// //   const handleStartChat = () => {
// //     if (name.trim()) {
// //       localStorage.setItem('userName', name);
// //       setUserName(name);
// //     }
// //   };

// //   return (
// //     <div style={{ textAlign: 'center', padding: '50px' }}>
// //       <h1>Selamat Datang di Employment Law Chatbot</h1>
// //       <h2>Teman ngobrolmu buat cari info hukum ketenagakerjaan di Indonesia, cepat dan gampang!</h2>
// //       <p>Dengan siapa saya bicara?</p>
// //       <input
// //         type="text"
// //         value={name}
// //         onChange={(e) => setName(e.target.value)}
// //         placeholder="Nama Kamu"
// //         style={{ padding: '10px', fontSize: '16px', width: '300px' }}
// //       />
// //       <br /><br />
// //       <button onClick={handleStartChat} style={{ padding: '10px 20px', fontSize: '16px' }}>
// //         Mulai Chat
// //       </button>
// //     </div>
// //   );
// // };

// // export default Onboarding;

// import React, { useState } from 'react';

// const Onboarding = ({ setUserName }) => {
//   const [name, setName] = useState('');

//   const handleStartChat = () => {
//     if (name.trim()) {
//       localStorage.setItem('userName', name);
//       setUserName(name);
//     }
//   };

//   return (
//     <div className="text-center p-10 dark:bg-gray-900 dark:text-white">
//       <h1 className="text-2xl font-bold mb-4">Selamat Datang di Employment Law Chatbot</h1>
//       <h2 className="text-xl mb-6">
//         Teman ngobrolmu buat cari info hukum ketenagakerjaan di Indonesia, cepat dan gampang!
//       </h2>
//       <p className="mb-4">Dengan siapa saya bicara?</p>
//       <input
//         type="text"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         placeholder="Nama Kamu"
//         className="p-2 border rounded-lg w-72 text-black"
//       />
//       <br /><br />
//       <button
//         onClick={handleStartChat}
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
//       >
//         Mulai Chat
//       </button>
//     </div>
//   );
// };

// export default Onboarding;

import React, { useState } from 'react';
import './Onboarding.css'; // Import the black theme CSS

const Onboarding = ({ setUserName }) => {
  const [name, setName] = useState('');

  const handleStartChat = () => {
    if (name.trim()) {
      localStorage.setItem('userName', name);
      setUserName(name);
    }
  };

  return (
    <div className="container">
      <h1>Selamat Datang di Employment Law Chatbot</h1>
      <h2>Teman ngobrolmu buat cari info hukum ketenagakerjaan di Indonesia, cepat dan gampang!</h2>
      <p>Dengan siapa saya bicara?</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama Kamu"
      />
      <br />
      <button onClick={handleStartChat}>Mulai Chat</button>
    </div>
  );
};

export default Onboarding;
