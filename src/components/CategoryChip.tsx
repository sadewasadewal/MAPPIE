import React from "react";
import {
  Sparkles,
  Utensils,
  Coffee,
  BedDouble,
  Camera,
  ShoppingBag,
  Trees,
  Landmark,
} from "lucide-react";
import { PlaceCategory } from "@/types/place";

export const CATEGORY_ICONS: Record<PlaceCategory, React.ElementType> = {
  All: Sparkles,
  Restaurants: Utensils,
  Cafés: Coffee,
  Hotels: BedDouble,
  Attractions: Camera,
  Shopping: ShoppingBag,
  Nature: Trees,
  Landmarks: Landmark,
};

interface CategoryChipProps {
  category: PlaceCategory;
  isSelected: boolean;
  onSelect: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  category,
  isSelected,
  onSelect,
}) => {
  const Icon = CATEGORY_ICONS[category] || Sparkles;

  return (
    <button
      onClick={onSelect}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 14px",
        borderRadius: "var(--radius-pill)",
        fontSize: 13,
        fontWeight: isSelected ? 600 : 500,
        backgroundColor: isSelected ? "var(--light-blue)" : "var(--bg-surface)",
        color: isSelected ? "#ffffff" : "var(--text-primary)",
        border: isSelected ? "1px solid var(--light-blue)" : "1px solid var(--border-subtle)",
        boxShadow: isSelected
          ? "0 4px 12px rgba(14, 165, 233, 0.3)"
          : "0 2px 4px rgba(0, 0, 0, 0.03)",
        whiteSpace: "nowrap",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <Icon size={14} strokeWidth={isSelected ? 2.4 : 2} />
      <span>{category}</span>
    </button>
  );
};
