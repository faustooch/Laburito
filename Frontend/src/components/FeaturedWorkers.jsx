// src/components/FeaturedWorkers.jsx
import { useEffect, useState } from 'react';
import WorkerCard from './WorkerCard';
import { userService } from '../services/userService';

function FeaturedWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopWorkers = async () => {
      try {
        // En el futuro: api.get('/workers/top')
        const data = await userService.getTopWorkers(); 
        setWorkers(data);
      } catch (err) {
        console.error("Error cargando destacados:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopWorkers();
  }, []);

  if (loading) return <div className="py-10 text-center text-neutral-500">Buscando a los mejores profesionales...</div>;

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-neutral-100">Profesionales Destacados</h3>
          <p className="text-sm text-neutral-500">Los mejores calificados en tu zona</p>
        </div>
        <button className="text-orange-500 text-sm font-semibold hover:underline">Ver todos</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers.map(worker => (
          <WorkerCard key={worker.id} worker={worker} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedWorkers;