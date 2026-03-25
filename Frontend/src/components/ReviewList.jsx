// src/components/ReviewList.jsx
import { useState } from 'react';
import { reviewService } from '../services/reviewService';

function ReviewItem({ review, currentUser, onDeleteSuccess }) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Verificamos si la reseña pertenece al usuario logueado
  console.log("Yo soy:", currentUser?.id, "Autor review:", review.reviewer_id);
  
  const isOwner = currentUser && Number(currentUser.id) === Number(review.reviewer_id);
  console.log("¿Es dueño?:", isOwner);

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que querés eliminar tu reseña?")) return;
    
    setIsDeleting(true);
    try {
      await reviewService.deleteReview(review.id);
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (err) {
      alert("No se pudo eliminar la reseña");
      setIsDeleting(false);
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 p-6 transition-all duration-300 hover:border-neutral-700 shadow-sm ${isDeleting ? 'opacity-50 grayscale' : ''}`}>
      <div className="absolute -right-4 -top-4 h-16 w-16 bg-orange-500/5 blur-2xl" />

      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-neutral-100 tracking-tight">
            {review.reviewer_name || 'Usuario'}
          </span>
          <div className="h-0.5 w-4 bg-orange-500/40 mt-1 rounded-full" />
        </div>

        <div className="flex items-center gap-3">
          {/* Botón de Eliminar (Solo si es dueño) */}
          {isOwner && (
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
              title="Eliminar mi reseña"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-neutral-950/60 px-2.5 py-1 rounded-lg border border-neutral-800/50">
            <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
            </svg>
            <span className="text-xs font-black text-yellow-400">{review.rating}.0</span>
          </div>
        </div>
      </div>

      <blockquote className="text-sm text-neutral-400 leading-relaxed italic font-light">
        <span className="text-neutral-600 text-lg font-serif mr-1">“</span>
        {review.comment}
        <span className="text-neutral-600 text-lg font-serif ml-1">”</span>
      </blockquote>
    </div>
  );
}

function ReviewList({ reviews, currentUser, onRefresh }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-16 text-center bg-neutral-900/10 rounded-2xl border border-dashed border-neutral-800/50">
        <p className="text-sm text-neutral-600 italic font-light">Este profesional todavía no recibió valoraciones.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {reviews.map((rev) => (
        <ReviewItem 
          key={rev.id} 
          review={rev} 
          currentUser={currentUser} 
          onDeleteSuccess={onRefresh}
        />
      ))}
    </div>
  );
}

export default ReviewList;