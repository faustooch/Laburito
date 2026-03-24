// src/components/WelcomeBanner.jsx
import { useAuth } from '../context/AuthContext';

function WelcomeBanner() {
  const { user } = useAuth();

  return (
    <section className="mb-10">
      <h1 className="text-3xl md:text-4xl font-bold text-neutral-50 mb-3 tracking-tight">
        Hola de nuevo, <span className="text-orange-500">{user?.nickname || 'usuario'}</span>
      </h1>
      <p className="text-neutral-400 text-sm md:text-base font-medium">
        ¿Qué necesitás resolver hoy? Encontrá a los mejores profesionales.
      </p>
    </section>
  );
}

export default WelcomeBanner;