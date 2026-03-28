// src/components/ReviewForm.jsx
import { useState } from 'react';
import { reviewService } from '../services/reviewService';

function ReviewForm({ workerId, onReviewSuccess, onCancel }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  // Estados de feedback idénticos a ProfilePage
  const [isSaving, setIsSaving] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await reviewService.createReview(workerId, { rating, comment });
      
      setIsSaving(false);
      setShowCheck(true);

      // Esperamos el feedback visual antes de cerrar
      setTimeout(() => {
        setComment('');
        setRating(5);
        setShowCheck(false);
        if (onReviewSuccess) onReviewSuccess();
      }, 1500);

    } catch (err) {
      setIsSaving(false);
      setError(err.response?.data?.detail || "Error al enviar la reseña.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-3">
        <h3 className="text-sm font-semibold text-neutral-100">Dejar una opinión</h3>
        
        {/* Selector de Estrellas Puntiagudas */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={isSaving || showCheck}
              onClick={() => setRating(star)}
              className="cursor-pointer transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
            >
              <svg 
                className={`w-5 h-5 transition-colors ${
                  star <= rating 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-transparent stroke-yellow-400 hover:stroke-yellow-300'
                }`} 
                viewBox="0 0 24 24"
                strokeWidth="1.2"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-neutral-500 mb-1 pl-1">Comentario del servicio</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isSaving || showCheck}
          placeholder="Contale a otros usuarios tu experiencia..."
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 transition focus:outline-none focus:border-slate-500 min-h-[100px] resize-none disabled:opacity-50"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-neutral-800/50">
        <div className="flex-grow">
          {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving || showCheck}
            className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSaving || showCheck}
            className={`min-w-[140px] text-white text-sm font-semibold px-6 py-2 rounded-lg transition shadow-sm cursor-pointer flex items-center justify-center gap-2 
              ${showCheck ? 'bg-green-600' : 'bg-slate-600 hover:bg-slate-500'} 
              disabled:opacity-70`}
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : showCheck ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg> 
                Guardado
              </>
            ) : (
              'Publicar Reseña'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export default ReviewForm;