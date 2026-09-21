"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, CheckCircle2, Calendar, Users, ShieldCheck } from "lucide-react";
import { Place, HotelRoom } from "@/types/place";

interface HotelBookingModalProps {
  hotel: Place;
  room: HotelRoom;
  onClose: () => void;
}

export const HotelBookingModal: React.FC<HotelBookingModalProps> = ({
  hotel,
  room,
  onClose,
}) => {
  // Default check-in tomorrow, checkout 3 days later
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(today.getDate() + 3);

  const [checkIn, setCheckIn] = useState<string>(tomorrow.toISOString().split("T")[0]);
  const [checkOut, setCheckOut] = useState<string>(threeDaysLater.toISOString().split("T")[0]);
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const totalAmount = nights * room.pricePerNight;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2100,
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
          maxWidth: 580,
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
          padding: "24px 20px 36px 20px",
          gap: 20,
        }}
      >
        {isConfirmed ? (
          // Confirmation Screen
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 16px",
              textAlign: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                backgroundColor: "rgba(16, 185, 129, 0.14)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--emerald-green)",
              }}
            >
              <CheckCircle2 size={48} strokeWidth={2.5} />
            </div>

            <h3 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>
              Reservation Confirmed!
            </h3>

            <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 380, lineHeight: 1.5 }}>
              Your stay at <strong style={{ color: "var(--text-primary)" }}>{hotel.name}</strong> for the{" "}
              <strong style={{ color: "var(--text-primary)" }}>{room.name}</strong> has been secured.
            </p>

            <div
              className="minimal-card"
              style={{
                padding: "12px 20px",
                margin: "12px 0",
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontSize: 13,
                color: "var(--text-secondary)",
              }}
            >
              <div>
                <span style={{ display: "block", fontSize: 11, color: "var(--text-tertiary)" }}>Dates</span>
                <strong>{checkIn} to {checkOut}</strong>
              </div>
              <div style={{ width: 1, height: 24, backgroundColor: "var(--border-subtle)" }} />
              <div>
                <span style={{ display: "block", fontSize: 11, color: "var(--text-tertiary)" }}>Guests</span>
                <strong>{guestsCount} Guests</strong>
              </div>
              <div style={{ width: 1, height: 24, backgroundColor: "var(--border-subtle)" }} />
              <div>
                <span style={{ display: "block", fontSize: 11, color: "var(--text-tertiary)" }}>Total Paid</span>
                <strong style={{ color: "var(--vibrant-orange)" }}>${totalAmount}</strong>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn-primary"
              style={{ padding: "12px 36px", borderRadius: "var(--radius-pill)" }}
            >
              Done
            </button>
          </div>
        ) : (
          // Booking Form
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 className="title-medium" style={{ color: "var(--text-primary)" }}>
                  Reserve Room
                </h3>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  {hotel.name}
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

            {/* Room Summary */}
            <div
              className="minimal-card"
              style={{ padding: 14, display: "flex", gap: 14, alignItems: "center" }}
            >
              <div
                style={{
                  position: "relative",
                  width: 80,
                  height: 80,
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <Image
                  src={room.imageURL}
                  alt={room.name}
                  fill
                  sizes="80px"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
                  {room.name}
                </h4>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {room.bedType}
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--light-blue)", marginTop: 2 }}>
                  ${room.pricePerNight} <span style={{ fontSize: 11, fontWeight: 400, color: "var(--text-tertiary)" }}>/ night</span>
                </span>
              </div>
            </div>

            {/* Dates & Guests Pickers */}
            <div className="minimal-card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      marginBottom: 6,
                    }}
                  >
                    <Calendar size={13} color="var(--light-blue)" />
                    <span>Check-In</span>
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border-subtle)",
                      backgroundColor: "var(--bg-surface-secondary)",
                      color: "var(--text-primary)",
                      fontSize: 13,
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      marginBottom: 6,
                    }}
                  >
                    <Calendar size={13} color="var(--light-blue)" />
                    <span>Check-Out</span>
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border-subtle)",
                      backgroundColor: "var(--bg-surface-secondary)",
                      color: "var(--text-primary)",
                      fontSize: 13,
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              </div>

              <div style={{ height: 1, backgroundColor: "var(--border-subtle)" }} />

              {/* Guests Stepper */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Users size={16} color="var(--light-blue)" />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                    Guests
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button
                    onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: "var(--bg-surface-secondary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: 15, fontWeight: 700, minWidth: 16, textAlign: "center" }}>
                    {guestsCount}
                  </span>
                  <button
                    onClick={() => setGuestsCount(Math.min(6, guestsCount + 1))}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: "var(--bg-surface-secondary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="minimal-card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-secondary)" }}>
                <span>{nights} Nights × ${room.pricePerNight}</span>
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>${nights * room.pricePerNight}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-secondary)" }}>
                <span>Taxes & Service Fees</span>
                <span style={{ color: "var(--emerald-green)", fontWeight: 600 }}>Included</span>
              </div>

              <div style={{ height: 1, backgroundColor: "var(--border-subtle)", margin: "4px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                  Total Amount
                </span>
                <span style={{ fontSize: 22, fontWeight: 800, color: "var(--vibrant-orange)" }}>
                  ${totalAmount}
                </span>
              </div>
            </div>

            {/* Security Guarantee Note */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-tertiary)" }}>
              <ShieldCheck size={16} color="var(--emerald-green)" />
              <span>Free cancellation up to 48 hours before check-in. Instant confirmation.</span>
            </div>

            {/* Confirm button */}
            <button
              onClick={() => setIsConfirmed(true)}
              className="btn-orange"
              style={{ width: "100%", padding: 14, fontSize: 16 }}
            >
              Confirm & Reserve
            </button>
          </>
        )}
      </div>

      <style jsx>{`
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
