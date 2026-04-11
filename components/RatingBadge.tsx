import { getRatingDisplay, renderRatingCircles } from "@/lib/rating";
import type { Rating } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RatingBadgeProps {
  rating: Rating;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showCircles?: boolean;
  className?: string;
}

export function RatingBadge({
  rating,
  size = "sm",
  showLabel = false,
  showCircles = false,
  className,
}: RatingBadgeProps) {
  const { emoji, label } = getRatingDisplay(rating);

  const emojiSize = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl",
  }[size];

  const labelSize = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  }[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={emojiSize} aria-hidden>
        {emoji}
      </span>
      {showLabel && (
        <span className={cn("font-bold text-foreground", labelSize)}>
          {label}
        </span>
      )}
      {showCircles && (
        <span
          className="font-mono tracking-wider text-brand-gold text-lg"
          aria-label={`${rating} з 5`}
        >
          {renderRatingCircles(rating)}
        </span>
      )}
    </div>
  );
}
