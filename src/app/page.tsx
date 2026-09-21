"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { CategoryChip } from "@/components/CategoryChip";
import { PlaceCardCompact } from "@/components/PlaceCardCompact";
import { PlaceCardRow } from "@/components/PlaceCardRow";
import { PlaceCategory } from "@/types/place";

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

export default function ExplorePage() {
  const {
    allPlaces,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredPlaces,
    isSaved,
    toggleSave,
    setSelectedPlace,
  } = useApp();

  const isSearching = searchQuery.trim().length > 0 || selectedCategory !== "All";

  // Filtered collections for editorial carousels
  const popularTonight = allPlaces.filter((p) => p.rating >= 4.8);
  const hiddenGems = allPlaces.filter((p) =>
    p.atmosphereTags.some((t) =>
      t.includes("Quiet") || t.includes("Minimalist") || t.includes("Boutique")
    )
  );
  const greatForDinner = allPlaces.filter((p) => p.category === "Restaurants");
  const staysAndEscapes = allPlaces.filter((p) => p.category === "Hotels");

  return (
    <div className="main-content" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Top Search Bar */}
      <div
        className="glass-card"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <Search size={18} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search places, cuisines, hotels, landmarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            border: "none",
            background: "none",
            outline: "none",
            fontSize: 15,
            color: "var(--text-primary)",
            fontFamily: "inherit",
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            style={{ color: "var(--text-tertiary)", cursor: "pointer", display: "flex" }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category Filter Pills Scroller */}
      <div className="horizontal-scroll" style={{ paddingBottom: 4 }}>
        {CATEGORIES.map((category) => (
          <CategoryChip
            key={category}
            category={category}
            isSelected={selectedCategory === category}
            onSelect={() => setSelectedCategory(category)}
          />
        ))}
      </div>

      {/* Dynamic Content */}
      {isSearching ? (
        // Search & Category Filter Results View
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div>
              <h2 className="title-medium" style={{ color: "var(--text-primary)" }}>
                Results
              </h2>
              <span className="body-regular">
                {filteredPlaces.length} places found
              </span>
            </div>

            {(searchQuery || selectedCategory !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                style={{ fontSize: 13, fontWeight: 600, color: "var(--light-blue)", cursor: "pointer" }}
              >
                Reset filters
              </button>
            )}
          </div>

          {filteredPlaces.length === 0 ? (
            <div
              className="minimal-card"
              style={{
                padding: "60px 24px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Search size={40} color="var(--text-tertiary)" />
              <h3 className="title-small" style={{ color: "var(--text-primary)" }}>
                No places found
              </h3>
              <p className="body-regular" style={{ maxWidth: 360 }}>
                Try searching for a different keyword, cuisine, or clear your category filter.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {filteredPlaces.map((place) => (
                <PlaceCardRow
                  key={place.id}
                  place={place}
                  isSaved={isSaved(place.id)}
                  onSaveToggle={() => toggleSave(place.id)}
                  onSelect={() => setSelectedPlace(place)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        // Editorial Recommendations Carousels
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* 1. Popular Tonight */}
          <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <h2 className="title-medium" style={{ color: "var(--text-primary)" }}>
                Popular Tonight
              </h2>
              <p className="body-regular">
                Top rated places in high demand right now
              </p>
            </div>

            <div className="horizontal-scroll">
              {popularTonight.map((place) => (
                <PlaceCardCompact
                  key={place.id}
                  place={place}
                  isSaved={isSaved(place.id)}
                  onSaveToggle={() => toggleSave(place.id)}
                  onSelect={() => setSelectedPlace(place)}
                />
              ))}
            </div>
          </section>

          {/* 2. Hidden Gems */}
          <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <h2 className="title-medium" style={{ color: "var(--text-primary)" }}>
                Hidden Gems
              </h2>
              <p className="body-regular">
                Unique atmospheres, quiet spots, and bespoke design
              </p>
            </div>

            <div className="horizontal-scroll">
              {hiddenGems.map((place) => (
                <PlaceCardCompact
                  key={place.id}
                  place={place}
                  isSaved={isSaved(place.id)}
                  onSaveToggle={() => toggleSave(place.id)}
                  onSelect={() => setSelectedPlace(place)}
                />
              ))}
            </div>
          </section>

          {/* 3. Great for Dinner */}
          <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <h2 className="title-medium" style={{ color: "var(--text-primary)" }}>
                Great for Dinner
              </h2>
              <p className="body-regular">
                Chef-driven menus, romantic terraces, and fine cuisine
              </p>
            </div>

            <div className="horizontal-scroll">
              {greatForDinner.map((place) => (
                <PlaceCardCompact
                  key={place.id}
                  place={place}
                  isSaved={isSaved(place.id)}
                  onSaveToggle={() => toggleSave(place.id)}
                  onSelect={() => setSelectedPlace(place)}
                />
              ))}
            </div>
          </section>

          {/* 4. Stays & Escapes */}
          <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <h2 className="title-medium" style={{ color: "var(--text-primary)" }}>
                Stays & Escapes
              </h2>
              <p className="body-regular">
                Boutique villas, colonial sanctuaries, and private suites
              </p>
            </div>

            <div className="horizontal-scroll">
              {staysAndEscapes.map((place) => (
                <PlaceCardCompact
                  key={place.id}
                  place={place}
                  isSaved={isSaved(place.id)}
                  onSaveToggle={() => toggleSave(place.id)}
                  onSelect={() => setSelectedPlace(place)}
                />
              ))}
            </div>
          </section>

          {/* 5. All Destinations */}
          <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <h2 className="title-medium" style={{ color: "var(--text-primary)" }}>
                All Destinations
              </h2>
              <p className="body-regular">
                Curated selections around Sri Lanka
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {allPlaces.map((place) => (
                <PlaceCardRow
                  key={place.id}
                  place={place}
                  isSaved={isSaved(place.id)}
                  onSaveToggle={() => toggleSave(place.id)}
                  onSelect={() => setSelectedPlace(place)}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
