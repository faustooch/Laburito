// src/components/FeaturedWorkers.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkerCard from './WorkerCard';
import { userService } from '../services/userService';

function FeaturedWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopWorkers = async () => {
      try {
        const data = await userService.getTopWorkers(); 
        // Nos aseguramos de guardar solo los primeros 6 para no saturar la vista principal
        setWorkers(data ? data.slice(0, 6) : []);
      } catch (err) {
        console.error("Error cargando destacados:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopWorkers();
  }, []);

  return (
    <section className="relative mb-16">
      {/* Luz ambiental de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 px-4">
        <div>
          <h3 className="text-3xl md:text-4xl font-black text-neutral-50 tracking-tight leading-none mb-2">
            Trabajadores <span className="text-orange-500">Destacados</span>
          </h3>
          <p className="text-neutral-500 text-sm md:text-base font-medium">
            Trabajadores mejor calificados por la comunidad
          </p>
        </div>
        
        <button 
          onClick={() => navigate('/search')} 
          className="group flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:text-orange-500 hover:border-orange-500/50 hover:bg-neutral-900 transition-all shadow-sm active:scale-95 cursor-pointer backdrop-blur-sm w-full md:w-auto shrink-0"
        >
          <span className="text-xs font-bold uppercase tracking-widest">Ver todos</span>
          <svg className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-neutral-900/20 border border-neutral-800/50 rounded-3xl mx-4">
          <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Cargando destacados...</p>
        </div>
      ) : workers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4">
          {workers.map(worker => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-neutral-900/20 border border-dashed border-neutral-800/80 rounded-3xl mx-4 text-center">
          <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center text-neutral-600 mb-4 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <h4 className="text-xl font-bold text-neutral-200 mb-2">Aún no hay destacados</h4>
          <p className="text-sm text-neutral-500 max-w-sm">
            En cuanto los Trabajadores empiecen a recibir buenas calificaciones, aparecerán en esta sección.
          </p>
        </div>
      )}
    </section>
  );
}

export default FeaturedWorkers;