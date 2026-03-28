// src/pages/BecomeWorkerPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { professionService } from '../services/professionService';
import { userService } from '../services/userService';

// CustomSelect Premium (Sincronizado con ProfilePage)
const CustomSelect = ({ options, value, onChange, disabled, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full rounded-xl px-4 py-3 text-sm transition-all flex justify-between items-center select-none ${
          disabled 
            ? 'bg-neutral-900/30 border border-neutral-800 text-neutral-500 cursor-not-allowed opacity-60' 
            : `bg-neutral-950 border text-neutral-100 cursor-pointer ${isOpen ? 'border-slate-500 ring-1 ring-slate-500/20' : 'border-neutral-800 hover:border-neutral-700'}`
        }`}
      >
        <span className={!selectedOption ? 'text-neutral-500' : 'font-medium'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar backdrop-blur-xl">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-neutral-500 text-center italic">Cargando opciones...</div>
          ) : (
            options.map((opt) => (
              <div 
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${value === opt.value ? 'bg-slate-500/10 text-slate-500 font-bold' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'}`}
              >
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

function BecomeWorkerPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  
  const [professionsList, setProfessionsList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    profession: '',
    contact_phone: '',
    contact_email: '',
    description: ''
  });

  // Animación de entrada
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Cargar profesiones al inicio
  useEffect(() => {
    const fetchProfessions = async () => {
      try {
        const data = await professionService.getProfessions();
        if (data && data.length > 0) {
          setProfessionsList(data.map(p => ({ value: p.name, label: p.name })));
        } else {
          setProfessionsList([{ value: "Otro", label: "Otro" }]);
        }
      } catch (err) {
        setProfessionsList([{ value: "Otro", label: "Otro" }]);
      }
    };
    fetchProfessions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.profession) return setError("Por favor, seleccioná un oficio principal.");
    if (!formData.contact_phone || !/^\+?[\d\s-]{8,20}$/.test(formData.contact_phone)) return setError("Ingresá un número de teléfono válido.");
    if (!formData.contact_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) return setError("Ingresá un email válido.");
    if (!formData.description || formData.description.length < 10) return setError("Escribí una breve descripción de tus servicios (mínimo 10 caracteres).");

    setIsSubmitting(true);
    try {
      await userService.createWorkerProfile(formData);
      navigate('/profile');
    } catch (err) {
      console.error(err);
      setError("Hubo un error al crear tu perfil profesional. Intentá nuevamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col overflow-hidden">
      <Header />

      <main className="flex-grow flex items-center justify-center p-6 py-20 relative">
        
        {/* Luces de fondo ambientales */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Tarjeta Principal Animada */}
        <div 
          className={`w-full max-w-2xl bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-md relative z-10 transform transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${
            isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
          }`}
        >
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-slate-500/10 border border-slate-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-500 shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-neutral-50 mb-3 tracking-tight leading-tight">
              Ofrecé tus <span className="text-slate-500">Servicios</span>
            </h1>
            <p className="text-neutral-400 text-sm md:text-base font-medium max-w-md mx-auto">
              Completá estos datos para que los clientes puedan encontrarte y contactarte en nuestra red.
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Campo: Oficio */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-tighter ml-1">Oficio / Profesión Principal</label>
              <CustomSelect 
                options={professionsList}
                value={formData.profession}
                onChange={(val) => setFormData({ ...formData, profession: val })}
                placeholder="Ej: Electricista, Plomero, Pintor..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campo: Teléfono */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-tighter ml-1">WhatsApp / Teléfono</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <input 
                    type="tel" 
                    name="contact_phone" 
                    placeholder="+54 9 11 1234 5678" 
                    value={formData.contact_phone} 
                    onChange={handleChange} 
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-xl pl-11 pr-4 py-3 text-sm transition-all focus:outline-none focus:border-slate-500 shadow-inner" 
                  />
                </div>
              </div>

              {/* Campo: Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-tighter ml-1">Email Público</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <input 
                    type="email" 
                    name="contact_email" 
                    placeholder="contacto@ejemplo.com" 
                    value={formData.contact_email} 
                    onChange={handleChange} 
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-xl pl-11 pr-4 py-3 text-sm transition-all focus:outline-none focus:border-slate-500 shadow-inner" 
                  />
                </div>
              </div>
            </div>

            {/* Campo: Descripción */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-tighter ml-1 flex justify-between">
                <span>Descripción del Servicio</span>
                <span className="text-neutral-600 font-normal normal-case tracking-normal">Visible en tu perfil</span>
              </label>
              <textarea 
                name="description" 
                placeholder="Describí tu experiencia, zona de cobertura, especialidades, horarios de atención..." 
                value={formData.description} 
                onChange={handleChange} 
                rows="5" 
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-xl px-4 py-3 text-sm resize-none transition-all focus:outline-none focus:border-slate-500 shadow-inner"
              ></textarea>
            </div>

            {/* Botones */}
            <div className="mt-8 flex flex-col-reverse md:flex-row justify-end gap-4 pt-6 border-t border-neutral-800/50">
              <button 
                type="button" 
                onClick={() => navigate('/profile')} 
                disabled={isSubmitting} 
                className="px-6 py-3 text-sm font-bold text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-xl transition-all w-full md:w-auto text-center cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="bg-slate-600 hover:bg-slate-500 text-white text-sm font-bold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg active:scale-95 w-full md:w-auto flex justify-center items-center cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Crear Perfil Profesional'
                )}
              </button>
            </div>
            
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default BecomeWorkerPage;