import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx'; 
import { GoogleOAuthProvider } from '@react-oauth/google'; // <-- 1. Importamos

// 2. Tu Client ID de Google (Después lo cambias por el tuyo real de Google Cloud)
const GOOGLE_CLIENT_ID = "511189117416-ctbdda5d45v6t3opuh1eu4jh5th0tgt5.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. Envolvemos la app */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)