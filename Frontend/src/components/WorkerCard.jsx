// src/components/WorkerCard.jsx
import { useNavigate } from 'react-router-dom';

function WorkerCard({ worker }) {
  const navigate = useNavigate();
  
  // Calculamos las estrellas (asumiendo que worker.rating es un número de 0 a 5)
  const rating = worker.rating || 0;

  // Función para navegar al perfil
  const handleViewProfile = () => {
    navigate(`/worker/${worker.id}`);
  };
  
  return (
    <div 
      
      className="relative overflow-hidden bg-neutral-900/40 border border-neutral-800/50 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-700/80 hover:bg-neutral-900/60 hover:shadow-2xl hover:shadow-orange-500/5 flex flex-col h-full group"
    >
      {/* Luz de fondo sutil que se enciende en hover */}
      <div className="absolute -right-8 -top-8 h-32 w-32 bg-orange-500/0 blur-3xl rounded-full transition-colors duration-500 group-hover:bg-orange-500/10 pointer-events-none" />

      <div className="flex items-start gap-5 relative z-10">
        
        {/* Avatar */}
        <div className="relative shrink-0">
          {worker.profile_picture_url ? (
            <img 
              src={worker.profile_picture_url} 
              alt={worker.nickname} 
              className="w-16 h-16 rounded-full object-cover border-2 border-neutral-800 group-hover:border-orange-500/50 transition-colors duration-300 shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center text-2xl font-black text-orange-500 uppercase transition-colors duration-300 group-hover:border-orange-500/50 shadow-sm">
              {worker.nickname.charAt(0)}
            </div>
          )}
          
          {/* Badge de Rating Flotante */}
          <div className="absolute -bottom-2 -right-2 bg-neutral-950/90 backdrop-blur-sm border border-neutral-800 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
            <svg className="w-3 h-3 text-orange-500 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[10px] font-bold text-neutral-200">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Info Principal */}
        <div className="flex-grow pt-1">
          <h4 className="text-neutral-50 font-bold text-lg tracking-tight group-hover:text-white transition-colors leading-tight mb-1 truncate max-w-[160px] sm:max-w-[200px]">
            {worker.nickname}
          </h4>
          <p className="text-orange-500 text-[10px] font-black mb-2 uppercase tracking-widest truncate">
            {worker.worker_profile?.profession || 'Profesional'}
          </p>
          <div className="flex items-center gap-1.5 text-neutral-500 group-hover:text-neutral-400 transition-colors">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="text-xs font-medium truncate">{worker.city || 'No disponible'}</span>
          </div>
        </div>
      </div>

      {/* Descripción corta */}
      <div className="mt-6 mb-6 relative z-10 flex-grow">
        <p className="text-neutral-400 text-sm line-clamp-2 leading-relaxed font-light">
          <span className="text-neutral-600 font-serif mr-1 text-lg leading-none">"</span>
          {worker.worker_profile?.description || 'Este profesional aún no ha añadido una descripción de sus servicios.'}
          <span className="text-neutral-600 font-serif ml-1 text-lg leading-none">"</span>
        </p>
      </div>

      {/* Botón Acción interactivo */}
      <button 
        onClick={(e) => {
          e.stopPropagation(); // Evitamos que el clic dispare el onClick del div padre
          handleViewProfile();
        }}
        className="w-full mt-auto py-3 bg-neutral-800/50 border border-neutral-800 text-neutral-400 group-hover:bg-orange-600 group-hover:border-orange-500 group-hover:text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer relative z-10 active:scale-95"
      >
        Ver Perfil
      </button>
    </div>
  );
}

export default WorkerCard;