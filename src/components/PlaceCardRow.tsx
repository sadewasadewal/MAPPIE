import React from "react";
import Image from "next/image";
import { Bookmark } from "lucide-react";
import { Place } from "@/types/place";
import { RatingBadge } from "./RatingBadge";

interface PlaceCardRowProps {
  place: Place;
  isSaved: boolean;
  onSaveToggle: (e: React.MouseEvent) => void;
  onSelect: () => void;
}

export const PlaceCardRow: React.FC<PlaceCardRowProps> = ({
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
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: 14,
        cursor: "pointer",
        width: "100%",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          position: "relative",
          width: 96,
          height: 96,
          flexShrink: 0,
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          backgroundColor: "var(--bg-surface-secondary)",
        }}
      >
        <Image
          src={place.imageURLs[0] || ""}
          alt={place.name}
          fill
          sizes="96px"
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <h4
              style={{
                fontSize: 16,
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
                marginTop: 2,
              }}
            >
              <span style={{ color: "var(--light-blue)", fontWeight: 600 }}>
                {place.category}
              </span>
              <span style={{ color: "var(--text-tertiary)" }}>•</span>
              <span style={{ color: "var(--text-secondary)" }}>{priceString}</span>
              {place.restaurantInfo?.cuisine && (
                <>
                  <span style={{ color: "var(--text-tertiary)" }}>•</span>
                  <span
                    style={{
                      color: "var(--text-secondary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {place.restaurantInfo.cuisine}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Bookmark button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSaveToggle(e);
            }}
            aria-label={isSaved ? "Saved" : "Save place"}
            style={{
              padding: 6,
              color: isSaved ? "var(--vibrant-orange)" : "var(--text-tertiary)",
              flexShrink: 0,
            }}
          >
            <Bookmark
              size={18}
              fill={isSaved ? "var(--vibrant-orange)" : "none"}
              strokeWidth={2}
            />
          </button>
        </div>

        {/* Short Editorial snippet */}
        <p
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginTop: 2,
          }}
        >
          {place.editorialDescription}
        </p>

        {/* Bottom meta: rating & open status */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
          <RatingBadge rating={place.rating} reviewCount={place.reviewCount} />
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: place.isOpen ? "var(--emerald-green)" : "var(--coral-red)",
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: place.isOpen ? "var(--emerald-green)" : "var(--coral-red)",
              }}
            >
              {place.isOpen ? "Open" : "Closed"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
