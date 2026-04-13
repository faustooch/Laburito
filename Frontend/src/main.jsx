import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App.jsx';
import './index.css';
import { AuthProvider } from './domains/auth/context/AuthContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';


const GOOGLE_CLIENT_ID = import.meta.env.GOOGLE_CLIENT_ID;

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