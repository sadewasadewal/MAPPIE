"use client";

import React, { useState } from "react";
import { Bookmark, Plus, Sparkles, Heart, Coffee, Folder } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { PlaceCardRow } from "@/components/PlaceCardRow";

const COLLECTION_ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Heart,
  Coffee,
  Bookmark,
  Folder,
};

export default function SavedPage() {
  const {
    collections,
    savedItems,
    isSaved,
    toggleSave,
    getSavedPlacesForCollection,
    setSelectedPlace,
    setIsNewCollectionOpen,
  } = useApp();

  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  const displayedPlaces = getSavedPlacesForCollection(selectedCollectionId);

  return (
    <div className="main-content" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Page Header & Collections Scroller */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 className="title-large" style={{ color: "var(--text-primary)" }}>
              Saved
            </h1>
            <span className="body-regular">
              Personal collections & saved destinations
            </span>
          </div>

          <button
            onClick={() => setIsNewCollectionOpen(true)}
            className="btn-orange"
            style={{ padding: "8px 16px", borderRadius: "var(--radius-pill)", fontSize: 13 }}
          >
            <Plus size={16} />
            <span>New Collection</span>
          </button>
        </div>

        {/* Collections Filter Scroller */}
        <div className="horizontal-scroll" style={{ paddingBottom: 4 }}>
          {/* All Saved */}
          <button
            onClick={() => setSelectedCollectionId(null)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: "var(--radius-pill)",
              fontSize: 13,
              fontWeight: selectedCollectionId === null ? 700 : 500,
              backgroundColor:
                selectedCollectionId === null ? "var(--vibrant-orange)" : "var(--bg-surface)",
              color: selectedCollectionId === null ? "#ffffff" : "var(--text-primary)",
              border:
                selectedCollectionId === null
                  ? "1px solid var(--vibrant-orange)"
                  : "1px solid var(--border-subtle)",
              boxShadow:
                selectedCollectionId === null ? "var(--shadow-orange)" : "var(--shadow-soft)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <Bookmark size={14} />
            <span>All Saved ({savedItems.length})</span>
          </button>

          {/* User Collections */}
          {collections.map((col) => {
            const isSelected = selectedCollectionId === col.id;
            const count = savedItems.filter((s) => s.collectionId === col.id).length;
            const Icon = COLLECTION_ICON_MAP[col.iconName] || Folder;

            return (
              <button
                key={col.id}
                onClick={() => setSelectedCollectionId(col.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: "var(--radius-pill)",
                  fontSize: 13,
                  fontWeight: isSelected ? 700 : 500,
                  backgroundColor: isSelected ? col.colorHex || "var(--vibrant-orange)" : "var(--bg-surface)",
                  color: isSelected ? "#ffffff" : "var(--text-primary)",
                  border: isSelected
                    ? `1px solid ${col.colorHex || "var(--vibrant-orange)"}`
                    : "1px solid var(--border-subtle)",
                  boxShadow: isSelected ? "var(--shadow-soft)" : "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={14} />
                <span>
                  {col.name} ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Saved Places List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {displayedPlaces.length === 0 ? (
          <div
            className="minimal-card"
            style={{
              padding: "64px 24px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Bookmark size={44} color="var(--text-tertiary)" />
            <h3 className="title-small" style={{ color: "var(--text-primary)" }}>
              No saved places in this collection
            </h3>
            <p className="body-regular" style={{ maxWidth: 360 }}>
              Explore restaurants, boutique hotels, and scenic landmarks to save them to your trip collections.
            </p>
          </div>
        ) : (
          displayedPlaces.map((place) => (
            <PlaceCardRow
              key={place.id}
              place={place}
              isSaved={isSaved(place.id)}
              onSaveToggle={() => toggleSave(place.id)}
              onSelect={() => setSelectedPlace(place)}
            />
          ))
        )}
      </div>
    </div>
  );
}
