// src/components/ReviewForm.jsx
import { useState } from 'react';
import { reviewService } from '../services/reviewService';

function ReviewForm({ workerId, onReviewSuccess, onCancel }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
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
    // CORRECCIÓN: Le damos el estilo de tarjeta directamente al form
    <form onSubmit={handleSubmit} className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-inner relative overflow-hidden transition-all hover:border-neutral-700/50">
      
      {/* Luz de acento sutil */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-500/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/50 pb-4">
          <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-widest">Dejar una opinión</h3>
          
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
                  className={`w-6 h-6 transition-colors ${
                    star <= rating 
                      ? 'text-yellow-400 fill-current drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]' 
                      : 'text-transparent stroke-yellow-400/50 hover:stroke-yellow-400'
                  }`} 
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-neutral-500 uppercase tracking-tighter pl-1">Tu experiencia</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSaving || showCheck}
            placeholder="Contale a otros clientes qué te pareció el servicio..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 transition-all focus:outline-none focus:border-slate-500 focus:bg-neutral-900/80 min-h-[120px] resize-none disabled:opacity-50"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex-grow w-full sm:w-auto">
            {error && (
              <p className="text-xs font-medium text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20 text-center sm:text-left">
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving || showCheck}
              className="px-5 py-2.5 text-sm font-bold text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-all cursor-pointer disabled:opacity-50 w-full sm:w-auto text-center"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSaving || showCheck}
              className={`min-w-[150px] w-full sm:w-auto text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-95
                ${showCheck ? 'bg-green-600' : 'bg-slate-600 hover:bg-slate-500'} 
                disabled:opacity-70 disabled:active:scale-100`}
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : showCheck ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg> 
                  Publicado
                </>
              ) : (
                'Publicar Reseña'
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default ReviewForm;