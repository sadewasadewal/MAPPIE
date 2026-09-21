"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Search, X, Navigation, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { CategoryChip } from "@/components/CategoryChip";
import { PlacePreviewSheet } from "@/components/Map/PlacePreviewSheet";
import { Place, PlaceCategory } from "@/types/place";

// Dynamically import Leaflet Map to avoid SSR issues
const InteractiveMap = dynamic(
  () => import("@/components/Map/InteractiveMap").then((mod) => mod.InteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          backgroundColor: "var(--bg-primary)",
        }}
      >
        <Loader2 size={36} color="var(--light-blue)" className="spinner" />
        <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>
          Loading interactive map...
        </span>
      </div>
    ),
  }
);

const CATEGORIES: PlaceCategory[] = [
  "All",
  "Restaurants",
  "Cafés",
  "Hotels",
  "Attractions",
  "Shopping",
  "Nature",
  "Landmarks",
];

export default function MapPage() {
  const {
    filteredPlaces,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    userCoordinate,
    requestLocation,
    setSelectedPlace,
    setDirectionsPlace,
    activeRoute,
    mapStyleChoice,
  } = useApp();

  const [previewPlace, setPreviewPlace] = useState<Place | null>(filteredPlaces[0] || null);

  const handleSelectPlace = (place: Place) => {
    setPreviewPlace(place);
  };

  const handleRecenter = () => {
    requestLocation();
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "calc(100vh - 65px)", overflow: "hidden" }}>
      {/* Interactive Map Component */}
      <InteractiveMap
        places={filteredPlaces}
        selectedPlace={previewPlace}
        onSelectPlace={handleSelectPlace}
        userCoordinate={userCoordinate}
        activeRoute={activeRoute}
        mapStyleChoice={mapStyleChoice}
        onRecenter={handleRecenter}
      />

      {/* Floating Top Controls: Search Bar & Category Chips */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          right: 16,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          maxWidth: 640,
          margin: "0 auto",
          pointerEvents: "none",
        }}
      >
        {/* Search Bar */}
        <div
          className="glass-card"
          style={{
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-floating)",
          }}
        >
          <Search size={17} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search places, cuisines, hotels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              background: "none",
              outline: "none",
              fontSize: 14,
              color: "var(--text-primary)",
              fontFamily: "inherit",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{ color: "var(--text-tertiary)", cursor: "pointer", display: "flex" }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Category Scroller */}
        <div
          className="horizontal-scroll"
          style={{
            pointerEvents: "auto",
            paddingBottom: 4,
          }}
        >
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat}
              category={cat}
              isSelected={selectedCategory === cat}
              onSelect={() => setSelectedCategory(cat)}
            />
          ))}
        </div>
      </div>

      {/* Floating Recenter GPS Button */}
      <div
        style={{
          position: "absolute",
          right: 20,
          bottom: previewPlace ? 200 : 90,
          zIndex: 1000,
          transition: "bottom 0.3s ease",
        }}
        className="recenter-btn-container"
      >
        <button
          onClick={handleRecenter}
          aria-label="Recenter on my location"
          className="glass-card"
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--light-blue)",
            boxShadow: "var(--shadow-floating)",
            cursor: "pointer",
          }}
        >
          <Navigation size={20} />
        </button>
      </div>

      {/* Floating Place Preview Bottom Sheet */}
      {previewPlace && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 16,
            right: 16,
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
          }}
          className="preview-sheet-container"
        >
          <div style={{ pointerEvents: "auto", width: "100%", maxWidth: 520 }}>
            <PlacePreviewSheet
              place={previewPlace}
              onDetails={() => setSelectedPlace(previewPlace)}
              onDirections={() => setDirectionsPlace(previewPlace)}
              onClose={() => setPreviewPlace(null)}
            />
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (min-width: 768px) {
          .preview-sheet-container {
            bottom: 24px !important;
          }
          .recenter-btn-container {
            bottom: ${previewPlace ? "160px" : "32px"} !important;
          }
        }
      `}</style>
    </div>
  );
}
