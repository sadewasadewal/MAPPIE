export type PlaceCategory =
  | "All"
  | "Restaurants"
  | "Cafés"
  | "Hotels"
  | "Attractions"
  | "Shopping"
  | "Nature"
  | "Landmarks";

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isSpecial?: boolean;
}

export interface MenuCategory {
  id: string;
  title: string;
  items: MenuItem[];
}

export interface RestaurantInfo {
  cuisine: string;
  atmosphereDescription: string;
  menuCategories: MenuCategory[];
}

export interface Amenity {
  id: string;
  name: string;
  iconName: string;
}

export interface HotelRoom {
  id: string;
  name: string;
  bedType: string;
  occupancy: string;
  pricePerNight: number;
  amenities: string[];
  isAvailable: boolean;
  imageURL: string;
}

export interface HotelInfo {
  stars: number;
  pricePerNight: number;
  amenities: Amenity[];
  rooms: HotelRoom[];
}

export interface AttractionInfo {
  highlights: string[];
  ticketPrice: string;
  bestTimeToVisit: string;
}

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  rating: number;
  reviewCount: number;
  coordinate: Coordinate;
  address: string;
  priceLevel: number; // 1 to 4
  isOpen: boolean;
  openingHours: string;
  phone: string;
  website: string;
  imageURLs: string[];
  atmosphereTags: string[];
  editorialDescription: string;
  restaurantInfo?: RestaurantInfo;
  hotelInfo?: HotelInfo;
  attractionInfo?: AttractionInfo;
}

export interface PlaceCollection {
  id: string;
  name: string;
  iconName: string;
  colorHex: string;
}

export interface SavedPlaceItem {
  id: string;
  placeId: string;
  collectionId?: string;
  savedAt: string;
}

export interface RouteStepInfo {
  id: string;
  instruction: string;
  distanceFormatted: string;
}

export interface RouteDetails {
  destinationName: string;
  travelTimeFormatted: string;
  distanceFormatted: string;
  transportType: "driving" | "walking";
  steps: RouteStepInfo[];
  polylineCoordinates: [number, number][]; // [lat, lng] pairs
}
