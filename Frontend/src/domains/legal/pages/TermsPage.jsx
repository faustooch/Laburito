// src/pages/TermsPage.jsx
import { useState, useEffect } from 'react';
import Header from '../../../shared/components/Header';
import Footer from '../../../shared/components/Footer';

function TermsPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Scroll al top al cargar la página
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 overflow-x-hidden">
      <Header />

      <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-12 lg:py-20">
        <div 
          className={`transform transition-all duration-700 ease-out ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-neutral-50 tracking-tight mb-4">
              Términos y <span className="text-slate-500">Condiciones</span>
            </h1>
            <p className="text-neutral-400">Última actualización: {new Date().toLocaleDateString('es-AR')}</p>
          </div>

          <div className="space-y-8 text-neutral-300 leading-relaxed text-sm md:text-base">
            
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Naturaleza de la Plataforma</h2>
              <p>
                <strong>Laburito</strong> opera exclusivamente como una plataforma tecnológica de intermediación. 
                Nuestra función es facilitar el contacto entre usuarios que ofrecen servicios ("Profesionales") y 
                usuarios que los requieren ("Clientes"). En ningún caso Laburito actúa como empleador, contratista, 
                agente o representante de los Profesionales. 
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Inexistencia de Relación Laboral</h2>
              <p>
                Los presentes términos no crean relación societaria, de mandato, franquicia ni vínculo laboral alguno 
                (en los términos de la Ley de Contrato de Trabajo N° 20.744 y sus modificatorias) entre Laburito y el Profesional. 
                Los Profesionales prestan sus servicios de manera autónoma, independiente y bajo su propio riesgo, 
                utilizando sus propias herramientas y definiendo sus propios horarios y tarifas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Responsabilidad sobre los Servicios</h2>
              <p>
                Laburito no participa en la negociación, perfeccionamiento ni ejecución de los contratos de locación 
                de obra o servicios celebrados entre Clientes y Profesionales (Art. 1251 del Código Civil y Comercial de la Nación). 
                Por lo tanto, la plataforma no garantiza la calidad, seguridad, idoneidad ni la legalidad de los servicios 
                ofrecidos, eximiéndose de toda responsabilidad por daños o perjuicios derivados de los mismos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Sistema de Reseñas y Comportamiento</h2>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Los Clientes se comprometen a dejar reseñas veraces, objetivas y respetuosas basadas en su experiencia real.</li>
                <li>Laburito se reserva el derecho de eliminar comentarios que contengan insultos, discriminación, información personal o que violen las normas de la comunidad.</li>
                <li>El uso de lenguaje ofensivo o el acoso a otros usuarios resultará en la suspensión inmediata y permanente de la cuenta.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Uso de Datos Personales</h2>
              <p>
                El tratamiento de los datos personales se realiza en estricto cumplimiento con la Ley de Protección de los 
                Datos Personales (Ley N° 25.326) de la República Argentina. Los usuarios consienten que Laburito utilice 
                sus datos exclusivamente para los fines operativos de la plataforma.
              </p>
            </section>

            <div className="mt-12 p-6 bg-neutral-900/50 border border-neutral-800 rounded-xl">
              <p className="text-sm text-neutral-400 italic">
                El acceso y uso de esta plataforma implica la aceptación expresa, plena y sin reservas de todos los 
                términos y condiciones aquí descritos. Si no está de acuerdo con estos términos, le solicitamos que 
                se abstenga de utilizar Laburito.
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default TermsPage;