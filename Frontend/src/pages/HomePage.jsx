// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WelcomeBanner from '../components/WelcomeBanner';
import CategorySlider from '../components/CategorySlider';
import FeaturedWorkers from '../components/FeaturedWorkers';
import { useAuth } from '../context/AuthContext';
import { professionService } from '../services/professionService';

function HomePage() {
  const { user } = useAuth();
  const [professions, setProfessions] = useState([]);

  useEffect(() => {
    const fetchProfessions = async () => {
      try {
        const data = await professionService.getProfessions();
        setProfessions(data);
      } catch (err) {
        console.error("Error al cargar profesiones", err);
      }
    };
    fetchProfessions();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col overflow-hidden">
      <Header />

      {user ? (
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-10 flex flex-col">
          <WelcomeBanner />
          {/* Le pasamos las profesiones del back al grid */}
          <CategorySlider professions={professions} />
          <FeaturedWorkers />
        </main>
      ) : (
        <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 w-full">
          <section className="text-center flex flex-col items-center w-full max-w-4xl relative">
            
            <div className="mb-6 inline-block px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-500 text-xs font-bold uppercase tracking-widest">
              Nuevos profesionales cada día
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-neutral-50 tracking-tighter leading-none mb-6">
              Laburito<span className="text-orange-500">.</span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-400 mb-12 font-medium max-w-xl mx-auto leading-relaxed">
              La red de profesionales más grande de Argentina. <br/>
              <span className="text-neutral-600 text-base">Soluciones reales a un clic de distancia.</span>
            </p>

            {/* CARRUSEL DINÁMICO MEJORADO */}
            <div className="w-full mt-8 overflow-hidden relative select-none group">
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-neutral-950 to-transparent z-10"></div>
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-neutral-950 to-transparent z-10"></div>

              <div className="flex animate-scroll gap-6 py-6 group-hover:[animation-play-state:paused]">
                {/* Duplicamos la lista para el scroll infinito */}
                {[...professions, ...professions].map((prof, index) => (
                  <div
                    key={index}
                    className="px-8 py-4 rounded-2xl border text-sm font-bold whitespace-nowrap shadow-xl bg-neutral-900/50 text-neutral-300 border-neutral-800 label-pills-base flex items-center gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                    {prof.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-3xl">
              <div>
                <span className="text-2xl font-bold text-neutral-50">+50</span>
                <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Oficios</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-neutral-50">100%</span>
                <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Calificados</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-neutral-50">Gratis</span>
                <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Para clientes</p>
              </div>
            </div>

          </section>
        </main>
      )}

      <Footer />
    </div>
  );
}

export default HomePage;