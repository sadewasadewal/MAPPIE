import React from "react";
import { Star } from "lucide-react";

interface RatingBadgeProps {
  rating: number;
  reviewCount?: number;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({ rating, reviewCount }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 8px",
        background: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: "var(--radius-pill)",
        border: "1px solid rgba(0, 0, 0, 0.06)",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Star size={12} fill="var(--star-gold)" stroke="none" />
      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 400 }}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
