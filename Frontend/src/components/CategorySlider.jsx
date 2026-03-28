// src/components/CategorySlider.jsx
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCard from './CategoryCard';

function CategorySlider({ professions }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // Refs para unificar las físicas del scroll
  const targetScroll = useRef(0);
  const isScrolling = useRef(false);
  const animationFrameId = useRef(null);

  // Refs para el drag-to-scroll
  const isDragging = useRef(false);
  const startX = useRef(0);
  const initialScrollLeft = useRef(0);
  const hasDragged = useRef(false);

  // 1. Motor físico del scroll suave
  const startSmoothScroll = () => {
    if (isScrolling.current) return;
    isScrolling.current = true;

    const smoothScroll = () => {
      if (!scrollRef.current || isDragging.current) {
        isScrolling.current = false;
        return;
      }

      const slider = scrollRef.current;
      slider.scrollLeft += (targetScroll.current - slider.scrollLeft) * 0.08;

      if (Math.abs(targetScroll.current - slider.scrollLeft) > 1) {
        animationFrameId.current = requestAnimationFrame(smoothScroll);
      } else {
        isScrolling.current = false;
      }
    };

    animationFrameId.current = requestAnimationFrame(smoothScroll);
  };

  // 2. Control de la Ruedita del Mouse
  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    targetScroll.current = slider.scrollLeft;

    const handleWheel = (e) => {
      if (e.deltaX !== 0) return; // Permitimos scroll horizontal de trackpads

      if (e.deltaY !== 0) {
        e.preventDefault(); 
        
        targetScroll.current += e.deltaY * 1.5;

        const maxScroll = slider.scrollWidth - slider.clientWidth;
        targetScroll.current = Math.max(0, Math.min(targetScroll.current, maxScroll));

        startSmoothScroll();
      }
    };

    slider.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      slider.removeEventListener('wheel', handleWheel);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  // 3. Eventos para Arrastrar (Drag to Scroll)
  const handleMouseDown = (e) => {
    const slider = scrollRef.current;
    isDragging.current = true;
    hasDragged.current = false; 
    startX.current = e.pageX - slider.offsetLeft;
    initialScrollLeft.current = slider.scrollLeft;
    
    // Frenamos la animación suave si estaba corriendo
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      isScrolling.current = false;
    }
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) {
      targetScroll.current = scrollRef.current.scrollLeft;
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    
    const slider = scrollRef.current;
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX.current) * 2; 
    
    if (Math.abs(walk) > 10) {
      hasDragged.current = true; 
    }

    slider.scrollLeft = initialScrollLeft.current - walk;
    targetScroll.current = slider.scrollLeft;
  };

  // 4. Botones Laterales conectados a la misma física
  const scroll = (direction) => {
    const slider = scrollRef.current;
    const scrollAmount = 350;
    
    if (direction === 'left') {
      targetScroll.current -= scrollAmount;
    } else {
      targetScroll.current += scrollAmount;
    }

    const maxScroll = slider.scrollWidth - slider.clientWidth;
    targetScroll.current = Math.max(0, Math.min(targetScroll.current, maxScroll));
    
    startSmoothScroll();
  };

  // 5. Navegación protegida
  const handleCategoryClick = (professionName, e) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      return; 
    }
    navigate(`/search?profession=${encodeURIComponent(professionName)}`);
  };

  return (
    <section className="mb-16 relative">
      <div className="flex items-end justify-between mb-10 px-4">
        <div>
          <h3 className="text-3xl md:text-4xl font-black text-neutral-50 tracking-tight leading-none mb-2">
            Explorar por <span className="text-orange-500">Rubro</span>
          </h3>
          <p className="text-neutral-500 text-sm md:text-base font-medium">
            Encontrá al trabajador ideal para tu necesidad
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => scroll('left')} 
            className="w-12 h-12 flex items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-orange-500 hover:bg-neutral-800 hover:border-orange-500/50 transition-all cursor-pointer shadow-sm active:scale-95"
            aria-label="Anterior categoría"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button 
            onClick={() => scroll('right')} 
            className="w-12 h-12 flex items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-orange-500 hover:bg-neutral-800 hover:border-orange-500/50 transition-all cursor-pointer shadow-sm active:scale-95"
            aria-label="Siguiente categoría"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="relative -mx-4">
        {/* Degradados de los bordes suavizados */}
        <div className="absolute top-0 bottom-0 left-0 w-8 md:w-12 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-8 md:w-12 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none"></div>

        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          // LA CLAVE: pt-6 y -mt-6 generan el espacio invisible hacia arriba.
          // px-4 mantiene las tarjetas despegadas de los bordes de la pantalla.
          className="flex gap-6 overflow-x-auto pt-6 -mt-6 pb-12 px-4 select-none cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {professions.map((cat) => (
            <CategoryCard 
              key={cat.id} 
              category={cat} 
              onClick={(name) => handleCategoryClick(name, window.event)} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySlider;