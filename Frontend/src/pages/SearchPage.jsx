// src/pages/SearchPage.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { userService } from '../services/userService';
import { professionService } from '../services/professionService'; // Importamos el servicio
import Header from '../components/Header';
import Footer from '../components/Footer';
import WorkerTable from '../components/WorkerTable';

const ARGENTINE_CITIES = [
  "Todas las ciudades", "Buenos Aires (CABA)", "Córdoba", "Rosario", "Mendoza", 
  "San Miguel de Tucumán", "La Plata", "Mar del Plata", "Salta", "Santa Fe", 
  "San Juan", "Resistencia", "Neuquén", "Posadas", "San Salvador de Jujuy", 
  "Bahía Blanca", "Paraná", "Santiago del Estero", "San Luis", "Catamarca", 
  "Santa Rosa", "Ushuaia", "Otra"
];

const RATINGS = [
  { label: "Cualquier calificación", value: 0 },
  { label: "4.5 estrellas o más", value: 4.5 },
  { label: "4.0 estrellas o más", value: 4.0 },
  { label: "3.0 estrellas o más", value: 3.0 },
];

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [professions, setProfessions] = useState([]); // Estado para las profesiones del back
  const [isLoading, setIsLoading] = useState(true);

  // Filtros desde la URL
  const query = searchParams.get('q') || '';
  const city = searchParams.get('city') || '';
  const profession = searchParams.get('profession') || '';
  const minRating = parseFloat(searchParams.get('minRating')) || 0;

  // 1. Cargar Profesiones una sola vez al montar
  useEffect(() => {
    const loadProfessions = async () => {
      try {
        const data = await professionService.getProfessions();
        setProfessions(data);
      } catch (err) {
        console.error("Error cargando profesiones", err);
      }
    };
    loadProfessions();
  }, []);

  // 2. Buscar resultados cuando cambie cualquier filtro
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const data = await userService.searchWorkers({ 
          q: query, 
          city: city === "Todas las ciudades" ? "" : city,
          profession: profession === "Todos los rubros" ? "" : profession,
          minRating 
        });
        setResults(data);
      } catch (err) {
        console.error("Error en la búsqueda", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [query, city, profession, minRating]);

  const updateFilter = (key, value) => {
  const newParams = new URLSearchParams(searchParams);
  
  // Si es minRating, nos aseguramos de que sea un número para la lógica de limpieza
  const cleanValue = key === 'minRating' ? parseFloat(value) : value;

  if (!value || value === "Todas las ciudades" || value === "Todos los rubros" || cleanValue === 0) {
    newParams.delete(key);
  } else {
    newParams.set(key, value);
  }
  setSearchParams(newParams);
};

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <Header />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-10">
        
        <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral-50 tracking-tight">
              {query || profession ? `Resultados para "${query || profession}"` : "Explorar Profesionales"}
            </h1>
            <p className="text-neutral-500 text-sm mt-1 font-medium">
              {results.length} expertos encontrados
            </p>
          </div>

          {/* BARRA DE FILTROS DINÁMICA */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Filtro Profesión (Dinámico desde Back) */}
            <select 
              value={profession || "Todos los rubros"}
              onChange={(e) => updateFilter('profession', e.target.value)}
              className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500/50 transition-all cursor-pointer appearance-none shadow-sm min-w-[140px]"
            >
              <option>Todos los rubros</option>
              {professions.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>

            {/* Filtro Ciudad */}
            <select 
              value={city || "Todas las ciudades"}
              onChange={(e) => updateFilter('city', e.target.value)}
              className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500/50 transition-all cursor-pointer appearance-none shadow-sm"
            >
              {ARGENTINE_CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Filtro Rating */}
            <select 
              value={minRating}
              onChange={(e) => updateFilter('minRating', e.target.value)}
              className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500/50 transition-all cursor-pointer appearance-none shadow-sm"
            >
              {RATINGS.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>

            {/* Limpiar Filtros */}
            {(city || minRating > 0 || profession) && (
              <button 
                onClick={() => setSearchParams({ q: query })}
                className="text-xs font-bold text-neutral-500 hover:text-orange-500 transition-colors px-2 cursor-pointer"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* TABLA DE RESULTADOS */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-orange-500/10 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        ) : results.length > 0 ? (
          <WorkerTable workers={results} />
        ) : (
          <div className="text-center py-24 bg-neutral-900/10 rounded-3xl border border-dashed border-neutral-800">
            <h3 className="text-lg font-semibold text-neutral-400">Sin resultados</h3>
            <p className="text-neutral-600 text-sm mt-1">Intentá ajustando los filtros de ciudad o rubro.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default SearchPage;