import type { Rating } from "./types";

export interface RatingDisplay {
  value: Rating;
  emoji: string;
  label: string;
}

export const RATINGS: RatingDisplay[] = [
  { value: 1, emoji: "😞", label: "Незадовільно" },
  { value: 2, emoji: "😐", label: "Задовільно" },
  { value: 3, emoji: "🙂", label: "Добре" },
  { value: 4, emoji: "😊", label: "Дуже добре" },
  { value: 5, emoji: "😁", label: "Відмінно" },
];

export function getRatingDisplay(rating: Rating): RatingDisplay {
  return RATINGS[rating - 1];
}

export function renderRatingCircles(rating: Rating): string {
  return "●".repeat(rating) + "○".repeat(5 - rating);
}
