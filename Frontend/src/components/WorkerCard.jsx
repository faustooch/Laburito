// src/components/WorkerCard.jsx
function WorkerCard({ worker }) {
  // Calculamos las estrellas (asumiendo que worker.rating es un número de 0 a 5)
  const rating = worker.rating || 0;
  
  return (
    <div className="bg-neutral-900/40 border border-neutral-800 hover:border-orange-500/50 rounded-2xl p-5 transition-all duration-300 group shadow-sm hover:shadow-orange-500/10">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          {worker.profile_picture_url ? (
            <img 
              src={worker.profile_picture_url} 
              alt={worker.nickname} 
              className="w-16 h-16 rounded-xl object-cover border border-neutral-800"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-2xl font-bold text-orange-500 uppercase">
              {worker.nickname.charAt(0)}
            </div>
          )}
          {/* Badge de Rating Flotante */}
          <div className="absolute -bottom-2 -right-2 bg-neutral-950 border border-neutral-800 px-1.5 py-0.5 rounded-lg flex items-center gap-1 shadow-lg">
            <svg className="w-3 h-3 text-orange-500 fill-orange-500" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <span className="text-[10px] font-bold text-neutral-200">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Info Principal */}
        <div className="flex-grow">
          <h4 className="text-neutral-100 font-semibold text-base group-hover:text-orange-500 transition-colors leading-tight">
            {worker.nickname}
          </h4>
          <p className="text-orange-500/90 text-xs font-medium mb-2 uppercase tracking-wider">
            {worker.worker_profile?.profession || 'Profesional'}
          </p>
          <div className="flex items-center gap-2 text-neutral-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="text-xs">{worker.city || 'Ubicación no disponible'}</span>
          </div>
        </div>
      </div>

      {/* Descripción corta */}
      <p className="mt-4 text-neutral-400 text-xs line-clamp-2 leading-relaxed italic">
        "{worker.worker_profile?.description || 'Sin descripción disponible.'}"
      </p>

      {/* Botón Acción */}
      <button className="w-full mt-4 py-2 bg-neutral-800 hover:bg-orange-600 text-neutral-300 hover:text-white text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer">
    Ver Perfil Completo
  </button>
    </div>
  );
}

export default WorkerCard;