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

  // Función para obtener los datos del trabajador
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

  // Handler para cuando se publica una reseña con éxito
  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    fetchWorker(); // Recargamos para actualizar el promedio y la lista
  };

  // Función para copiar teléfono al portapapeles
  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-neutral-800 border-t-orange-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!worker) return (
    <div className="min-h-screen bg-neutral-950 text-neutral-500 flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center font-medium">
        Perfil no encontrado.
      </main>
      <Footer />
    </div>
  );

  const contactEmail = worker.worker_profile?.contact_email || worker.email;
  const contactPhone = worker.worker_profile?.contact_phone;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 flex flex-col">
      <Header />

      <main className="flex-grow max-w-5xl mx-auto w-full px-6 py-12">
        
        {/* CABECERA: Perfil e Información de Contacto */}
        <section className="mb-12 flex flex-col md:flex-row items-center md:items-start gap-10 border-b border-neutral-900 pb-12">
          
          {/* Foto o Placeholder con Inicial */}
          <div className="w-32 h-32 rounded-full overflow-hidden border border-neutral-800 bg-neutral-900 flex-shrink-0 shadow-xl">
            {worker.profile_picture_url ? (
              <img 
                src={worker.profile_picture_url} 
                className="w-full h-full object-cover" 
                alt={worker.nickname} 
              />
            ) : (
              <div className="w-full h-full bg-orange-500/10 flex items-center justify-center text-4xl font-bold text-orange-500 uppercase">
                {worker.nickname.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-grow text-center md:text-left">
            <h1 className="text-4xl font-bold text-neutral-50 mb-3 tracking-tight">{worker.nickname}</h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
              <span className="text-sm font-semibold text-orange-500 uppercase tracking-wide">
                {worker.worker_profile?.profession || 'Profesional'}
              </span>
              <span className="text-neutral-800">•</span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-neutral-200 bg-neutral-900/50 px-2 py-1 rounded-lg border border-neutral-800">
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                </svg>
                {worker.rating?.toFixed(1) || '0.0'}
                <span className="text-neutral-500 font-medium ml-1">({worker.reviews?.length || 0} reseñas)</span>
              </div>
            </div>

            {/* Grid de Datos Técnicos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Ubicación */}
              <div className="space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-2 text-neutral-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Ubicación</span>
                </div>
                <p className="text-sm font-medium text-neutral-200">{worker.city || 'No disponible'}</p>
              </div>

              {/* Email con mailto */}
              <div className="space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-2 text-neutral-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Email</span>
                </div>
                <a href={`mailto:${contactEmail}`} className="text-sm font-medium text-neutral-200 hover:text-orange-500 transition-colors inline-block">
                  {contactEmail}
                </a>
              </div>

              {/* WhatsApp con Copiado */}
              <div className="space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-2 text-neutral-500">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.55 4.197 1.594 6.039L0 24l6.105-1.602a11.834 11.834 0 005.937 1.598h.005c6.637 0 12.05-5.414 12.05-12.05a11.816 11.816 0 00-3.593-8.512"/></svg>
                  <span className="text-[10px] font-bold uppercase tracking-wider">WhatsApp</span>
                </div>
                <button 
                  onClick={() => copyToClipboard(contactPhone)}
                  className="text-sm font-medium text-neutral-200 hover:text-emerald-500 transition-colors flex items-center justify-center md:justify-start gap-2 group cursor-pointer"
                >
                  {contactPhone || 'No disponible'}
                  <span className="text-[9px] bg-neutral-900 border border-neutral-800 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {copied ? "¡Copiado!" : "Copiar"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENIDO: Sobre Mí y Reseñas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            
            {/* Sección: Descripción Profesional */}
            <section>
              <h2 className="text-xl font-bold text-neutral-50 mb-4">Sobre el profesional</h2>
              <div className="bg-neutral-900/10 border-l-2 border-neutral-800 pl-6 py-2">
                <p className="text-sm text-neutral-400 leading-relaxed whitespace-pre-line">
                  {worker.worker_profile?.description || "Este profesional no ha añadido una descripción todavía."}
                </p>
              </div>
            </section>

            {/* Sección: Reseñas */}
            <section>
              <div className="flex justify-between items-center mb-8 border-b border-neutral-900 pb-4">
                <h2 className="text-xl font-bold text-neutral-50">Reseñas de clientes</h2>
                
                {/* Botón para abrir formulario (solo si no es el mismo usuario) */}
                {user && Number(user.id) !== Number(worker.id) && !showReviewForm && (
                  <button 
                    onClick={() => setShowReviewForm(true)}
                    className="text-xs font-bold text-orange-500 hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    + Escribir una reseña
                  </button>
                )}
              </div>

              {/* Formulario Dinámico */}
              {showReviewForm && (
                <div className="mb-12">
                  <ReviewForm 
                    workerId={worker.id} 
                    onReviewSuccess={handleReviewSuccess} 
                    onCancel={() => setShowReviewForm(false)}
                  />
                </div>
              )}

              {/* Listado de Reseñas Refactorizado */}
              <ReviewList 
  reviews={worker.reviews} 
  currentUser={user} 
  onRefresh={fetchWorker} 
/>
              
            </section>
          </div>

          {/* SIDEBAR: Seguridad */}
          <aside className="h-fit">
            <div className="sticky top-28 p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 backdrop-blur-sm shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-tight">Seguridad</h3>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Recomendamos no realizar pagos por adelantado. Acordá el presupuesto una vez verificado el trabajo presencialmente.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default WorkerProfilePage;