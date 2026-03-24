// src/components/Footer.jsx
function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8 text-center">
        <p className="text-sm text-neutral-500">
          &copy; {year} Laburito. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;