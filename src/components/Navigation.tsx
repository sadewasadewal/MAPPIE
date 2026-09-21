"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Map, Bookmark, User, Compass } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const { savedItems } = useApp();

  const navItems = [
    { label: "Explore", href: "/", icon: Sparkles },
    { label: "Map", href: "/map", icon: Map },
    { label: "Saved", href: "/saved", icon: Bookmark, badge: savedItems.length },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <>
      {/* Desktop Header Navigation */}
      <header
        className="glass-card"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          borderRadius: 0,
          borderLeft: "none",
          borderRight: "none",
          borderTop: "none",
          backgroundColor: "var(--bg-glass)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Brand Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: "var(--gradient-brand)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "var(--shadow-accent)",
              }}
            >
              <Compass size={22} color="#ffffff" strokeWidth={2.4} />
            </div>
            <div>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  background: "var(--gradient-brand)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                MAPPIE
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "var(--text-tertiary)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Wayfinder
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav
            style={{
              display: "none",
              alignItems: "center",
              gap: 6,
            }}
            className="desktop-nav"
          >
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 16px",
                    borderRadius: "var(--radius-pill)",
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "var(--light-blue)" : "var(--text-secondary)",
                    backgroundColor: isActive ? "rgba(14, 165, 233, 0.1)" : "transparent",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Icon size={17} strokeWidth={isActive ? 2.4 : 2} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: isActive
                          ? "var(--light-blue)"
                          : "var(--bg-surface-tertiary)",
                        color: isActive ? "#ffffff" : "var(--text-secondary)",
                        padding: "1px 6px",
                        borderRadius: 10,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Floating Bottom Bar */}
      <div
        style={{
          position: "fixed",
          bottom: 16,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          padding: "0 16px",
          pointerEvents: "none",
        }}
        className="mobile-bottom-nav"
      >
        <nav
          className="glass-card"
          style={{
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%",
            maxWidth: 420,
            padding: "8px 12px",
            borderRadius: "var(--radius-pill)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.18)",
            border: "1px solid var(--border-glass)",
          }}
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                  padding: "6px 14px",
                  borderRadius: "var(--radius-pill)",
                  color: isActive ? "var(--light-blue)" : "var(--text-secondary)",
                  backgroundColor: isActive ? "rgba(14, 165, 233, 0.12)" : "transparent",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  position: "relative",
                }}
              >
                <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  {item.label}
                </span>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 2,
                      right: 12,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "var(--vibrant-orange)",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Media query styling for responsive nav */}
      <style jsx global>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-bottom-nav {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};
