"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { PlaceDetailModal } from "./Modals/PlaceDetailModal";
import { DirectionsModal } from "./Modals/DirectionsModal";
import { HotelBookingModal } from "./Modals/HotelBookingModal";
import { NewCollectionModal } from "./Modals/NewCollectionModal";

export const ClientModals: React.FC = () => {
  const {
    selectedPlace,
    setSelectedPlace,
    directionsPlace,
    setDirectionsPlace,
    bookingData,
    setBookingData,
  } = useApp();

  return (
    <>
      {selectedPlace && (
        <PlaceDetailModal
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}

      {directionsPlace && (
        <DirectionsModal
          destination={directionsPlace}
          onClose={() => setDirectionsPlace(null)}
        />
      )}

      {bookingData && (
        <HotelBookingModal
          hotel={bookingData.hotel}
          room={bookingData.room}
          onClose={() => setBookingData(null)}
        />
      )}

      <NewCollectionModal />
    </>
  );
};
