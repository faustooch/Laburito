// src/pages/HomePage.jsx
import Header from '../components/Header';
import Footer from '../components/Footer';

// Array de categorías simplificado (solo nombres)
const categories = [
  'Plomería', 'Electricidad', 'Servicio Técnico', 'Gasista', 
  'Limpieza', 'Pintura', 'Carpintería', 'Albañilería'
];

function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col overflow-hidden">
      
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 w-full">
        <section className="text-center flex flex-col items-center w-full max-w-2xl relative">
          
          {/* Título Principal */}
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-50 tracking-tight leading-none mb-4">
            Laburito<span className="text-orange-500">.</span>
          </h1>

          {/* Descripción */}
          <p className="text-base md:text-lg text-neutral-500 mb-10 font-medium max-w-sm mx-auto">
            Conectamos tus necesidades con profesionales calificados.
          </p>

          {/* --- CUMPLIMOS: Carrusel Infinito Recuperado y Unificado --- */}
          <div className="w-full max-w-2xl mt-12 overflow-hidden relative select-none">
            {/* Sombras laterales */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none"></div>

            {/* Contenedor del scroll animado */}
            <div className="flex animate-scroll gap-5 py-3">
  {[...categories, ...categories].map((cat, index) => (
    <span
      key={index}
      // CAMBIO AQUÍ: Antes decía {cat.name}, ahora solo {cat}
      className="px-6 py-2.5 rounded-full border text-sm font-semibold whitespace-nowrap shadow-sm bg-orange-500/10 text-orange-400 border-orange-500/20 label-pills-base hover:brightness-110"
    >
      {cat} 
    </span>
  ))}
</div>
          </div>
          {/* ------------------------------------------------------------- */}

          {/* Aclaración Minimalista (Sin Recuadro) */}
          <div className="mt-16 text-center">
            <h3 className="text-sm font-semibold text-neutral-100 tracking-tight">
              Búsqueda de Profesionales
            </h3>
            <p className="text-xs text-neutral-500 font-medium max-w-xs mx-auto mt-2 leading-relaxed">
              Iniciá sesión o registrate para encontrar expertos calificados para el trabajo que necesites.
            </p>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;