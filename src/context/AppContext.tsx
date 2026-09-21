"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Place,
  PlaceCategory,
  PlaceCollection,
  SavedPlaceItem,
  Coordinate,
  RouteDetails,
  HotelRoom,
} from "@/types/place";
import { SAMPLE_PLACES, DEFAULT_COLLECTIONS } from "@/data/mockPlaces";

interface AppContextType {
  // Places & Search
  allPlaces: Place[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: PlaceCategory;
  setSelectedCategory: (category: PlaceCategory) => void;
  filteredPlaces: Place[];

  // Saved & Collections
  collections: PlaceCollection[];
  savedItems: SavedPlaceItem[];
  isSaved: (placeId: string) => boolean;
  toggleSave: (placeId: string, collectionId?: string) => void;
  addCollection: (name: string, iconName?: string, colorHex?: string) => void;
  getSavedPlacesForCollection: (collectionId: string | null) => Place[];

  // Geolocation
  userCoordinate: Coordinate;
  userLocationStatus: "ready" | "active" | "denied";
  requestLocation: () => void;

  // Active Sheets & Modals
  selectedPlace: Place | null;
  setSelectedPlace: (place: Place | null) => void;
  directionsPlace: Place | null;
  setDirectionsPlace: (place: Place | null) => void;
  bookingData: { hotel: Place; room: HotelRoom } | null;
  setBookingData: (data: { hotel: Place; room: HotelRoom } | null) => void;
  activeRoute: RouteDetails | null;
  setActiveRoute: (route: RouteDetails | null) => void;
  isNewCollectionOpen: boolean;
  setIsNewCollectionOpen: (open: boolean) => void;

  // Preferences
  preferredDietary: string;
  setPreferredDietary: (dietary: string) => void;
  mapStyleChoice: string;
  setMapStyleChoice: (style: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_USER_COORDINATE: Coordinate = {
  latitude: 6.915,
  longitude: 79.8587,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allPlaces] = useState<Place[]>(SAMPLE_PLACES);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory>("All");

  // Saved & Collections with localStorage support
  const [collections, setCollections] = useState<PlaceCollection[]>(DEFAULT_COLLECTIONS);
  const [savedItems, setSavedItems] = useState<SavedPlaceItem[]>([
    { id: "saved-1", placeId: "place-1", collectionId: "col-datenight", savedAt: new Date().toISOString() },
    { id: "saved-2", placeId: "place-2", collectionId: "col-weekend", savedAt: new Date().toISOString() },
  ]);

  // Geolocation
  const [userCoordinate, setUserCoordinate] = useState<Coordinate>(DEFAULT_USER_COORDINATE);
  const [userLocationStatus, setUserLocationStatus] = useState<"ready" | "active" | "denied">("ready");

  // Modals & Navigation
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [directionsPlace, setDirectionsPlace] = useState<Place | null>(null);
  const [bookingData, setBookingData] = useState<{ hotel: Place; room: HotelRoom } | null>(null);
  const [activeRoute, setActiveRoute] = useState<RouteDetails | null>(null);
  const [isNewCollectionOpen, setIsNewCollectionOpen] = useState<boolean>(false);

  // Preferences
  const [preferredDietary, setPreferredDietary] = useState<string>("All Cuisines");
  const [mapStyleChoice, setMapStyleChoice] = useState<string>("Standard");

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedCollections = localStorage.getItem("mappie_collections");
      if (savedCollections) {
        setCollections(JSON.parse(savedCollections));
      }
      const savedPlaces = localStorage.getItem("mappie_saved_items");
      if (savedPlaces) {
        setSavedItems(JSON.parse(savedPlaces));
      }
      const savedDietary = localStorage.getItem("mappie_dietary");
      if (savedDietary) setPreferredDietary(savedDietary);
      const savedMapStyle = localStorage.getItem("mappie_map_style");
      if (savedMapStyle) setMapStyleChoice(savedMapStyle);
    } catch {
      // Storage unavailable or disabled
    }
  }, []);

  // Sync collections to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("mappie_collections", JSON.stringify(collections));
    } catch {
      // ignore
    }
  }, [collections]);

  // Sync saved items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("mappie_saved_items", JSON.stringify(savedItems));
    } catch {
      // ignore
    }
  }, [savedItems]);

  const isSaved = (placeId: string): boolean => {
    return savedItems.some((item) => item.placeId === placeId);
  };

  const toggleSave = (placeId: string, collectionId?: string) => {
    setSavedItems((prev) => {
      const exists = prev.some((item) => item.placeId === placeId);
      if (exists) {
        return prev.filter((item) => item.placeId !== placeId);
      } else {
        return [
          ...prev,
          {
            id: `saved-${Date.now()}`,
            placeId,
            collectionId: collectionId || "col-places",
            savedAt: new Date().toISOString(),
          },
        ];
      }
    });
  };

  const addCollection = (name: string, iconName = "Bookmark", colorHex = "#0EA5E9") => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const newCol: PlaceCollection = {
      id: `col-${Date.now()}`,
      name: trimmed,
      iconName,
      colorHex,
    };
    setCollections((prev) => [...prev, newCol]);
  };

  const getSavedPlacesForCollection = (collectionId: string | null): Place[] => {
    const matchingSaved = collectionId
      ? savedItems.filter((s) => s.collectionId === collectionId)
      : savedItems;
    const ids = new Set(matchingSaved.map((s) => s.placeId));
    return allPlaces.filter((p) => ids.has(p.id));
  };

  const requestLocation = () => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoordinate({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setUserLocationStatus("active");
        },
        () => {
          setUserLocationStatus("denied");
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  // Real-time filtered places matching Swift PlacesRepository.search
  const filteredPlaces = allPlaces.filter((place) => {
    if (selectedCategory !== "All" && place.category !== selectedCategory) {
      return false;
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;

    return (
      place.name.toLowerCase().includes(q) ||
      place.address.toLowerCase().includes(q) ||
      place.editorialDescription.toLowerCase().includes(q) ||
      place.atmosphereTags.some((tag) => tag.toLowerCase().includes(q)) ||
      (place.restaurantInfo?.cuisine.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <AppContext.Provider
      value={{
        allPlaces,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        filteredPlaces,
        collections,
        savedItems,
        isSaved,
        toggleSave,
        addCollection,
        getSavedPlacesForCollection,
        userCoordinate,
        userLocationStatus,
        requestLocation,
        selectedPlace,
        setSelectedPlace,
        directionsPlace,
        setDirectionsPlace,
        bookingData,
        setBookingData,
        activeRoute,
        setActiveRoute,
        isNewCollectionOpen,
        setIsNewCollectionOpen,
        preferredDietary,
        setPreferredDietary,
        mapStyleChoice,
        setMapStyleChoice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
