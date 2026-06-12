'use client';

import { useState, useEffect } from 'react';
import { Star, Send, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Review {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ReviewSection({ spotId }: { spotId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/reviews?spotId=${spotId}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setReviews(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [spotId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spotId, rating, comment }),
      });

      if (res.ok) {
        const newReview = await res.json();
        setReviews([newReview, ...reviews]);
        setRating(0);
        setComment('');
      }
    } catch {} finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">
        Avaliações ({reviews.length})
      </h2>

      {/* Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5"
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    star <= (hoverRating || rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Conte sua experiência..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            disabled={!rating || !comment.trim() || submitting}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Enviar
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
          <a href="/login" className="text-teal-600 font-medium hover:underline">Faça login</a> para deixar sua avaliação.
        </p>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 text-teal-600 animate-spin" /></div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">Nenhuma avaliação ainda. Seja o primeiro!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 text-xs font-bold">
                    {review.userName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{review.userName}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
              <p className="mt-1 text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
