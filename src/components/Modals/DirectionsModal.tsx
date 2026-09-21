"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Car,
  Footprints,
  MapPin,
  ExternalLink,
  Navigation,
  Loader2,
} from "lucide-react";
import { Place, RouteDetails } from "@/types/place";
import { useApp } from "@/context/AppContext";
import { calculateRoute } from "@/services/directionsService";

interface DirectionsModalProps {
  destination: Place;
  onClose: () => void;
}

export const DirectionsModal: React.FC<DirectionsModalProps> = ({ destination, onClose }) => {
  const router = useRouter();
  const { userCoordinate, setActiveRoute } = useApp();
  const [transportMode, setTransportMode] = useState<"driving" | "walking">("driving");
  const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    calculateRoute(userCoordinate, destination, transportMode).then((res) => {
      if (!cancelled) {
        setRouteDetails(res);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [userCoordinate, destination, transportMode]);

  const handleShowOnInteractiveMap = () => {
    if (routeDetails) {
      setActiveRoute(routeDetails);
    }
    onClose();
    router.push("/map");
  };

  const openExternalGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userCoordinate.latitude},${userCoordinate.longitude}&destination=${destination.coordinate.latitude},${destination.coordinate.longitude}&travelmode=${transportMode}`;
    window.open(url, "_blank");
  };

  const openExternalAppleMaps = () => {
    const url = `http://maps.apple.com/?saddr=${userCoordinate.latitude},${userCoordinate.longitude}&daddr=${destination.coordinate.latitude},${destination.coordinate.longitude}&dirflg=${transportMode === "walking" ? "w" : "d"}`;
    window.open(url, "_blank");
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
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: 600,
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "var(--bg-surface)",
          borderTopLeftRadius: "var(--radius-lg)",
          borderTopRightRadius: "var(--radius-lg)",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          boxShadow: "0 -8px 36px rgba(0, 0, 0, 0.25)",
          display: "flex",
          flexDirection: "column",
          padding: "20px 20px 36px 20px",
          gap: 20,
        }}
      >
        {/* Header with Title & Close */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 className="title-medium" style={{ color: "var(--text-primary)" }}>
              Directions
            </h3>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              To {destination.name}
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: "var(--bg-surface-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-secondary)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Transport Mode Toggle */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            padding: 4,
            backgroundColor: "var(--bg-surface-secondary)",
            borderRadius: "var(--radius-pill)",
          }}
        >
          <button
            onClick={() => setTransportMode("driving")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "10px 0",
              borderRadius: "var(--radius-pill)",
              fontSize: 14,
              fontWeight: 600,
              backgroundColor: transportMode === "driving" ? "var(--bg-surface)" : "transparent",
              color: transportMode === "driving" ? "var(--light-blue)" : "var(--text-secondary)",
              boxShadow: transportMode === "driving" ? "var(--shadow-soft)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            <Car size={18} />
            <span>Driving</span>
          </button>

          <button
            onClick={() => setTransportMode("walking")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "10px 0",
              borderRadius: "var(--radius-pill)",
              fontSize: 14,
              fontWeight: 600,
              backgroundColor: transportMode === "walking" ? "var(--bg-surface)" : "transparent",
              color: transportMode === "walking" ? "var(--light-blue)" : "var(--text-secondary)",
              boxShadow: transportMode === "walking" ? "var(--shadow-soft)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            <Footprints size={18} />
            <span>Walking</span>
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 0",
              gap: 12,
            }}
          >
            <Loader2 size={32} color="var(--light-blue)" className="spinner" />
            <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              Calculating fastest route...
            </span>
          </div>
        ) : routeDetails ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Route Summary Card */}
            <div
              className="minimal-card"
              style={{
                padding: 16,
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: "linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(249, 115, 22, 0.05) 100%)",
                border: "1px solid rgba(14, 165, 233, 0.2)",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  backgroundColor: "var(--light-blue)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  boxShadow: "var(--shadow-accent)",
                  flexShrink: 0,
                }}
              >
                {transportMode === "walking" ? <Footprints size={26} /> : <Car size={26} />}
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>
                    {routeDetails.travelTimeFormatted}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)" }}>
                    ({routeDetails.distanceFormatted})
                  </span>
                </div>
                <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                  Fastest route with real-time typical conditions
                </span>
              </div>
            </div>

            {/* Destination summary */}
            <div
              className="minimal-card"
              style={{ padding: 14, display: "flex", alignItems: "center", gap: 12 }}
            >
              <MapPin size={22} color="var(--light-blue)" style={{ flexShrink: 0 }} />
              <div>
                <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                  {destination.name}
                </span>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {destination.address}
                </span>
              </div>
            </div>

            {/* Turn-by-Turn Guidance Timeline */}
            <div className="minimal-card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
              <h4 className="title-small" style={{ color: "var(--text-primary)" }}>
                Turn-by-Turn Steps
              </h4>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {routeDetails.steps.map((step, idx, arr) => (
                  <div key={step.id} style={{ display: "flex", gap: 14, minHeight: 44 }}>
                    {/* Step line and dot */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 14 }}>
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: idx === 0 ? "var(--light-blue)" : idx === arr.length - 1 ? "var(--emerald-green)" : "var(--text-tertiary)",
                          marginTop: 4,
                          flexShrink: 0,
                        }}
                      />
                      {idx < arr.length - 1 && (
                        <span
                          style={{
                            width: 2,
                            flexGrow: 1,
                            backgroundColor: "var(--border-subtle)",
                            margin: "4px 0",
                          }}
                        />
                      )}
                    </div>

                    {/* Step Instruction */}
                    <div style={{ paddingBottom: 12 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.3 }}>
                        {step.instruction}
                      </p>
                      <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                        {step.distanceFormatted}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons: Show on Map & External Maps */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={handleShowOnInteractiveMap}
                className="btn-primary"
                style={{ width: "100%", padding: 14 }}
              >
                <Navigation size={18} />
                <span>Show Route on Interactive Map</span>
              </button>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button
                  onClick={openExternalGoogleMaps}
                  className="btn-secondary"
                  style={{ fontSize: 13, padding: "10px 14px" }}
                >
                  <span>Google Maps</span>
                  <ExternalLink size={14} />
                </button>

                <button
                  onClick={openExternalAppleMaps}
                  className="btn-secondary"
                  style={{ fontSize: 13, padding: "10px 14px" }}
                >
                  <span>Apple Maps</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        :global(.spinner) {
          animation: spin 1s linear infinite;
        }
        @media (min-width: 768px) {
          div[style*="align-items: flex-end"] {
            align-items: center !important;
            padding: 24px !important;
          }
          .glass-card {
            border-radius: var(--radius-lg) !important;
            max-height: 85vh !important;
          }
        }
      `}</style>
    </div>
  );
};
