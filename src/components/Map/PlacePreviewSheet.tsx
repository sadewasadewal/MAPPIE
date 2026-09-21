import React from "react";
import Image from "next/image";
import { X, Navigation, Info } from "lucide-react";
import { Place } from "@/types/place";
import { RatingBadge } from "@/components/RatingBadge";

interface PlacePreviewSheetProps {
  place: Place;
  onDetails: () => void;
  onDirections: () => void;
  onClose: () => void;
}

export const PlacePreviewSheet: React.FC<PlacePreviewSheetProps> = ({
  place,
  onDetails,
  onDirections,
  onClose,
}) => {
  const priceString = "$".repeat(Math.max(1, Math.min(4, place.priceLevel)));

  return (
    <div
      className="glass-card"
      style={{
        width: "100%",
        maxWidth: 520,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        backgroundColor: "var(--bg-glass)",
        boxShadow: "0 12px 36px rgba(0, 0, 0, 0.22)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Photo Thumbnail */}
        <div
          style={{
            position: "relative",
            width: 76,
            height: 76,
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            flexShrink: 0,
            backgroundColor: "var(--bg-surface-secondary)",
          }}
        >
          <Image
            src={place.imageURLs[0] || ""}
            alt={place.name}
            fill
            sizes="76px"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Place Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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

            <button
              onClick={onClose}
              style={{
                color: "var(--text-tertiary)",
                padding: 4,
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>
          </div>

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
            <RatingBadge rating={place.rating} />
            <span style={{ color: "var(--text-tertiary)" }}>•</span>
            <span style={{ color: "var(--text-secondary)" }}>{priceString}</span>
          </div>

          <p
            style={{
              fontSize: 12,
              color: "var(--text-tertiary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginTop: 4,
            }}
          >
            {place.address}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button
          onClick={onDetails}
          className="btn-secondary"
          style={{ padding: "10px 14px", fontSize: 13 }}
        >
          <Info size={15} color="var(--light-blue)" />
          <span>Explore Details</span>
        </button>

        <button
          onClick={onDirections}
          className="btn-orange"
          style={{ padding: "10px 14px", fontSize: 13 }}
        >
          <Navigation size={15} />
          <span>Directions</span>
        </button>
      </div>
    </div>
  );
};
