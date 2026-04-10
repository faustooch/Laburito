// src/pages/SearchPage.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { userService } from '../../users/services/userService';
import { professionService } from '../services/professionService';
import Header from '../../../shared/components/Header';
import Footer from '../../../shared/components/Footer';
import WorkerTable from '../../users/components/WorkerTable';

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
  const [professions, setProfessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isMounted, setIsMounted] = useState(false);

  const query = searchParams.get('q') || '';
  const city = searchParams.get('city') || '';
  const profession = searchParams.get('profession') || '';
  const minRating = parseFloat(searchParams.get('minRating')) || 0;

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

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
    const cleanValue = key === 'minRating' ? parseFloat(value) : value;

    if (!value || value === "Todas las ciudades" || value === "Todos los rubros" || cleanValue === 0) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col overflow-x-hidden">
      <Header />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col">
        
        <div 
          className={`flex-grow flex flex-col transform transition-all duration-1000 ease-out ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Cabecera y Filtros */}
          <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-neutral-800/50 pb-8 shrink-0">
            
            <div className="flex-grow">
              {query && (
                <span className="inline-block px-3 py-1 mb-3 rounded-md bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  Resultados de búsqueda
                </span>
              )}
              {/* Título adaptable en tamaño */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-50 tracking-tight leading-tight break-words">
                {query || profession ? `"${query || profession}"` : "Explorar Trabajadores"}
              </h1>
              <div className="flex items-center gap-3 mt-4">
                <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></span>
                <p className="text-neutral-400 text-sm font-medium">
                  <strong className="text-white">{results.length}</strong> coincidencias
                </p>
              </div>
            </div>

            {/* BARRA DE FILTROS ADAPTABLE */}
            {/* Mobile: 1 col, Tablet: 2 cols, Desktop: inline flex */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-4 w-full lg:w-auto mt-4 lg:mt-0">
              
              <div className="relative group w-full lg:w-auto">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-500 group-hover:text-slate-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <select 
                  value={profession || "Todos los rubros"}
                  onChange={(e) => updateFilter('profession', e.target.value)}
                  className="w-full bg-neutral-900/50 border border-neutral-800 text-neutral-300 text-xs font-bold rounded-2xl pl-9 pr-8 py-3.5 focus:outline-none focus:border-slate-500/50 hover:bg-neutral-900 transition-all cursor-pointer appearance-none shadow-sm min-w-[160px]"
                >
                  <option>Todos los rubros</option>
                  {professions.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-neutral-500">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              <div className="relative group w-full lg:w-auto">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-500 group-hover:text-slate-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <select 
                  value={city || "Todas las ciudades"}
                  onChange={(e) => updateFilter('city', e.target.value)}
                  className="w-full bg-neutral-900/50 border border-neutral-800 text-neutral-300 text-xs font-bold rounded-2xl pl-9 pr-8 py-3.5 focus:outline-none focus:border-slate-500/50 hover:bg-neutral-900 transition-all cursor-pointer appearance-none shadow-sm min-w-[160px]"
                >
                  {ARGENTINE_CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-neutral-500">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              <div className="relative group w-full lg:w-auto sm:col-span-2 lg:col-span-1">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-500 group-hover:text-slate-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.907a1 1 0 00.95-.69l1.519-4.674z"></path></svg>
                </div>
                <select 
                  value={minRating}
                  onChange={(e) => updateFilter('minRating', e.target.value)}
                  className="w-full bg-neutral-900/50 border border-neutral-800 text-neutral-300 text-xs font-bold rounded-2xl pl-9 pr-8 py-3.5 focus:outline-none focus:border-slate-500/50 hover:bg-neutral-900 transition-all cursor-pointer appearance-none shadow-sm min-w-[160px]"
                >
                  {RATINGS.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-neutral-500">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              {(city || minRating > 0 || profession) && (
                <button 
                  onClick={() => setSearchParams(query ? { q: query } : {})}
                  className="w-full lg:w-auto mt-2 sm:mt-0 flex items-center justify-center p-3 text-neutral-500 bg-neutral-900/30 border border-neutral-800 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 rounded-2xl transition-all cursor-pointer"
                  title="Limpiar filtros"
                >
                  <svg className="w-4 h-4 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  <span className="lg:hidden text-xs font-bold uppercase tracking-widest">Limpiar Filtros</span>
                </button>
              )}
            </div>
          </div>

          <div className="w-full flex-grow flex flex-col">
            {isLoading ? (
              <div className="flex-grow flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-slate-500/20 border-t-slate-500 rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Buscando trabajadores...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="flex-grow">
                <WorkerTable workers={results} />
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center px-4 bg-neutral-900/20 border border-dashed border-neutral-800/80 rounded-3xl mt-2 min-h-[400px]">
                <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-600 mb-6 shadow-inner">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-neutral-200 mb-2 tracking-tight">No encontramos trabajadores</h3>
                <p className="text-neutral-500 text-sm max-w-md mx-auto leading-relaxed">
                  Parece que no hay trabajadores que coincidan exactamente con tus filtros. Probá buscando en "Todas las ciudades" o cambiando de rubro.
                </p>
                
                {(city || minRating > 0 || profession) && (
                  <button 
                    onClick={() => setSearchParams(query ? { q: query } : {})}
                    className="mt-8 px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                  >
                    Limpiar Filtros
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default SearchPage;