// src/pages/ProfilePage.jsx
import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { professionService } from '../services/professionService';
import { useNavigate } from 'react-router-dom';

const ARGENTINE_CITIES = [
  "Buenos Aires (CABA)", "Córdoba", "Rosario", "Mendoza", "San Miguel de Tucumán",
  "La Plata", "Mar del Plata", "Salta", "Santa Fe", "San Juan", "Resistencia",
  "Neuquén", "Posadas", "San Salvador de Jujuy", "Bahía Blanca", "Paraná",
  "Santiago del Estero", "San Luis", "Catamarca", "Santa Rosa", "Ushuaia", "Otra"
].map(city => ({ value: city, label: city }));

const CustomSelect = ({ options, value, onChange, disabled, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full rounded-xl px-4 py-2.5 text-sm transition-all flex justify-between items-center select-none ${
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

function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState(''); 
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [professionsList, setProfessionsList] = useState([]); 

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingWorker, setIsEditingWorker] = useState(false);

  const [isSavingPersonal, setIsSavingPersonal] = useState(false);
  const [showCheckPersonal, setShowCheckPersonal] = useState(false);
  const [isSavingWorker, setIsSavingWorker] = useState(false);
  const [showCheckWorker, setShowCheckWorker] = useState(false);

  const [editPersonalData, setEditPersonalData] = useState({ 
    nickname: '', city: '', address: '', date_of_birth: '' 
  });
  const [editWorkerData, setEditWorkerData] = useState({ 
    profession: '', contact_phone: '', contact_email: '', description: '' 
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [userData, professionsData] = await Promise.all([
          userService.getMe(),
          professionService.getProfessions().catch(() => [])
        ]);
        
        setProfileData(userData);
        if (professionsData.length > 0) {
          setProfessionsList(professionsData.map(p => ({ value: p.name, label: p.name })));
        }
        
        setEditPersonalData({ 
          nickname: userData.nickname || '', city: userData.city || '',
          address: userData.address || '', date_of_birth: userData.date_of_birth || ''
        });

        if (userData.worker_profile) {
          setEditWorkerData({
            profession: userData.worker_profile.profession || '',
            contact_phone: userData.worker_profile.contact_phone || '',
            contact_email: userData.worker_profile.contact_email || '',
            description: userData.worker_profile.description || ''
          });
        }
        setIsLoading(false);
      } catch (err) {
        setError('No se pudieron cargar los datos del perfil.');
        setIsLoading(false);
      }
    };
    if (user) fetchAllData();
  }, [user]);

  const handlePersonalChange = (e) => setEditPersonalData({ ...editPersonalData, [e.target.name]: e.target.value });
  const handleWorkerChange = (e) => setEditWorkerData({ ...editWorkerData, [e.target.name]: e.target.value });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const updatedUser = await userService.uploadProfilePicture(formData);
      setProfileData({ ...profileData, profile_picture_url: updatedUser.profile_picture_url });
    } catch (err) {
      alert("Error al procesar la imagen.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const savePersonalData = async () => {
    setIsSavingPersonal(true);
    try {
      const payload = { ...editPersonalData };
      if (!payload.date_of_birth) payload.date_of_birth = null;
      const updatedUser = await userService.updateUser(profileData.id, payload);
      setProfileData({ ...profileData, ...updatedUser });
      setIsSavingPersonal(false);
      setShowCheckPersonal(true);
      setTimeout(() => {
        setIsEditingPersonal(false);
        setShowCheckPersonal(false);
        setValidationError('');
      }, 1500);
    } catch (err) {
      setIsSavingPersonal(false);
      setValidationError("Error al guardar los datos personales.");
    }
  };

  const saveWorkerData = async () => {
    if (editWorkerData.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editWorkerData.contact_email)) {
      setValidationError("El formato del email de contacto no es válido.");
      return;
    }
    setIsSavingWorker(true);
    try {
      const updatedUser = await userService.updateWorkerProfile(editWorkerData);
      setProfileData({ ...profileData, worker_profile: updatedUser.worker_profile });
      setIsSavingWorker(false);
      setShowCheckWorker(true);
      setTimeout(() => {
        setIsEditingWorker(false);
        setShowCheckWorker(false);
        setValidationError('');
      }, 1500);
    } catch (err) {
      setIsSavingWorker(false);
      setValidationError("Error al guardar los datos del perfil laboral.");
    }
  };

  const roleDisplay = { client: 'Cliente', worker: 'Trabajador', admin: 'Admin' };

  if (isLoading) return <div className="min-h-screen bg-neutral-950 flex flex-col"><Header /><main className="flex-grow flex items-center justify-center"><div className="w-12 h-12 border-4 border-slate-500/20 border-t-slate-500 rounded-full animate-spin"></div></main></div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <Header />

      <main className="flex-grow w-full max-w-6xl mx-auto px-6 py-12">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-neutral-50 tracking-tighter">
            Mi <span className="text-slate-500">Perfil</span>
          </h1>
          <p className="text-neutral-500 mt-2 font-medium">Gestioná tu información personal y profesional.</p>
        </header>

        {validationError && (
          <div className="mb-8 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {validationError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Tarjeta de Identidad - FIXED AL SCROLL */}
          <div className="lg:col-span-4 lg:top-28 z-30">
            <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl">
              
              {/* Contenedor de Foto con Blur y Borde Externo */}
              <div className="relative group mb-6 p-1">
                <div className="absolute inset-0 bg-slate-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition duration-700"></div>
                <div className="absolute inset-0 border-2 border-neutral-800 rounded-full group-hover:border-slate-500/50 transition-all duration-500 z-10 pointer-events-none"></div>

                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-transparent">
                  {profileData.profile_picture_url ? (
                    <img 
                      src={profileData.profile_picture_url} 
                      alt="Avatar" 
                      className="w-full h-full object-cover transition-all duration-500 group-hover:blur-[2px] group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-5xl font-black text-slate-500 uppercase transition-all duration-500 group-hover:blur-[2px]">
                      {profileData.nickname.charAt(0)}
                    </div>
                  )}

                  <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-[1px] z-20">
                    {isUploadingImage ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploadingImage} />
                  </label>
                </div>
              </div>
              
              <h2 className="text-2xl font-black text-neutral-50 mb-2 tracking-tight">{profileData.nickname}</h2>
              
              <div className="flex items-center gap-2">
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  profileData.role === 'worker' 
                    ? 'bg-slate-500/10 text-slate-500 border-slate-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]' 
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}>
                  {roleDisplay[profileData.role]}
                </span>
              </div>
            </div>
          </div>

          {/* Secciones de Edición */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Información Personal */}
            <section className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 backdrop-blur-sm shadow-sm transition-all hover:border-neutral-700/50">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center text-slate-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-100">Información Personal</h3>
                </div>
                {!isEditingPersonal && (
                  <button onClick={() => setIsEditingPersonal(true)} className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs font-bold text-neutral-300 transition-all cursor-pointer">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    Editar
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-tighter ml-1">Nickname</label>
                  <input type="text" name="nickname" disabled={!isEditingPersonal} value={isEditingPersonal ? editPersonalData.nickname : profileData.nickname} onChange={handlePersonalChange} className={`w-full rounded-xl px-4 py-2.5 text-sm transition-all focus:outline-none ${isEditingPersonal ? 'bg-neutral-950 border border-neutral-800 focus:border-slate-500 text-white shadow-inner' : 'bg-transparent border border-neutral-800/50 text-neutral-500'}`} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-tighter ml-1">Email</label>
                  <input type="text" disabled value={profileData.email} className="w-full bg-neutral-900/30 border border-neutral-800/50 rounded-xl px-4 py-2.5 text-sm text-neutral-600 cursor-not-allowed" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-tighter ml-1">Ciudad</label>
                  <CustomSelect options={ARGENTINE_CITIES} value={isEditingPersonal ? editPersonalData.city : profileData.city} onChange={(val) => setEditPersonalData({ ...editPersonalData, city: val })} disabled={!isEditingPersonal} placeholder="Ubicación" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-tighter ml-1">Dirección</label>
                  <input type="text" name="address" disabled={!isEditingPersonal} value={isEditingPersonal ? editPersonalData.address : profileData.address || ''} onChange={handlePersonalChange} placeholder="Calle y altura" className={`w-full rounded-xl px-4 py-2.5 text-sm transition-all focus:outline-none ${isEditingPersonal ? 'bg-neutral-950 border border-neutral-800 focus:border-slate-500 text-white shadow-inner' : 'bg-transparent border border-neutral-800/50 text-neutral-500'}`} />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-tighter ml-1">Fecha de Nacimiento</label>
                  <input type="date" name="date_of_birth" disabled={!isEditingPersonal} value={isEditingPersonal ? editPersonalData.date_of_birth : profileData.date_of_birth || ''} onChange={handlePersonalChange} className={`w-full md:w-1/2 rounded-xl px-4 py-2.5 text-sm transition-all focus:outline-none [color-scheme:dark] ${isEditingPersonal ? 'bg-neutral-950 border border-neutral-800 focus:border-slate-500 text-white shadow-inner' : 'bg-transparent border border-neutral-800/50 text-neutral-500'}`} />
                </div>
              </div>

              {isEditingPersonal && (
                <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-neutral-800">
                  <button onClick={() => { setIsEditingPersonal(false); setValidationError(''); }} className="px-5 py-2.5 text-sm font-bold text-neutral-500 hover:text-white transition-colors cursor-pointer">Descartar</button>
                  <button 
                    onClick={savePersonalData} 
                    disabled={isSavingPersonal}
                    className={`min-w-[160px] text-white text-sm font-bold px-8 py-2.5 rounded-xl transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2 ${showCheckPersonal ? 'bg-green-600' : 'bg-slate-600 hover:bg-slate-500 active:scale-95'}`}
                  >
                    {isSavingPersonal ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : showCheckPersonal ? '¡Guardado!' : 'Guardar Cambios'}
                  </button>
                </div>
              )}
            </section>

            {/* Perfil Profesional */}
            {profileData.role === 'worker' && profileData.worker_profile && (
              <section className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 backdrop-blur-sm shadow-sm transition-all hover:border-neutral-700/50">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center text-slate-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      </div>
                      <h3 className="text-xl font-bold text-neutral-100">Perfil Laboral</h3>
                  </div>
                  {!isEditingWorker && (
                    <button onClick={() => setIsEditingWorker(true)} className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs font-bold text-neutral-300 transition-all cursor-pointer">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      Editar Perfil
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-tighter ml-1">Oficio Principal</label>
                    <CustomSelect options={professionsList} value={isEditingWorker ? editWorkerData.profession : profileData.worker_profile.profession} onChange={(val) => setEditWorkerData({ ...editWorkerData, profession: val })} disabled={!isEditingWorker} placeholder="Rubro" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-tighter ml-1">WhatsApp / Tel</label>
                    <input type="tel" name="contact_phone" disabled={!isEditingWorker} value={isEditingWorker ? editWorkerData.contact_phone : profileData.worker_profile.contact_phone || ''} onChange={handleWorkerChange} className={`w-full rounded-xl px-4 py-2.5 text-sm transition-all focus:outline-none ${isEditingWorker ? 'bg-neutral-950 border border-neutral-800 focus:border-slate-500 text-white shadow-inner' : 'bg-transparent border border-neutral-800/50 text-neutral-500'}`} />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-tighter ml-1">Email de Contacto</label>
                    <input type="email" name="contact_email" disabled={!isEditingWorker} value={isEditingWorker ? editWorkerData.contact_email : profileData.worker_profile.contact_email || ''} onChange={handleWorkerChange} className={`w-full rounded-xl px-4 py-2.5 text-sm transition-all focus:outline-none ${isEditingWorker ? 'bg-neutral-950 border border-neutral-800 focus:border-slate-500 text-white shadow-inner' : 'bg-transparent border border-neutral-800/50 text-neutral-500'}`} />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-tighter ml-1">Descripción de servicios</label>
                    <textarea name="description" disabled={!isEditingWorker} value={isEditingWorker ? editWorkerData.description : profileData.worker_profile.description || ''} onChange={handleWorkerChange} rows="4" className={`w-full rounded-xl px-4 py-2.5 text-sm resize-none transition-all focus:outline-none ${isEditingWorker ? 'bg-neutral-950 border border-neutral-800 focus:border-slate-500 text-white shadow-inner' : 'bg-transparent border border-neutral-800/50 text-neutral-500'}`}></textarea>
                  </div>
                </div>

                {isEditingWorker && (
                  <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-neutral-800">
                    <button onClick={() => { setIsEditingWorker(false); setValidationError(''); }} className="px-5 py-2.5 text-sm font-bold text-neutral-500 hover:text-white transition-colors cursor-pointer">Descartar</button>
                    <button 
                      onClick={saveWorkerData} 
                      disabled={isSavingWorker}
                      className={`min-w-[160px] text-white text-sm font-bold px-8 py-2.5 rounded-xl transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2 ${showCheckWorker ? 'bg-green-600' : 'bg-slate-600 hover:bg-slate-500 active:scale-95'}`}
                    >
                      {isSavingWorker ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : showCheckWorker ? '¡Actualizado!' : 'Actualizar Perfil'}
                    </button>
                  </div>
                )}
              </section>
            )}

            {profileData.role === 'client' && (
              <div className="bg-gradient-to-r from-slate-500/10 to-transparent border border-slate-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-slate-500/10 transition-colors duration-700"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-black text-neutral-50 mb-2">¿Querés trabajar en Laburito?</h3>
                  <p className="text-sm text-neutral-400 max-w-md">Convertite en Trabajador, publicá tus servicios y empezá a recibir consultas hoy mismo.</p>
                </div>
                <button onClick={() => navigate('/become-worker')} className="relative z-10 bg-slate-500 hover:bg-slate-600 text-white text-xs font-black uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all shadow-xl active:scale-95 cursor-pointer">
                  Empezar ahora
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ProfilePage;