"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { Place, Coordinate, RouteDetails } from "@/types/place";

interface InteractiveMapProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  userCoordinate: Coordinate;
  activeRoute: RouteDetails | null;
  mapStyleChoice?: string;
  onRecenter?: () => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  userCoordinate,
  activeRoute,
  mapStyleChoice = "Standard",
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialCenter: [number, number] = selectedPlace
      ? [selectedPlace.coordinate.latitude, selectedPlace.coordinate.longitude]
      : [userCoordinate.latitude, userCoordinate.longitude];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 13,
      zoomControl: false,
    });

    // Add Zoom controls to top-right
    L.control.zoom({ position: "topright" }).addTo(map);

    // Clean Apple-inspired CartoDB tiles
    const tileUrl =
      mapStyleChoice === "Satellite"
        ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    const tileLayer = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); // Run once on mount

  // Update Tile Layer if mapStyleChoice changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileUrl =
      mapStyleChoice === "Satellite"
        ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);
  }, [mapStyleChoice]);

  // Update User Location Beacon
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
    }

    const userIcon = L.divIcon({
      className: "custom-user-marker",
      html: `
        <div style="position: relative; width: 22px; height: 22px;">
          <div style="position: absolute; inset: -6px; border-radius: 50%; background: rgba(14, 165, 233, 0.35); animation: pulseBeacon 2s infinite ease-out;"></div>
          <div style="width: 22px; height: 22px; border-radius: 50%; background: #0EA5E9; border: 3px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.25);"></div>
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    userMarkerRef.current = L.marker([userCoordinate.latitude, userCoordinate.longitude], {
      icon: userIcon,
      zIndexOffset: 1000,
    }).addTo(map);
  }, [userCoordinate]);

  // Update Place Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    places.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id;
      const size = isSelected ? 44 : 36;

      const markerHtml = `
        <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -50%);">
          <div style="
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background-color: ${isSelected ? "var(--light-blue)" : "var(--bg-surface)"};
            border: 2px solid ${isSelected ? "#ffffff" : "var(--light-blue)"};
            box-shadow: ${isSelected ? "0 4px 16px rgba(14, 165, 233, 0.6)" : "0 3px 8px rgba(0, 0, 0, 0.15)"};
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${isSelected ? "#ffffff" : "var(--light-blue)"};
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          ">
            <span style="font-size: ${isSelected ? "18px" : "15px"}; font-weight: 700;">
              ${place.category === "Restaurants" ? "🍴" : place.category === "Cafés" ? "☕️" : place.category === "Hotels" ? "🏨" : "✨"}
            </span>
          </div>
          ${
            isSelected
              ? `<div style="
                  margin-top: 4px;
                  padding: 3px 8px;
                  background: rgba(255, 255, 255, 0.95);
                  backdrop-filter: blur(8px);
                  border-radius: 9999px;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
                  font-size: 11px;
                  font-weight: 700;
                  color: #0f172a;
                  white-space: nowrap;
                ">${place.name}</div>`
              : ""
          }
        </div>
      `;

      const icon = L.divIcon({
        className: `place-marker-${place.id}`,
        html: markerHtml,
        iconSize: [size, size],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([place.coordinate.latitude, place.coordinate.longitude], {
        icon,
        zIndexOffset: isSelected ? 500 : 100,
      }).addTo(map);

      marker.on("click", () => {
        onSelectPlace(place);
      });

      markersRef.current.push(marker);
    });
  }, [places, selectedPlace, onSelectPlace]);

  // Pan to selected place
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPlace) return;

    map.flyTo([selectedPlace.coordinate.latitude, selectedPlace.coordinate.longitude], 14, {
      animate: true,
      duration: 0.8,
    });
  }, [selectedPlace]);

  // Render Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    if (activeRoute && activeRoute.polylineCoordinates.length > 0) {
      const polyline = L.polyline(activeRoute.polylineCoordinates, {
        color: "#0EA5E9",
        weight: 5,
        opacity: 0.9,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      routePolylineRef.current = polyline;

      // Fit map bounds to show entire route
      map.fitBounds(polyline.getBounds(), {
        padding: [60, 60],
        maxZoom: 15,
        animate: true,
      });
    }
  }, [activeRoute]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%", zIndex: 1 }} />

      <style jsx global>{`
        @keyframes pulseBeacon {
          0% { transform: scale(0.9); opacity: 0.8; }
          70% { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
