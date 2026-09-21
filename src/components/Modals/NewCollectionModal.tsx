"use client";

import React, { useState } from "react";
import { X, FolderPlus } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const NewCollectionModal: React.FC = () => {
  const { isNewCollectionOpen, setIsNewCollectionOpen, addCollection } = useApp();
  const [collectionName, setCollectionName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#0EA5E9");

  if (!isNewCollectionOpen) return null;

  const colorOptions = [
    "#0EA5E9", // Sky Blue
    "#F97316", // Tangerine Orange
    "#FB923C", // Warm Peach
    "#10B981", // Emerald
    "#8B5CF6", // Violet
    "#EC4899", // Pink
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (collectionName.trim()) {
      addCollection(collectionName.trim(), "Bookmark", selectedColor);
      setCollectionName("");
      setIsNewCollectionOpen(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2200,
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={() => setIsNewCollectionOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: 440,
          backgroundColor: "var(--bg-surface)",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: "rgba(249, 115, 22, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--vibrant-orange)",
              }}
            >
              <FolderPlus size={18} />
            </div>
            <h3 className="title-small" style={{ color: "var(--text-primary)" }}>
              New Collection
            </h3>
          </div>

          <button
            onClick={() => setIsNewCollectionOpen(false)}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: "var(--bg-surface-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-secondary)",
            }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: 6,
              }}
            >
              Collection Title
            </label>
            <input
              type="text"
              placeholder="e.g. Summer Escapes, Coffee Crawl"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              autoFocus
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "var(--bg-surface-secondary)",
                color: "var(--text-primary)",
                fontSize: 14,
                fontFamily: "inherit",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: 8,
              }}
            >
              Accent Color
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: color,
                    border: selectedColor === color ? "3px solid #ffffff" : "none",
                    boxShadow: selectedColor === color ? `0 0 0 2px ${color}` : "none",
                    cursor: "pointer",
                    transition: "transform 0.15s ease",
                  }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!collectionName.trim()}
            className="btn-orange"
            style={{
              width: "100%",
              opacity: collectionName.trim() ? 1 : 0.5,
              cursor: collectionName.trim() ? "pointer" : "not-allowed",
            }}
          >
            Create Collection
          </button>
        </form>
      </div>
    </div>
  );
};
