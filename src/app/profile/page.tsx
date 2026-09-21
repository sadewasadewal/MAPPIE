"use client";

import React from "react";
import {
  User,
  Bookmark,
  Folder,
  Sparkles,
  Utensils,
  Map,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ProfilePage() {
  const {
    allPlaces,
    savedItems,
    collections,
    userLocationStatus,
    requestLocation,
    preferredDietary,
    setPreferredDietary,
    mapStyleChoice,
    setMapStyleChoice,
  } = useApp();

  const handleDietaryChange = (val: string) => {
    setPreferredDietary(val);
    try {
      localStorage.setItem("mappie_dietary", val);
    } catch {
      // ignore
    }
  };

  const handleMapStyleChange = (val: string) => {
    setMapStyleChoice(val);
    try {
      localStorage.setItem("mappie_map_style", val);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="main-content"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        maxWidth: 640,
      }}
    >
      {/* User Header Profile */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          paddingTop: 12,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "var(--gradient-brand)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-accent)",
            color: "#ffffff",
          }}
        >
          <User size={44} strokeWidth={2.2} />
        </div>

        <div>
          <h2 className="title-large" style={{ color: "var(--text-primary)" }}>
            Traveler
          </h2>
          <span className="body-regular">
            Global Explorer & Food Connoisseur
          </span>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <div
          className="minimal-card"
          style={{
            padding: "16px 12px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Bookmark size={20} color="var(--light-blue)" />
          <span style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>
            {savedItems.length}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Saved</span>
        </div>

        <div
          className="minimal-card"
          style={{
            padding: "16px 12px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Folder size={20} color="var(--vibrant-orange)" />
          <span style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>
            {collections.length}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Collections</span>
        </div>

        <div
          className="minimal-card"
          style={{
            padding: "16px 12px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Sparkles size={20} color="var(--emerald-green)" />
          <span style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>
            {allPlaces.length}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Explored</span>
        </div>
      </div>

      {/* Preferences Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h3 className="title-small" style={{ color: "var(--text-primary)" }}>
          Travel Preferences
        </h3>

        <div className="minimal-card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Utensils size={18} color="var(--light-blue)" />
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                Cuisine Preference
              </span>
            </div>

            <select
              value={preferredDietary}
              onChange={(e) => handleDietaryChange(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "var(--bg-surface-secondary)",
                color: "var(--text-primary)",
                fontSize: 13,
                fontFamily: "inherit",
                fontWeight: 500,
                outline: "none",
              }}
            >
              <option value="All Cuisines">All Cuisines</option>
              <option value="Italian & French">Italian & French</option>
              <option value="Asian Fusion">Asian Fusion</option>
              <option value="Vegetarian">Vegetarian</option>
            </select>
          </div>

          <div style={{ height: 1, backgroundColor: "var(--border-subtle)" }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Map size={18} color="var(--light-blue)" />
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                Map Appearance
              </span>
            </div>

            <select
              value={mapStyleChoice}
              onChange={(e) => handleMapStyleChange(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "var(--bg-surface-secondary)",
                color: "var(--text-primary)",
                fontSize: 13,
                fontFamily: "inherit",
                fontWeight: 500,
                outline: "none",
              }}
            >
              <option value="Standard">Standard (Positron)</option>
              <option value="Satellite">Satellite (Imagery)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Location Services Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h3 className="title-small" style={{ color: "var(--text-primary)" }}>
          Location Services
        </h3>

        <div className="minimal-card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <MapPin size={18} color="var(--emerald-green)" />
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                Browser GPS Geolocation
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <CheckCircle2 size={16} color="var(--emerald-green)" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--emerald-green)" }}>
                {userLocationStatus === "active" ? "Active" : userLocationStatus === "denied" ? "Denied" : "Ready"}
              </span>
            </div>
          </div>

          {userLocationStatus !== "active" && (
            <button
              onClick={requestLocation}
              className="btn-primary"
              style={{ padding: "10px 16px", fontSize: 13 }}
            >
              Enable Precise Location
            </button>
          )}
        </div>
      </div>

      {/* About & Philosophy */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          textAlign: "center",
          padding: "20px 0 40px 0",
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 800, color: "var(--light-blue)" }}>
          MAPPIE
        </span>
        <span style={{ fontSize: 13, color: "var(--text-secondary)", fontStyle: "italic" }}>
          Discover a place → Understand it → Get there → Save it
        </span>
        <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
          Version 1.0 • Responsive Next.js Web App
        </span>
      </div>
    </div>
  );
}
