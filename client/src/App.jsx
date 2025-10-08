import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast'; // A better alternative to react-toastify

function App() {
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <AppRoutes />
    </div>
  );
}

export default App;