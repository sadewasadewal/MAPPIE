import React from "react";
import Image from "next/image";
import { Bookmark } from "lucide-react";
import { Place } from "@/types/place";
import { RatingBadge } from "./RatingBadge";

interface PlaceCardCompactProps {
  place: Place;
  isSaved: boolean;
  onSaveToggle: (e: React.MouseEvent) => void;
  onSelect: () => void;
}

export const PlaceCardCompact: React.FC<PlaceCardCompactProps> = ({
  place,
  isSaved,
  onSaveToggle,
  onSelect,
}) => {
  const priceString = "$".repeat(Math.max(1, Math.min(4, place.priceLevel)));

  return (
    <div
      onClick={onSelect}
      className="minimal-card"
      style={{
        width: 240,
        padding: 10,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* Image container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 145,
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          backgroundColor: "var(--bg-surface-secondary)",
        }}
      >
        <Image
          src={place.imageURLs[0] || ""}
          alt={place.name}
          fill
          sizes="240px"
          style={{ objectFit: "cover" }}
        />

        {/* Floating Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSaveToggle(e);
          }}
          aria-label={isSaved ? "Remove from saved" : "Save place"}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
            color: isSaved ? "var(--vibrant-orange)" : "#475569",
            transition: "transform 0.15s ease",
          }}
        >
          <Bookmark
            size={15}
            fill={isSaved ? "var(--vibrant-orange)" : "none"}
            strokeWidth={2.2}
          />
        </button>

        {/* Rating badge overlay */}
        <div style={{ position: "absolute", bottom: 8, left: 8 }}>
          <RatingBadge rating={place.rating} />
        </div>
      </div>

      {/* Place Details */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <h4
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "var(--text-primary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {place.name}
        </h4>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "var(--text-secondary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: "var(--light-blue)", fontWeight: 600 }}>
            {place.category}
          </span>
          <span>•</span>
          <span>{priceString}</span>
          {place.restaurantInfo?.cuisine && (
            <>
              <span>•</span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                {place.restaurantInfo.cuisine.split("&")[0]}
              </span>
            </>
          )}
        </div>

        <p
          style={{
            fontSize: 12,
            color: "var(--text-tertiary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {place.address}
        </p>
      </div>
    </div>
  );
};
