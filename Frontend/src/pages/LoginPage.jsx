// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Intentando iniciar sesión con:', formData);
    // Acá haremos el POST a /api/v1/auth/login para obtener el Token
  };

  const handleGoogleLogin = () => {
    console.log('Iniciando Google OAuth...');
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4 py-8 w-full">
        <div className="w-full max-w-sm bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 shadow-xl backdrop-blur-sm">
          
          <h2 className="text-2xl font-semibold text-neutral-50 mb-6 text-center tracking-tight">
            Iniciar <span className="text-orange-500">Sesión</span>
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1 pl-1">
                Email
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required 
                placeholder="example@email.com"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-orange-500/80 transition placeholder:text-neutral-700"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1 pl-1 pr-1">
                <label className="block text-xs font-medium text-neutral-500">
                  Contraseña
                </label>
                {/* Un detallito extra: el link de "olvidé mi contraseña" (visual por ahora) */}
                <a href="#" className="text-[10px] text-orange-500 hover:text-orange-400 transition font-medium">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required 
                placeholder="••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-orange-500/80 transition placeholder:text-neutral-700"
              />
            </div>

            <button 
              type="submit" 
              className="mt-2 w-full bg-orange-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-orange-500 transition shadow-sm"
            >
              Ingresar
            </button>
          </form>

          <div className="relative mt-6 mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-neutral-900/50 text-neutral-500 font-medium">O ingresá con</span>
            </div>
          </div>

          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-sm font-medium py-2.5 rounded-lg transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <p className="mt-6 text-center text-neutral-500 text-xs">
            ¿No tenés una cuenta?{' '}
            <Link to="/register" className="text-orange-500 hover:text-orange-400 font-medium transition">
              Registrate
            </Link>
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LoginPage;