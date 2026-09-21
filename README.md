# MAPPIE 🗺️

A dual-platform place discovery and navigation app — available as a **Next.js web app** and a native **SwiftUI iOS app**.

Explore places, get directions, save favourites, and book hotels — all from an interactive map interface.

---

## Platforms

| Platform | Stack |
|----------|-------|
| 🌐 Web | Next.js 15, React 19, TypeScript, Leaflet |
| 📱 iOS | SwiftUI, MapKit |

---

## Features

- 🗺️ **Interactive Map** — Browse and explore places on a live map (Leaflet on web, MapKit on iOS)
- 🔍 **Place Discovery** — Filter places by category with an intuitive chip-based UI
- 📋 **Place Details** — Rich detail views with ratings, photos, and info
- 🧭 **Directions** — Turn-by-turn directions modal with route display
- 🏨 **Hotel Booking** — In-app hotel booking modal
- 💾 **Saved Places** — Save and organise places into collections
- 👤 **Profile** — User profile and preferences

---

## Project Structure

```
MAPPIE/
├── src/                        # Next.js web app
│   ├── app/                    # App Router pages
│   │   ├── page.tsx            # Home / explore page
│   │   ├── map/page.tsx        # Full map view
│   │   ├── saved/page.tsx      # Saved places & collections
│   │   └── profile/page.tsx    # User profile
│   ├── components/
│   │   ├── Map/                # InteractiveMap, PlacePreviewSheet
│   │   ├── Modals/             # PlaceDetail, Directions, HotelBooking, NewCollection
│   │   ├── Navigation.tsx
│   │   ├── PlaceCardCompact.tsx
│   │   ├── PlaceCardRow.tsx
│   │   ├── CategoryChip.tsx
│   │   └── RatingBadge.tsx
│   ├── context/AppContext.tsx  # Global state
│   ├── data/mockPlaces.ts      # Mock place data
│   ├── services/               # Directions service
│   └── types/place.ts          # TypeScript types
│
└── MAPPIE/                     # SwiftUI iOS app (Xcode)
    └── MAPPIE/
        ├── MAPPIEApp.swift
        ├── ContentView.swift
        ├── MapRootView.swift
        ├── ExploreView.swift
        ├── PlaceDetailView.swift
        ├── SavedView.swift
        ├── ProfileView.swift
        ├── DirectionsSheetView.swift
        ├── PlaceComponents.swift
        ├── DesignSystem.swift
        ├── Models.swift
        ├── ViewModels.swift
        └── Services.swift
```

---

## Getting Started

### Web App

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# Build for production
npm run build
npm start
```

### iOS App

**Prerequisites:** Xcode 15+, iOS 17+ simulator or device

1. Open `MAPPIE/MAPPIE.xcodeproj` in Xcode
2. Select your target device or simulator
3. Press **⌘R** to build and run

---

## Tech Stack

### Web
- **[Next.js 15](https://nextjs.org/)** — App Router, server components
- **[React 19](https://react.dev/)** — UI library
- **[TypeScript](https://www.typescriptlang.org/)** — Type safety
- **[Leaflet](https://leafletjs.com/)** — Interactive maps
- **[Lucide React](https://lucide.dev/)** — Icons

### iOS
- **SwiftUI** — Declarative UI
- **MapKit** — Native Apple Maps integration

---

## License

MIT
