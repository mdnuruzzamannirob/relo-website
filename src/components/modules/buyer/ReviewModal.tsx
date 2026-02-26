'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Star, Loader2 } from 'lucide-react';
import { useWriteReviewMutation } from '@/store/apis/orderApi';
import { cn } from '@/lib/utils/cn';
import { Textarea } from '@/components/ui/textarea';

interface ReviewModalProps {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReviewModal({ orderId, open, onOpenChange }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [writeReview, { isLoading }] = useWriteReviewMutation();

  const handleSubmit = async () => {
    if (rating === 0) {
      return;
    }

    try {
      await writeReview({ orderId, rating, review }).unwrap();
      // Reset form
      setRating(0);
      setReview('');
      onOpenChange(false);
    } catch (error) {
      // Error handled by RTK Query onQueryStarted
    }
  };

  const handleCancel = () => {
    setRating(0);
    setReview('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating Stars */}
          <div className="space-y-2">
            <Label htmlFor="rating">Rating *</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={cn(
                      'h-8 w-8 transition-colors',
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300',
                    )}
                  />
                </button>
              ))}
              <span className="text-muted-foreground ml-2 text-sm">
                {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
              </span>
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="review">Review (Optional)</Label>
            <Textarea
              id="review"
              placeholder="Share your experience with this product..."
              value={review}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReview(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || rating === 0}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
