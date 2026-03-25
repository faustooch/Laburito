// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import BecomeWorkerPage from './pages/BecomeWorkerPage';
import SearchPage from './pages/SearchPage';
import WorkerProfilePage from './pages/WorkerProfilePage'; // Importamos la nueva página

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* 2. Habilitamos la ruta de registro */}
        <Route path="/register" element={<RegisterPage />} />
        
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/become-worker" element={<BecomeWorkerPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/worker/:id" element={<WorkerProfilePage />} /> {/* Nueva ruta para el perfil del trabajador */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;