// src/pages/BecomeWorkerPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { professionService } from '../services/professionService';
// Importá tu userService o authService dependiendo de dónde hayas puesto la función final
import { userService } from '../services/userService';

// Reutilizamos el CustomSelect (Idealmente, en el futuro llevalo a src/components/CustomSelect.jsx)
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
        className={`w-full rounded-lg px-3 py-2.5 text-sm transition flex justify-between items-center select-none ${
          disabled ? 'bg-transparent border border-neutral-800 text-neutral-500 cursor-not-allowed' 
          : `bg-neutral-950 border text-neutral-100 cursor-pointer ${isOpen ? 'border-orange-500 shadow-[0_0_0_1px_rgba(249,115,22,0.5)]' : 'border-neutral-800 hover:border-neutral-700'}`
        }`}
      >
        <span className={!selectedOption ? 'text-neutral-500' : ''}>{selectedOption ? selectedOption.label : placeholder}</span>
        <svg className={`w-4 h-4 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
          {options.length === 0 ? <div className="px-3 py-2 text-sm text-neutral-500 text-center">Cargando...</div> : options.map((opt) => (
            <div key={opt.value} onClick={() => { onChange(opt.value); setIsOpen(false); }} className={`px-3 py-2 text-sm cursor-pointer transition ${value === opt.value ? 'bg-orange-500/10 text-orange-500 font-medium' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'}`}>{opt.label}</div>
          ))}
        </div>
      )}
    </div>
  );
};

function BecomeWorkerPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth(); // Usamos login por si necesitamos recargar el token/estado
  
  const [professionsList, setProfessionsList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    profession: '',
    contact_phone: '',
    contact_email: '',
    description: ''
  });

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
        setProfessionsList([{ value: "Otro", label: "Otro" }]); // Fallback
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
    if (!formData.profession) return setError("Por favor, seleccioná un oficio.");
    if (!formData.contact_phone || !/^\+?[\d\s-]{8,20}$/.test(formData.contact_phone)) return setError("Ingresá un número de teléfono válido.");
    if (!formData.contact_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) return setError("Ingresá un email válido.");
    if (!formData.description || formData.description.length < 10) return setError("Escribí una breve descripción (mínimo 10 caracteres).");

    setIsSubmitting(true);
    try {
      // Asumimos que tenés un endpoint POST para crear el perfil de trabajador
      await userService.createWorkerProfile(formData);
      
      // Opcional: si tu backend requiere actualizar el token para ver el nuevo rol, 
      // podrías llamar a una ruta que devuelva un token nuevo y pasarlo a login().
      
      navigate('/profile'); // Volvemos al perfil
    } catch (err) {
      console.error(err);
      setError("Hubo un error al crear tu perfil profesional. Intentá nuevamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-xl bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 shadow-2xl">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-50 mb-3 tracking-tight">
              Ofrecé tus <span className="text-orange-500">Servicios</span>
            </h1>
            <p className="text-neutral-400 text-sm">
              Completá estos datos para que los clientes puedan encontrarte y contactarte fácilmente.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1.5 pl-1">Oficio / Profesión Principal</label>
              <CustomSelect 
                options={professionsList}
                value={formData.profession}
                onChange={(val) => setFormData({ ...formData, profession: val })}
                placeholder="Ej: Electricista, Plomero..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5 pl-1">Teléfono Público</label>
                <input type="tel" name="contact_phone" placeholder="+54 9 11 1234 5678" value={formData.contact_phone} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-lg px-3 py-2.5 text-sm transition focus:outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5 pl-1">Email Público</label>
                <input type="email" name="contact_email" placeholder="contacto@ejemplo.com" value={formData.contact_email} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-lg px-3 py-2.5 text-sm transition focus:outline-none focus:border-orange-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1.5 pl-1">Sobre tu trabajo (Visible para clientes)</label>
              <textarea name="description" placeholder="Describí tu experiencia, zona de cobertura, horarios de atención..." value={formData.description} onChange={handleChange} rows="4" className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-lg px-3 py-2.5 text-sm resize-none transition focus:outline-none focus:border-orange-500"></textarea>
            </div>

            <div className="mt-6 flex flex-col-reverse md:flex-row justify-end gap-3 pt-4 border-t border-neutral-800/50">
              <button type="button" onClick={() => navigate('/profile')} disabled={isSubmitting} className="px-6 py-2.5 text-sm font-medium text-neutral-400 hover:text-white transition w-full md:w-auto text-center">
                Cancelar
              </button>
              <button type="submit" disabled={isSubmitting} className="bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold px-8 py-2.5 rounded-xl transition shadow-sm w-full md:w-auto flex justify-center items-center">
                {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Crear Perfil Profesional'}
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