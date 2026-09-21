"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Bookmark,
  Navigation as NavigationIcon,
  MapPin,
  Clock,
  Phone,
  Globe,
  ExternalLink,
  CheckCircle2,
  Wifi,
  Waves,
  Sparkles,
  Coffee,
  Car,
  Utensils,
  Sun,
  Plane,
} from "lucide-react";
import { Place, HotelRoom } from "@/types/place";
import { useApp } from "@/context/AppContext";
import { RatingBadge } from "@/components/RatingBadge";

const AMENITY_ICON_MAP: Record<string, React.ElementType> = {
  Wifi,
  Waves,
  Sparkles,
  Coffee,
  Car,
  Utensils,
  Sun,
  Plane,
};

interface PlaceDetailModalProps {
  place: Place;
  onClose: () => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({ place, onClose }) => {
  const { isSaved, toggleSave, setDirectionsPlace, setBookingData } = useApp();
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [selectedMenuCategoryIndex, setSelectedMenuCategoryIndex] = useState(0);

  const priceString = "$".repeat(Math.max(1, Math.min(4, place.priceLevel)));
  const saved = isSaved(place.id);

  const handleOpenBooking = (room: HotelRoom) => {
    setBookingData({ hotel: place, room });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: 720,
          maxHeight: "92vh",
          overflowY: "auto",
          backgroundColor: "var(--bg-surface)",
          borderTopLeftRadius: "var(--radius-lg)",
          borderTopRightRadius: "var(--radius-lg)",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          boxShadow: "0 -8px 36px rgba(0, 0, 0, 0.25)",
          display: "flex",
          flexDirection: "column",
          animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Gallery Header */}
        <div style={{ position: "relative", width: "100%", height: 320, backgroundColor: "var(--bg-surface-secondary)" }}>
          <Image
            src={place.imageURLs[activePhotoIndex] || place.imageURLs[0]}
            alt={place.name}
            fill
            sizes="720px"
            style={{ objectFit: "cover" }}
            priority
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)",
            }}
          />

          {/* Top action buttons */}
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              right: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <button
              onClick={onClose}
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                backgroundColor: "rgba(0, 0, 0, 0.45)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              <X size={20} />
            </button>

            <button
              onClick={() => toggleSave(place.id)}
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                backgroundColor: "rgba(0, 0, 0, 0.45)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: saved ? "var(--vibrant-orange)" : "#ffffff",
                cursor: "pointer",
              }}
            >
              <Bookmark size={20} fill={saved ? "var(--vibrant-orange)" : "none"} />
            </button>
          </div>

          {/* Image Dots & Price Badge */}
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              right: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Gallery Dots */}
            {place.imageURLs.length > 1 && (
              <div style={{ display: "flex", gap: 6 }}>
                {place.imageURLs.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIndex(idx)}
                    style={{
                      width: activePhotoIndex === idx ? 22 : 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: activePhotoIndex === idx ? "#ffffff" : "rgba(255,255,255,0.45)",
                      transition: "all 0.2s ease",
                    }}
                  />
                ))}
              </div>
            )}

            <div
              style={{
                padding: "4px 12px",
                borderRadius: "var(--radius-pill)",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(8px)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: 13,
                marginLeft: "auto",
              }}
            >
              {priceString}
            </div>
          </div>
        </div>

        {/* Modal Body Content */}
        <div style={{ padding: "24px 20px 40px 20px", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Header & Meta */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: "var(--light-blue)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {place.category}
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: place.isOpen ? "var(--emerald-green)" : "var(--coral-red)",
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: place.isOpen ? "var(--emerald-green)" : "var(--coral-red)",
                  }}
                >
                  {place.isOpen ? "Open Now" : "Closed"}
                </span>
              </div>
            </div>

            <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>
              {place.name}
            </h2>

            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
              <RatingBadge rating={place.rating} reviewCount={place.reviewCount} />
              <span style={{ color: "var(--text-tertiary)" }}>•</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--text-secondary)" }}>
                <Clock size={14} color="var(--text-tertiary)" />
                <span>{place.openingHours}</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>
              <MapPin size={15} color="var(--light-blue)" />
              <span>{place.address}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <button
              onClick={() => {
                onClose();
                setDirectionsPlace(place);
              }}
              className="btn-primary"
              style={{ width: "100%" }}
            >
              <NavigationIcon size={17} />
              <span>Directions</span>
            </button>

            <button
              onClick={() => toggleSave(place.id)}
              className="btn-secondary"
              style={{
                width: "100%",
                color: saved ? "var(--vibrant-orange)" : "var(--text-primary)",
                borderColor: saved ? "var(--vibrant-orange)" : "var(--border-subtle)",
              }}
            >
              <Bookmark size={17} fill={saved ? "var(--vibrant-orange)" : "none"} />
              <span>{saved ? "Saved" : "Save"}</span>
            </button>
          </div>

          {/* Atmosphere & Vibe */}
          {place.atmosphereTags.length > 0 && (
            <div className="minimal-card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
              <h4 className="title-small" style={{ color: "var(--text-primary)" }}>
                Atmosphere & Vibe
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {place.atmosphereTags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "var(--text-secondary)",
                      backgroundColor: "var(--bg-surface-secondary)",
                      padding: "5px 12px",
                      borderRadius: "var(--radius-pill)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {place.restaurantInfo?.atmosphereDescription && (
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginTop: 4 }}>
                  {place.restaurantInfo.atmosphereDescription}
                </p>
              )}
            </div>
          )}

          {/* About Narrative */}
          <div className="minimal-card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 8 }}>
            <h4 className="title-small" style={{ color: "var(--text-primary)" }}>
              About
            </h4>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {place.editorialDescription}
            </p>
          </div>

          {/* Category Specific: Restaurant Digital Menu */}
          {place.restaurantInfo && place.restaurantInfo.menuCategories.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <h3 className="title-medium" style={{ color: "var(--text-primary)" }}>
                  Digital Menu
                </h3>
                <span style={{ fontSize: 13, color: "var(--light-blue)", fontWeight: 600 }}>
                  {place.restaurantInfo.cuisine}
                </span>
              </div>

              {/* Menu Categories Scroller */}
              <div className="horizontal-scroll">
                {place.restaurantInfo.menuCategories.map((cat, idx) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedMenuCategoryIndex(idx)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "var(--radius-pill)",
                      fontSize: 13,
                      fontWeight: 700,
                      backgroundColor:
                        selectedMenuCategoryIndex === idx
                          ? "var(--light-blue)"
                          : "var(--bg-surface-secondary)",
                      color: selectedMenuCategoryIndex === idx ? "#ffffff" : "var(--text-primary)",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>

              {/* Menu Items List */}
              <div
                className="minimal-card"
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {place.restaurantInfo.menuCategories[selectedMenuCategoryIndex]?.items.map((item, idx, arr) => (
                  <div key={item.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
                            {item.name}
                          </span>
                          {item.isSpecial && (
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 800,
                                color: "var(--vibrant-orange)",
                                backgroundColor: "rgba(249, 115, 22, 0.12)",
                                padding: "2px 6px",
                                borderRadius: "var(--radius-pill)",
                              }}
                            >
                              CHEF&apos;S PICK
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                          {item.description}
                        </p>
                      </div>

                      <span style={{ fontSize: 16, fontWeight: 700, color: "var(--light-blue)", flexShrink: 0 }}>
                        ${item.price.toFixed(0)}
                      </span>
                    </div>

                    {idx < arr.length - 1 && (
                      <div style={{ height: 1, backgroundColor: "var(--border-subtle)", marginTop: 14 }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Specific: Hotel Amenities & Room Reservation */}
          {place.hotelInfo && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Hotel Amenities */}
              <div>
                <h3 className="title-medium" style={{ color: "var(--text-primary)", marginBottom: 12 }}>
                  Hotel Amenities ({place.hotelInfo.stars} Stars)
                </h3>
                <div
                  className="minimal-card"
                  style={{
                    padding: 16,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 14,
                  }}
                >
                  {place.hotelInfo.amenities.map((amenity) => {
                    const AmenityIcon = AMENITY_ICON_MAP[amenity.iconName] || Sparkles;
                    return (
                      <div key={amenity.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            backgroundColor: "rgba(14, 165, 233, 0.12)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--light-blue)",
                          }}
                        >
                          <AmenityIcon size={16} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                          {amenity.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rooms List with Book Now button */}
              <div>
                <h3 className="title-medium" style={{ color: "var(--text-primary)", marginBottom: 12 }}>
                  Available Rooms
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {place.hotelInfo.rooms.map((room) => (
                    <div
                      key={room.id}
                      className="minimal-card"
                      style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: 160,
                          borderRadius: "var(--radius-md)",
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={room.imageURL}
                          alt={room.name}
                          fill
                          sizes="700px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <h4 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                            {room.name}
                          </h4>
                          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                            {room.bedType} • {room.occupancy}
                          </span>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: 18, fontWeight: 800, color: "var(--light-blue)" }}>
                            ${room.pricePerNight}
                          </span>
                          <span style={{ display: "block", fontSize: 11, color: "var(--text-tertiary)" }}>
                            per night
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {room.amenities.slice(0, 2).map((am) => (
                            <span
                              key={am}
                              style={{
                                fontSize: 11,
                                padding: "3px 8px",
                                borderRadius: "var(--radius-pill)",
                                backgroundColor: "var(--bg-surface-secondary)",
                                color: "var(--text-secondary)",
                              }}
                            >
                              {am}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => handleOpenBooking(room)}
                          className="btn-orange"
                          style={{ padding: "8px 18px", fontSize: 13, borderRadius: "var(--radius-pill)" }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Category Specific: Attraction Highlights */}
          {place.attractionInfo && (
            <div className="minimal-card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
              <h4 className="title-small" style={{ color: "var(--text-primary)" }}>
                Visitor Highlights
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {place.attractionInfo.highlights.map((highlight, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <CheckCircle2 size={16} color="var(--light-blue)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ height: 1, backgroundColor: "var(--border-subtle)" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ display: "block", fontSize: 11, color: "var(--text-tertiary)" }}>
                    Admission
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                    {place.attractionInfo.ticketPrice}
                  </span>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ display: "block", fontSize: 11, color: "var(--text-tertiary)" }}>
                    Recommended Time
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--light-blue)" }}>
                    {place.attractionInfo.bestTimeToVisit}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Contact & Web */}
          <div className="minimal-card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            <a
              href={`tel:${place.phone.replace(/\s+/g, "")}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Phone size={16} color="var(--light-blue)" />
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                  {place.phone}
                </span>
              </div>
              <ExternalLink size={14} color="var(--text-tertiary)" />
            </a>

            <div style={{ height: 1, backgroundColor: "var(--border-subtle)" }} />

            <a
              href={place.website}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Globe size={16} color="var(--light-blue)" />
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 380 }}>
                  {place.website}
                </span>
              </div>
              <ExternalLink size={14} color="var(--text-tertiary)" />
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @media (min-width: 768px) {
          div[style*="align-items: flex-end"] {
            align-items: center !important;
            padding: 24px !important;
          }
          .glass-card {
            border-radius: var(--radius-lg) !important;
            max-height: 88vh !important;
          }
        }
      `}</style>
    </div>
  );
};
