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
        className={`w-full rounded-lg px-3 py-2 text-sm transition flex justify-between items-center select-none ${
          disabled 
            ? 'bg-transparent border border-neutral-800 text-neutral-500 cursor-not-allowed' 
            : `bg-neutral-950 border text-neutral-100 cursor-pointer ${isOpen ? 'border-orange-500 shadow-[0_0_0_1px_rgba(249,115,22,0.5)]' : 'border-neutral-800 hover:border-neutral-700'}`
        }`}
      >
        <span className={!selectedOption ? 'text-neutral-500' : ''}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg className={`w-4 h-4 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-neutral-500 text-center">Cargando...</div>
          ) : (
            options.map((opt) => (
              <div 
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`px-3 py-2 text-sm cursor-pointer transition ${value === opt.value ? 'bg-orange-500/10 text-orange-500 font-medium' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'}`}
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

  // Estados para FEEDBACK de los botones
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
      alert("Hubo un error al subir tu foto.");
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
      
      // Mostrar el CHECK verde
      setIsSavingPersonal(false);
      setShowCheckPersonal(true);
      
      // Esperar un momento y cerrar el modo edición
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
    if (editWorkerData.contact_phone && !/^\+?[\d\s-]{8,20}$/.test(editWorkerData.contact_phone)) {
      setValidationError("El número de teléfono no es válido.");
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
      setValidationError("Error al guardar los datos de trabajador.");
    }
  };

  const roleDisplay = { client: 'Cliente', worker: 'Trabajador', admin: 'Administrador' };

  if (isLoading) return <div className="min-h-screen bg-neutral-950 flex flex-col"><Header /><main className="flex-grow flex items-center justify-center"><div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div></main></div>;
  if (error || !profileData) return <div className="min-h-screen bg-neutral-950 text-white flex justify-center items-center">{error}</div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <Header />

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-neutral-50 mb-8 tracking-tight">
          Mi <span className="text-orange-500">Perfil</span>
        </h1>

        {validationError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {validationError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
              <div className="relative group mb-4">
                {profileData.profile_picture_url ? (
                  <img src={profileData.profile_picture_url} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2 border-orange-500/30" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-orange-600/20 border-2 border-orange-500/30 flex items-center justify-center text-4xl font-bold text-orange-500 uppercase">{profileData.nickname.charAt(0)}</div>
                )}
                <label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                  {isUploadingImage ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><svg className="w-6 h-6 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg><span className="text-[10px] font-semibold text-white uppercase tracking-wider">Cambiar</span></>}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploadingImage} />
                </label>
              </div>
              <h2 className="text-xl font-semibold text-neutral-100 mb-1">{profileData.nickname}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold mb-6 shadow-sm border ${profileData.role === 'worker' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-neutral-800 text-neutral-400 border-neutral-700'}`}>{roleDisplay[profileData.role]}</span>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-5">
                <h3 className="text-lg font-semibold text-neutral-100">Información Personal</h3>
                {!isEditingPersonal && (
                  <button onClick={() => setIsEditingPersonal(true)} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-md text-neutral-400 hover:text-orange-500 transition cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1 pl-1">Nombre de Usuario</label>
                  <input type="text" name="nickname" disabled={!isEditingPersonal} value={isEditingPersonal ? editPersonalData.nickname : profileData.nickname} onChange={handlePersonalChange} className={`w-full rounded-lg px-3 py-2 text-sm transition focus:outline-none ${isEditingPersonal ? 'bg-neutral-950 border border-neutral-800 focus:border-orange-500 text-neutral-100' : 'bg-transparent border border-neutral-800 text-neutral-500'}`} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1 pl-1">Email Registrado</label>
                  <input type="text" disabled value={profileData.email} className="w-full bg-transparent border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1 pl-1">Ciudad</label>
                  <CustomSelect options={ARGENTINE_CITIES} value={isEditingPersonal ? editPersonalData.city : profileData.city} onChange={(val) => setEditPersonalData({ ...editPersonalData, city: val })} disabled={!isEditingPersonal} placeholder="Seleccioná una ciudad" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1 pl-1">Dirección</label>
                  <input type="text" name="address" placeholder="Ej: Av. Colón 1234" disabled={!isEditingPersonal} value={isEditingPersonal ? editPersonalData.address : profileData.address || ''} onChange={handlePersonalChange} className={`w-full rounded-lg px-3 py-2 text-sm transition focus:outline-none ${isEditingPersonal ? 'bg-neutral-950 border border-neutral-800 focus:border-orange-500 text-neutral-100' : 'bg-transparent border border-neutral-800 text-neutral-500'}`} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-neutral-500 mb-1 pl-1">Fecha de Nacimiento</label>
                  <input type="date" name="date_of_birth" disabled={!isEditingPersonal} value={isEditingPersonal ? editPersonalData.date_of_birth : profileData.date_of_birth || ''} onChange={handlePersonalChange} className={`w-full md:w-1/2 rounded-lg px-3 py-2 text-sm transition focus:outline-none [color-scheme:dark] ${isEditingPersonal ? 'bg-neutral-950 border border-neutral-800 focus:border-orange-500 text-neutral-100' : 'bg-transparent border border-neutral-800 text-neutral-500 [&::-webkit-calendar-picker-indicator]:opacity-50'}`} />
                </div>
              </div>

              {isEditingPersonal && (
                <div className="mt-5 flex justify-end gap-3 pt-3 border-t border-neutral-800/50">
                  <button onClick={() => { setIsEditingPersonal(false); setValidationError(''); setEditPersonalData({ nickname: profileData.nickname || '', city: profileData.city || '', address: profileData.address || '', date_of_birth: profileData.date_of_birth || '' }); }} className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition cursor-pointer">Cancelar</button>
                  <button 
                    onClick={savePersonalData} 
                    disabled={isSavingPersonal}
                    className={`min-w-[140px] text-white text-sm font-semibold px-6 py-2 rounded-lg transition shadow-sm cursor-pointer flex items-center justify-center gap-2 ${showCheckPersonal ? 'bg-green-600' : 'bg-orange-600 hover:bg-orange-500'}`}
                  >
                    {isSavingPersonal ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : showCheckPersonal ? (
                      <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Guardado</>
                    ) : 'Guardar Cambios'}
                  </button>
                </div>
              )}
            </div>

            {profileData.role === 'worker' && profileData.worker_profile && (
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-5">
                  <h3 className="text-lg font-semibold text-neutral-100">Perfil de Trabajador</h3>
                  {!isEditingWorker && (
                    <button onClick={() => setIsEditingWorker(true)} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-md text-neutral-400 hover:text-orange-500 transition cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1 pl-1">Oficio / Profesión</label>
                    <CustomSelect options={professionsList} value={isEditingWorker ? editWorkerData.profession : profileData.worker_profile.profession} onChange={(val) => setEditWorkerData({ ...editWorkerData, profession: val })} disabled={!isEditingWorker} placeholder="Seleccioná un rubro" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1 pl-1">Teléfono de Contacto</label>
                    <input type="tel" placeholder="Ej: +54 9 11 1234-5678" name="contact_phone" disabled={!isEditingWorker} value={isEditingWorker ? editWorkerData.contact_phone : profileData.worker_profile.contact_phone || ''} onChange={handleWorkerChange} className={`w-full rounded-lg px-3 py-2 text-sm transition focus:outline-none ${isEditingWorker ? 'bg-neutral-950 border border-neutral-800 focus:border-orange-500 text-neutral-100' : 'bg-transparent border border-neutral-800 text-neutral-500'}`} />
                  </div>
                </div>
                
                <div className="mb-5">
                  <label className="block text-xs font-medium text-neutral-500 mb-1 pl-1">Email Público de Contacto</label>
                  <input type="email" placeholder="email@ejemplo.com" name="contact_email" disabled={!isEditingWorker} value={isEditingWorker ? editWorkerData.contact_email : profileData.worker_profile.contact_email || ''} onChange={handleWorkerChange} className={`w-full rounded-lg px-3 py-2 text-sm transition focus:outline-none ${isEditingWorker ? 'bg-neutral-950 border border-neutral-800 focus:border-orange-500 text-neutral-100' : 'bg-transparent border border-neutral-800 text-neutral-500'}`} />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1 pl-1">Descripción del Servicio</label>
                  <textarea name="description" placeholder="Contale a tus clientes qué servicios ofrecés..." disabled={!isEditingWorker} value={isEditingWorker ? editWorkerData.description : profileData.worker_profile.description || ''} onChange={handleWorkerChange} rows="3" className={`w-full rounded-lg px-3 py-2 text-sm resize-none transition focus:outline-none ${isEditingWorker ? 'bg-neutral-950 border border-neutral-800 focus:border-orange-500 text-neutral-100' : 'bg-transparent border border-neutral-800 text-neutral-500'}`}></textarea>
                </div>

                {isEditingWorker && (
                  <div className="mt-5 flex justify-end gap-3 pt-3 border-t border-neutral-800/50">
                    <button onClick={() => { setIsEditingWorker(false); setValidationError(''); setEditWorkerData({ profession: profileData.worker_profile.profession || '', contact_phone: profileData.worker_profile.contact_phone || '', contact_email: profileData.worker_profile.contact_email || '', description: profileData.worker_profile.description || '' }); }} className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition cursor-pointer">Cancelar</button>
                    <button 
                      onClick={saveWorkerData} 
                      disabled={isSavingWorker}
                      className={`min-w-[140px] text-white text-sm font-semibold px-6 py-2 rounded-lg transition shadow-sm cursor-pointer flex items-center justify-center gap-2 ${showCheckWorker ? 'bg-green-600' : 'bg-orange-600 hover:bg-orange-500'}`}
                    >
                      {isSavingWorker ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : showCheckWorker ? (
                        <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Guardado</>
                      ) : 'Guardar Cambios'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {profileData.role === 'client' && (
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 text-center shadow-sm">
                <h3 className="text-lg font-semibold text-neutral-100 mb-2">¿Sos profesional?</h3>
                <p className="text-sm text-neutral-400 mb-5">Anunciá tus servicios en Laburito y conseguí más clientes en tu zona.</p>
                <button onClick={() => navigate('/become-worker')} className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 py-2.5 rounded-lg cursor-pointer transition shadow-sm w-full md:w-auto">Quiero ofrecer mis servicios</button>
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