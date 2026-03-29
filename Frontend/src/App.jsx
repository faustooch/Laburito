// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'; // <-- El guardia de rutas

// Vistas
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import BecomeWorkerPage from './pages/BecomeWorkerPage';
import SearchPage from './pages/SearchPage';
import WorkerProfilePage from './pages/WorkerProfilePage';
import TermsPage from './pages/TermsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* === RUTAS PÚBLICAS === */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/worker/:id" element={<WorkerProfilePage />} />
        {/* Obligatorio que sea pública por cuestiones legales: */}
        <Route path="/terms" element={<TermsPage />} />


        {/* === RUTAS PRIVADAS === */}
        {/* El ProtectedRoute intercepta todas las rutas hijas. Si no hay sesión, rebota a la Home. */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/become-worker" element={<BecomeWorkerPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>


        {/* === RUTA 404 FALLBACK === */}
        {/* Captura cualquier URL que no exista en el sistema */}
        <Route path="*" element={
          <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-9xl font-black text-neutral-900 select-none">404</h1>
            <h2 className="text-2xl font-bold text-neutral-100 mt-4 mb-2">Página no encontrada</h2>
            <p className="text-neutral-500 mb-8 max-w-md">La ruta que intentás buscar no existe, fue movida o no tenés los permisos necesarios para verla.</p>
            <a href="/" className="bg-slate-500 hover:bg-slate-400 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg active:scale-95">
              Volver al inicio
            </a>
          </div>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;