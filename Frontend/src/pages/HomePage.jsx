// src/pages/HomePage.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategorySlider from '../components/CategorySlider';
import FeaturedWorkers from '../components/FeaturedWorkers';
import { useAuth } from '../context/AuthContext';
import { professionService } from '../services/professionService';
import { statsService } from '../services/statsService';

// --- COMPONENTES AUXILIARES ---

const ScrollReveal = ({ children, className = "", threshold = 0.15 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setIsVisible(true);
      });
    }, { threshold });

    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={domRef}
      className={`transform transition-all duration-1000 ease-out w-full ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const AnimatedCounter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const domRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setIsVisible(true);
    });
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || target === 0) return;
    
    let startTime = null;
    const end = parseInt(target, 10);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    
    requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  return <span ref={domRef}>{count}</span>;
};

// --- COMPONENTE PRINCIPAL ---

function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [professions, setProfessions] = useState([]);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  
  const [systemStats, setSystemStats] = useState({ workers: 0, clients: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setIsHeroVisible(true), 100);

    const fetchInitialData = async () => {
      try {
        const [profData, statsData] = await Promise.all([
          professionService.getProfessions(),
          statsService.getSystemStats()
        ]);
        
        setProfessions(profData);
        setSystemStats({
          workers: statsData.workers,
          clients: statsData.clients
        });

      } catch (err) {
        console.error("Error crítico al cargar datos iniciales de la Landing", err);
        setSystemStats({ workers: 0, clients: 0 }); 
      }
    };
    
    fetchInitialData();
    return () => clearTimeout(timer);
  }, []);

  const filteredProfessions = professions.filter(
    prof => prof.name.toLowerCase() !== 'otro' && prof.name.toLowerCase() !== 'otros'
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col overflow-x-hidden">
      <Header />

      {user ? (
        // === VISTA LOGUEADO (Dashboard Limpio) ===
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 pb-20 pt-32 flex flex-col space-y-24">
          
          <div className={`py-4 -my-4 transform transition-all duration-700 ease-out ${isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <CategorySlider professions={filteredProfessions} />
          </div>

          <div className={`py-4 -my-4 transform transition-all duration-700 delay-200 ease-out ${isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <FeaturedWorkers />
          </div>

        </main>
      ) : (
        // === VISTA LANDING (No Logueado) ===
        <main className="flex-grow flex flex-col w-full">
          
          {/* SECCIÓN 1: HERO */}
          <section id="inicio" className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative pb-20">
            <div className={`mb-6 inline-block px-3 py-1 rounded-full border border-slate-500/20 bg-slate-500/5 text-slate-400 text-xs font-bold uppercase tracking-widest transform transition-all duration-700 ease-out ${isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}>
              Nuevos trabajadores cada día
            </div>

            <h1 className={`text-6xl md:text-8xl font-black text-neutral-50 tracking-tighter leading-none mb-6 transform transition-all duration-1000 delay-150 ease-out ${isHeroVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              Laburito<span className="text-slate-500">.</span>
            </h1>

            <p className={`text-lg md:text-xl text-neutral-400 mb-12 font-medium max-w-xl mx-auto leading-relaxed transform transition-all duration-700 delay-300 ease-out ${isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Red de conexion con trabajadores. <br/>
              <span className="text-neutral-500 text-base font-normal">Soluciones reales a un clic de distancia.</span>
            </p>

            {/* Sombra RGBA corregida al tono slate-500 (100,116,139) */}
            <button 
              onClick={() => navigate('/register')} 
              className={`bg-slate-600 text-white font-bold text-lg px-8 py-4 rounded-full 
                         transition-all duration-300 hover:bg-slate-500 hover:scale-105 active:scale-95 
                         shadow-[0_0_20px_rgba(100,116,139,0.4)] cursor-pointer
                         ${isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              Empezar ahora gratis
            </button>
          </section>

          {/* SECCIÓN 2: ¿CÓMO FUNCIONA? */}
          <section id="como-funciona" className="min-h-screen flex flex-col items-center justify-center px-4 w-full max-w-7xl mx-auto relative py-24">
            <div className="absolute top-0 w-full max-w-5xl h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent"></div>
            
            <ScrollReveal>
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                  ¿Cómo <span className="text-slate-500">funciona?</span>
                </h2>
                <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                  Diseñamos un proceso de tres pasos para que conectar con trabajadores sea rápido, seguro y sin fricciones.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                
                {/* Paso 1 */}
                <div className="p-10 rounded-[2rem] bg-gradient-to-b from-neutral-900/80 to-neutral-950 border border-neutral-800/80 text-center relative overflow-hidden group hover:-translate-y-3 hover:border-slate-500/40 hover:shadow-[0_15px_40px_-15px_rgba(100,116,139,0.3)] transition-all duration-500 cursor-default">
                  <div className="absolute -top-6 -right-6 text-[180px] leading-none font-black text-neutral-800/30 group-hover:text-slate-500/10 group-hover:-translate-y-4 group-hover:-translate-x-2 group-hover:scale-110 transition-all duration-700 select-none pointer-events-none z-0">
                    1
                  </div>
                  
                  <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-500 flex items-center justify-center mb-8 mx-auto relative z-10 group-hover:bg-slate-500/10 group-hover:border-slate-500/50 group-hover:text-slate-400 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(100,116,139,0.3)] transition-all duration-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-neutral-100 group-hover:text-white transition-colors relative z-10">
                    Buscá
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed relative z-10 group-hover:text-neutral-300 transition-colors">
                    Filtrá por oficio y ciudad para encontrar a los trabajadores mejor calificados de tu zona en segundos.
                  </p>
                </div>

                {/* Paso 2 */}
                <div className="p-10 rounded-[2rem] bg-gradient-to-b from-neutral-900/80 to-neutral-950 border border-neutral-800/80 text-center relative overflow-hidden group hover:-translate-y-3 hover:border-slate-500/40 hover:shadow-[0_15px_40px_-15px_rgba(100,116,139,0.3)] transition-all duration-500 cursor-default">
                  <div className="absolute -top-6 -right-6 text-[180px] leading-none font-black text-neutral-800/30 group-hover:text-slate-500/10 group-hover:-translate-y-4 group-hover:-translate-x-2 group-hover:scale-110 transition-all duration-700 select-none pointer-events-none z-0">
                    2
                  </div>
                  
                  <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-500 flex items-center justify-center mb-8 mx-auto relative z-10 group-hover:bg-slate-500/10 group-hover:border-slate-500/50 group-hover:text-slate-400 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(100,116,139,0.3)] transition-all duration-500 delay-75">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 16a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v11z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-neutral-100 group-hover:text-white transition-colors relative z-10">
                    Contactá
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed relative z-10 group-hover:text-neutral-300 transition-colors">
                    Hablá directamente con el trabajador por teléfono o mail, pedí un presupuesto a medida y coordiná la visita.
                  </p>
                </div>

                {/* Paso 3 */}
                <div className="p-10 rounded-[2rem] bg-gradient-to-b from-neutral-900/80 to-neutral-950 border border-neutral-800/80 text-center relative overflow-hidden group hover:-translate-y-3 hover:border-slate-500/40 hover:shadow-[0_15px_40px_-15px_rgba(100,116,139,0.3)] transition-all duration-500 cursor-default">
                  <div className="absolute -top-6 -right-6 text-[180px] leading-none font-black text-neutral-800/30 group-hover:text-slate-500/10 group-hover:-translate-y-4 group-hover:-translate-x-2 group-hover:scale-110 transition-all duration-700 select-none pointer-events-none z-0">
                    3
                  </div>
                  
                  <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-500 flex items-center justify-center mb-8 mx-auto relative z-10 group-hover:bg-slate-500/10 group-hover:border-slate-500/50 group-hover:text-slate-400 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(100,116,139,0.3)] transition-all duration-500 delay-150">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.907a1 1 0 00.95-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-neutral-100 group-hover:text-white transition-colors relative z-10">
                    Calificá
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed relative z-10 group-hover:text-neutral-300 transition-colors">
                    Una vez terminado el trabajo, dejá tu reseña para construir reputación y ayudar a toda la comunidad.
                  </p>
                </div>

              </div>
            </ScrollReveal>
          </section>

          {/* SECCIÓN 3: OFICIOS */}
          <section id="oficios" className="min-h-screen flex flex-col items-center justify-center bg-neutral-900/20 border-y border-neutral-900 overflow-hidden w-full relative py-20">
  <ScrollReveal className="w-full">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
        Explorá nuestros <span className="text-slate-500">Oficios</span>
      </h2>
      <p className="text-neutral-500 text-sm font-medium">Click y arrastre para explorar las categorías</p>
    </div>
    
    <div className="w-full relative select-none group flex flex-col gap-4">
      {/* Degradados laterales para suavizar el corte */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-neutral-950 to-transparent z-20 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-neutral-950 to-transparent z-20 pointer-events-none"></div>

      {/* FILA 1: Dirección Normal */}
      <div className="flex animate-scroll gap-4 py-2 group-hover:[animation-play-state:paused]">
        {[...filteredProfessions, ...filteredProfessions].map((prof, index) => (
          <div key={`row1-${index}`} className="label-pills-base px-8 py-4 rounded-2xl border text-sm font-bold whitespace-nowrap bg-neutral-950 text-neutral-300 border-neutral-800 flex items-center gap-3 cursor-default shadow-lg">
            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
            {prof.name}
          </div>
        ))}
      </div>

      {/* FILA 2: Dirección Inversa */}
      <div className="flex animate-scroll-reverse gap-4 py-2 group-hover:[animation-play-state:paused]">
        {/* Invertimos el array para que no se vean exactamente iguales una arriba de la otra */}
        {[...filteredProfessions].reverse().concat([...filteredProfessions].reverse()).map((prof, index) => (
          <div key={`row2-${index}`} className="label-pills-base px-8 py-4 rounded-2xl border text-sm font-bold whitespace-nowrap bg-neutral-900/50 text-neutral-400 border-neutral-800 flex items-center gap-3 cursor-default shadow-lg">
            <div className="w-2 h-2 rounded-full bg-slate-500/50"></div>
            {prof.name}
          </div>
        ))}
      </div>
    </div>
  </ScrollReveal>
</section>

          {/* SECCIÓN 4: BENEFICIOS / ESTADÍSTICAS */}
          <section id="beneficios" className="min-h-screen flex flex-col items-center justify-center px-4 w-full max-w-5xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-16">¿Por qué usar <span className="text-slate-500">Laburito?</span></h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <span className="text-5xl font-black text-white block mb-2">
                    +<AnimatedCounter target={filteredProfessions.length} />
                  </span>
                  <p className="text-sm text-neutral-500 uppercase tracking-widest font-bold">Oficios</p>
                </div>
                <div>
                  <span className="text-5xl font-black text-white block mb-2">
                    +<AnimatedCounter target={systemStats.workers} />
                  </span>
                  <p className="text-sm text-neutral-500 uppercase tracking-widest font-bold">Trabajadores</p>
                </div>
                <div>
                  <span className="text-5xl font-black text-white block mb-2">
                    +<AnimatedCounter target={systemStats.clients} />
                  </span>
                  <p className="text-sm text-neutral-500 uppercase tracking-widest font-bold">Clientes</p>
                </div>
                <div>
                  <span className="text-5xl font-black text-slate-500 block mb-2">Gratis</span>
                  <p className="text-sm text-neutral-500 uppercase tracking-widest font-bold">Sin comisiones</p>
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* SECCIÓN 5: CTA FINAL */}
          <section className="min-h-screen flex flex-col items-center justify-center px-4 w-full text-center relative">
            <div className="absolute top-0 w-full max-w-5xl h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent"></div>
            
            <ScrollReveal>
              <div className="max-w-3xl mx-auto bg-gradient-to-tr from-neutral-900 to-neutral-800 rounded-3xl p-12 border border-neutral-700 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-500/20 rounded-full blur-3xl pointer-events-none"></div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">¿Sos un trabajador?</h2>
                <p className="text-neutral-400 mb-8 relative z-10">Unite a Laburito, armá tu perfil en minutos y empezá a conseguir más clientes en tu ciudad.</p>
                
                <button onClick={() => navigate('/register')} className="relative z-10 bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-neutral-200 transition-all cursor-pointer shadow-lg active:scale-95">
                  Crear mi perfil gratis
                </button>
              </div>
            </ScrollReveal>
          </section>

        </main>
      )}

      <Footer />
    </div>
  );
}

export default HomePage;