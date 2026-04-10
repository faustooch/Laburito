const defaultImage = '/caegories/otro.webp';
export const getCategoryImage = (categoryName) => {
  const images = {
    'Plomería': '/categories/plomeria.jpg',
    'Electricidad': '/categories/electricidad.jpg',
    'Carpintería': '/categories/carpinteria.jpg',
    'Jardinería': '/categories/jardineria.jpg',
    'Limpieza': '/categories/limpieza.jpg',
    'Albañilería': '/categories/albañileria.jpg',
    'Pintura': '/categories/pintura.webp',
    'Cerrajería': '/categories/cerrajeria.jpg',
    'Herrería': '/categories/herreria.jpg',
    'Reparación de PC': '/categories/reparacionPC.webp',
    'Refrigeración (Aires)': '/categories/Aires.jpg',
    'Fletes y Mudanzas' : '/categories/fletes.webp',
    'Otro': '/categories/otro.webp',
  };
    return images[categoryName] || defaultImage;
};


    