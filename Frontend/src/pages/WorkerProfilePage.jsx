// src/pages/WorkerProfilePage.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../services/userService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

function WorkerProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const fetchWorker = useCallback(async () => {
    try {
      const data = await userService.getWorkerById(id);
      setWorker(data);
    } catch (err) {
      console.error("Error al cargar el perfil:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWorker();
  }, [fetchWorker]);

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    fetchWorker(); 
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-500/20 border-t-slate-500 rounded-full animate-spin"></div>
      </main>
    </div>
  );

  if (!worker) return (
    <div className="min-h-screen bg-neutral-950 text-neutral-500 flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center font-medium">
        Perfil no encontrado o no disponible.
      </main>
      <Footer />
    </div>
  );

  const contactEmail = worker.worker_profile?.contact_email || worker.email;
  const contactPhone = worker.worker_profile?.contact_phone;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <Header />

      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-12">
        
        {/* CABECERA: Identity Card Horizontal */}
        <section className="bg-gradient-to-b md:bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-8 lg:p-12 mb-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-10">
          
          {/* Efecto de luz de fondo sutil */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-500/5 blur-3xl rounded-full pointer-events-none"></div>

          {/* Avatar con la misma física que en ProfilePage */}
          <div className="relative group p-1 shrink-0">
            <div className="absolute inset-0 bg-slate-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition duration-700"></div>
            <div className="absolute inset-0 border-2 border-neutral-800 rounded-full group-hover:border-slate-500/50 transition-all duration-500 z-10 pointer-events-none"></div>
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-transparent">
              {worker.profile_picture_url ? (
                <img 
                  src={worker.profile_picture_url} 
                  className="w-full h-full object-cover transition-all duration-500 group-hover:blur-[1px] group-hover:scale-110" 
                  alt={worker.nickname} 
                />
              ) : (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-5xl md:text-6xl font-black text-slate-500 uppercase transition-all duration-500 group-hover:blur-[1px]">
                  {worker.nickname.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Info Principal y Grid de Contacto */}
          <div className="flex-grow text-center md:text-left w-full z-10">
            <h1 className="text-4xl md:text-5xl font-black text-neutral-50 mb-4 tracking-tight">{worker.nickname}</h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-8">
              <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-slate-500/10 text-slate-500 border-slate-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                {worker.worker_profile?.profession || 'Profesional'}
              </span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-neutral-200 bg-neutral-900/80 px-3 py-1.5 rounded-full border border-neutral-800 shadow-inner">
                <svg className="w-4 h-4 text-slate-500 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                </svg>
                {worker.rating?.toFixed(1) || '0.0'}
                <span className="text-neutral-500 font-medium ml-1">({worker.reviews?.length || 0} reseñas)</span>
              </div>
            </div>

            {/* Grid de Datos de Contacto (Tarjetas minimalistas) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              
              <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-4 flex flex-col items-center md:items-start transition hover:bg-neutral-900">
                <div className="flex items-center gap-2 text-neutral-500 mb-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Ubicación</span>
                </div>
                <p className="text-sm font-medium text-neutral-200">{worker.city || 'No disponible'}</p>
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-4 flex flex-col items-center md:items-start transition hover:bg-neutral-900">
                <div className="flex items-center gap-2 text-neutral-500 mb-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Email</span>
                </div>
                <a href={`mailto:${contactEmail}`} className="text-sm font-medium text-neutral-200 hover:text-slate-500 transition-colors truncate w-full md:text-left text-center">
                  {contactEmail}
                </a>
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-4 flex flex-col items-center md:items-start transition hover:bg-neutral-900 group cursor-pointer" onClick={() => copyToClipboard(contactPhone)}>
                <div className="flex items-center gap-2 text-neutral-500 mb-1.5">
                  <svg className="w-4 h-4 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  <span className="text-[10px] font-bold uppercase tracking-wider group-hover:text-emerald-500 transition-colors">Teléfono</span>
                </div>
                <div className="flex items-center gap-2 w-full justify-center md:justify-start">
                  <span className="text-sm font-medium text-neutral-200 group-hover:text-emerald-400 transition-colors">
                    {contactPhone || 'No disponible'}
                  </span>
                  {contactPhone && (
                    <span className="text-[9px] font-bold bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {copied ? "¡Copiado!" : "Copiar"}
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CONTENIDO PRINCIPAL: Layout 8/4 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-8">
            
            {/* Sección: Descripción Profesional */}
            <section className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 backdrop-blur-sm shadow-sm transition-all hover:border-neutral-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center text-slate-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h2 className="text-xl font-bold text-neutral-100">Sobre el profesional</h2>
              </div>
              <div className="bg-neutral-900/30 p-6 rounded-2xl border border-neutral-800/50">
                <p className="text-sm text-neutral-400 leading-relaxed whitespace-pre-line">
                  {worker.worker_profile?.description || "Este profesional no ha añadido una descripción de sus servicios todavía."}
                </p>
              </div>
            </section>

            {/* Sección: Reseñas */}
            <section className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 backdrop-blur-sm shadow-sm transition-all hover:border-neutral-700/50">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center text-slate-500">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.907a1 1 0 00.95-.69l1.519-4.674z"></path></svg>
                  </div>
                  <h2 className="text-xl font-bold text-neutral-100">Reseñas de clientes</h2>
                </div>
                
                {user && Number(user.id) !== Number(worker.id) && !showReviewForm && (
                  <button 
                    onClick={() => setShowReviewForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs font-bold text-neutral-200 transition-all cursor-pointer shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Escribir reseña
                  </button>
                )}
              </div>

              {showReviewForm && (
                <div className="mb-10 bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800">
                  <ReviewForm 
                    workerId={worker.id} 
                    onReviewSuccess={handleReviewSuccess} 
                    onCancel={() => setShowReviewForm(false)}
                  />
                </div>
              )}

              <ReviewList 
                reviews={worker.reviews} 
                currentUser={user} 
                onRefresh={fetchWorker} 
              />
            </section>
          </div>

          {/* SIDEBAR: Seguridad (Sticky) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 z-10">
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-slate-500/20 transition-colors duration-500"></div>
              
              <div className="flex items-center gap-3 mb-5 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center text-slate-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <h3 className="text-sm font-black text-neutral-100 uppercase tracking-tight">Centro de Seguridad</h3>
              </div>
              
              <p className="text-sm text-neutral-400 leading-relaxed relative z-10 mb-6">
                Para garantizar tu seguridad y la de tu dinero, te recomendamos <strong className="text-neutral-200">no realizar pagos por adelantado</strong>. 
              </p>
              
              <div className="p-4 bg-slate-500/5 border border-slate-500/20 rounded-xl relative z-10">
                <p className="text-xs text-slate-400/90 font-medium">
                  Acordá el presupuesto final únicamente después de haber verificado el trabajo o las condiciones presencialmente.
                </p>
              </div>
            </div>
          </aside>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default WorkerProfilePage;