// src/components/ReviewList.jsx
import { useState } from 'react';
import { reviewService } from '../services/reviewService';

function ReviewItem({ review, currentUser, onDeleteSuccess }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // Nuevo estado para confirmación custom
  const [errorError, setErrorError] = useState('');

  const isOwner = currentUser && Number(currentUser.id) === Number(review.reviewer_id);

  const executeDelete = async () => {
    setIsDeleting(true);
    setErrorError('');
    try {
      await reviewService.deleteReview(review.id);
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (err) {
      setErrorError("No se pudo eliminar la reseña.");
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-neutral-800/50 bg-neutral-900/40 p-6 transition-all duration-300 hover:border-neutral-700/50 hover:bg-neutral-900/60 shadow-sm group">
      
      {/* Luz de fondo sutil */}
      <div className="absolute -right-10 -top-10 h-32 w-32 bg-slate-500/5 blur-3xl rounded-full pointer-events-none transition-colors group-hover:bg-slate-500/10" />

      {/* OVERLAY DE CONFIRMACIÓN CUSTOM */}
      {showConfirm && (
        <div className="absolute inset-0 z-20 bg-neutral-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 transition-all animate-in fade-in duration-200">
          {isDeleting ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-slate-500/30 border-t-slate-500 rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Eliminando...</span>
            </div>
          ) : (
            <>
              <p className="text-neutral-100 font-bold mb-4 tracking-tight">¿Eliminar esta reseña definitivamente?</p>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowConfirm(false)} 
                  className="px-5 py-2 bg-neutral-800 text-neutral-300 text-xs font-bold rounded-xl hover:bg-neutral-700 hover:text-white transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  onClick={executeDelete} 
                  className="px-5 py-2 bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Sí, eliminar
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-5">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-neutral-100 tracking-tight flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] text-neutral-400 uppercase font-black">
                {(review.reviewer_name || 'U').charAt(0)}
              </div>
              {review.reviewer_name || 'Usuario'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Botón de Eliminar (Solo si es dueño) */}
            {isOwner && !showConfirm && (
              <button 
                onClick={() => setShowConfirm(true)}
                className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Eliminar mi reseña"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}

            <div className="flex items-center gap-1.5 bg-neutral-950/80 px-3 py-1.5 rounded-xl border border-neutral-800/50 shadow-inner">
              <svg className="w-3.5 h-3.5 text-slate-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
              </svg>
              <span className="text-xs font-black text-neutral-200">{review.rating}.0</span>
            </div>
          </div>
        </div>

        <blockquote className="text-sm text-neutral-400 leading-relaxed font-normal relative">
          <span className="absolute -left-3 -top-2 text-4xl text-neutral-800 font-serif leading-none pointer-events-none select-none">"</span>
          <p className="relative z-10 pl-4">{review.comment}</p>
        </blockquote>

        {errorError && (
          <p className="mt-4 text-xs font-medium text-red-400 text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
            {errorError}
          </p>
        )}
      </div>
    </div>
  );
}

function ReviewList({ reviews, currentUser, onRefresh }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center justify-center text-center bg-neutral-900/20 rounded-3xl border border-dashed border-neutral-800/50">
        <div className="w-12 h-12 rounded-2xl bg-neutral-900/50 border border-neutral-800 flex items-center justify-center mb-4 text-neutral-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
        </div>
        <p className="text-sm text-neutral-500 font-medium">Este profesional todavía no recibió valoraciones.</p>
        <p className="text-xs text-neutral-600 mt-1">Sé el primero en contar tu experiencia.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5">
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