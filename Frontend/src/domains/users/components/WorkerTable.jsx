// src/components/WorkerTable.jsx
import { useNavigate } from 'react-router-dom';

function WorkerTable({ workers }) {
  const navigate = useNavigate();

  const handleRowClick = (workerId) => {
    navigate(`/worker/${workerId}`);
  };

  return (
    <div className="w-full">
      
      {/* VISTA MOBILE: Tarjetas apilables (Solo visible en pantallas chicas) */}
      <div className="md:hidden flex flex-col gap-4">
        {workers.map((worker) => (
          <div 
            key={`mobile-${worker.id}`}
            onClick={() => handleRowClick(worker.id)}
            className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-4 active:scale-[0.98] transition-transform cursor-pointer"
          >
            {/* Header de la Tarjeta: Avatar + Info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 shrink-0 rounded-full overflow-hidden border border-neutral-700 bg-neutral-800">
                {worker.profile_picture_url ? (
                  <img src={worker.profile_picture_url} alt={worker.nickname} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-500/10 text-slate-500 text-lg font-bold">
                    {worker.nickname.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <h3 className="text-base font-bold text-neutral-100 truncate">{worker.nickname}</h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-neutral-800 text-neutral-300 text-[10px] font-bold uppercase border border-neutral-700 truncate max-w-full">
                  {worker.worker_profile?.profession || 'N/A'}
                </span>
              </div>
            </div>

            {/* Footer de la Tarjeta: Ubicación + Rating */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-800/60">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 truncate max-w-[60%]">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span className="truncate">{worker.city || 'No especificada'}</span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-neutral-950 px-2 py-1 rounded-md border border-neutral-800">
                <svg className="w-3.5 h-3.5 text-slate-500 fill-current shrink-0" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-bold text-neutral-200">{worker.rating?.toFixed(1) || '0.0'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* VISTA DESKTOP: Tabla clásica (Oculta en móviles, visible desde 'md' hacia arriba) */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/20 backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-900/50">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Profesional</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Oficio</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Ciudad</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500 text-center">Calificación</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {workers.map((worker) => (
              <tr 
                key={`desktop-${worker.id}`}
                className="hover:bg-slate-500/5 transition-colors group cursor-pointer"
                onClick={() => handleRowClick(worker.id)}
              >
                {/* Columna Perfil */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-800 bg-neutral-900 transition-transform group-hover:scale-105">
                      {worker.profile_picture_url ? (
                        <img src={worker.profile_picture_url} alt={worker.nickname} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-500/10 text-slate-500 font-bold">
                          {worker.nickname.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-100 group-hover:text-slate-500 transition-colors">
                        {worker.nickname}
                      </p>
                      <p className="text-xs text-neutral-500">{worker.email}</p>
                    </div>
                  </div>
                </td>

                {/* Columna Oficio */}
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 text-[10px] font-bold uppercase border border-neutral-700">
                    {worker.worker_profile?.profession || 'N/A'}
                  </span>
                </td>

                {/* Columna Ciudad */}
                <td className="px-6 py-4 text-sm text-neutral-400">
                  {worker.city || 'No especificada'}
                </td>

                {/* Columna Rating */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1.5">
                    <svg className="w-4 h-4 text-slate-500 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-bold text-neutral-200">{worker.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                </td>

                {/* Columna Botón */}
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(worker.id);
                    }}
                    className="px-4 py-2 bg-neutral-800 group-hover:bg-slate-600 text-neutral-300 group-hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    Ver Perfil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default WorkerTable;