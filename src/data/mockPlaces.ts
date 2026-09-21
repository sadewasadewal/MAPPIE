import { Place, PlaceCollection } from "@/types/place";

export const DEFAULT_COLLECTIONS: PlaceCollection[] = [
  { id: "col-weekend", name: "Weekend Escapes", iconName: "Sparkles", colorHex: "#0EA5E9" },
  { id: "col-datenight", name: "Date Night", iconName: "Heart", colorHex: "#F97316" },
  { id: "col-cafes", name: "Cozy Cafés", iconName: "Coffee", colorHex: "#FB923C" },
  { id: "col-places", name: "Places to Visit", iconName: "Bookmark", colorHex: "#0284C7" },
];

export const SAMPLE_PLACES: Place[] = [
  // 1. Restaurant
  {
    id: "place-1",
    name: "The Gallery Café",
    category: "Restaurants",
    rating: 4.8,
    reviewCount: 342,
    coordinate: { latitude: 6.8969, longitude: 79.8587 },
    address: "2 Alfred House Rd, Colombo 00300",
    priceLevel: 3,
    isOpen: true,
    openingHours: "10:00 AM – 11:30 PM",
    phone: "+94 11 258 2162",
    website: "https://paradiseroad.lk",
    imageURLs: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop",
    ],
    atmosphereTags: ["Romantic", "Outdoor Courtyard", "Elegant", "Geoffrey Bawa Architecture", "Date Night"],
    editorialDescription:
      "Housed in the former offices of renowned world architect Geoffrey Bawa, The Gallery Café features an open courtyard with reflecting pools and modern contemporary art. An iconic Sri Lankan culinary destination.",
    restaurantInfo: {
      cuisine: "Contemporary Sri Lankan & Italian",
      atmosphereDescription:
        "Soothing reflecting ponds, candlelight, open-air colonial verandas, and bespoke art pieces created by local artisans.",
      menuCategories: [
        {
          id: "mcat-1",
          title: "STARTERS",
          items: [
            { id: "mi-1", name: "Truffle Crostini", description: "Wild mushroom · shaved parmesan · white truffle essence", price: 14.0, isSpecial: true },
            { id: "mi-2", name: "Lemongrass Prawn Skewers", description: "Jumbo prawns · sweet chili glaze · lime leaf", price: 18.0 },
            { id: "mi-3", name: "Burrata & Heirloom Tomatoes", description: "Basil pesto · aged balsamic reduction · sea salt", price: 16.0 },
          ],
        },
        {
          id: "mcat-2",
          title: "MAIN COURSE",
          items: [
            { id: "mi-4", name: "Black Pepper Crab Risotto", description: "Lagoon crab · arborio rice · cracked black pepper · herbs", price: 28.0, isSpecial: true },
            { id: "mi-5", name: "Truffle Handcrafted Pasta", description: "Creamy parmesan emulsion · hand-rolled fettuccine · summer black truffle", price: 24.0 },
            { id: "mi-6", name: "Pan-Seared Sea Bass", description: "Saffron potato puree · baby asparagus · lemon butter", price: 26.0 },
          ],
        },
        {
          id: "mcat-3",
          title: "DESSERTS",
          items: [
            { id: "mi-7", name: "Signature Jaggery Crème Brûlée", description: "Infused with organic kitul treacle and roasted cashew crisp", price: 12.0, isSpecial: true },
            { id: "mi-8", name: "Dark Chocolate Fondant", description: "Warm molten center · salted caramel gelato", price: 13.0 },
          ],
        },
        {
          id: "mcat-4",
          title: "DRINKS & COCKTAILS",
          items: [
            { id: "mi-9", name: "Passion Fruit Arrack Sour", description: "Ceylon coconut spirit · fresh passion fruit · aromatic bitters", price: 15.0 },
            { id: "mi-10", name: "Artisan Ginger Lemongrass Cooler", description: "Cold-pressed ginger · citrus juice · sparkling soda", price: 8.0 },
          ],
        },
      ],
    },
  },

  // 2. Hotel
  {
    id: "place-2",
    name: "Amangalla Heritage",
    category: "Hotels",
    rating: 4.9,
    reviewCount: 428,
    coordinate: { latitude: 6.0287, longitude: 80.2173 },
    address: "10 Church Street, Galle Fort",
    priceLevel: 4,
    isOpen: true,
    openingHours: "Open 24 Hours",
    phone: "+94 91 223 3388",
    website: "https://aman.com/resorts/amangalla",
    imageURLs: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop",
    ],
    atmosphereTags: ["Luxury Heritage", "Historic 1684", "Peaceful Garden", "Ayurvedic Spa"],
    editorialDescription:
      "Set within the ramparts of seventeenth-century Galle Fort, Amangalla is a living museum of colonial serenity, offering four-poster beds, polished teak floorboards, and unmatched world-class hospitality.",
    hotelInfo: {
      stars: 5,
      pricePerNight: 480.0,
      amenities: [
        { id: "am-1", name: "High-Speed Wi-Fi", iconName: "Wifi" },
        { id: "am-2", name: "Garden Swimming Pool", iconName: "Waves" },
        { id: "am-3", name: "The Baths Hydrotherapy Spa", iconName: "Sparkles" },
        { id: "am-4", name: "Signature Breakfast Included", iconName: "Coffee" },
        { id: "am-5", name: "Valet Parking", iconName: "Car" },
        { id: "am-6", name: "Fine Dining Restaurant", iconName: "Utensils" },
      ],
      rooms: [
        {
          id: "rm-1",
          name: "Heritage Verandah Suite",
          bedType: "1 Four-Poster King Bed",
          occupancy: "2 Adults",
          pricePerNight: 480.0,
          amenities: ["Private Balcony overlooking Garden", "Freestanding Clawfoot Tub", "Complimentary Mini Bar"],
          isAvailable: true,
          imageURL: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop",
        },
        {
          id: "rm-2",
          name: "Church Street Chamber",
          bedType: "1 Super King Bed",
          occupancy: "2 Adults · 1 Child",
          pricePerNight: 620.0,
          amenities: ["Original 17th-Century Antiques", "Twin Marble Vanities", "Butler Service"],
          isAvailable: true,
          imageURL: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop",
        },
        {
          id: "rm-3",
          name: "Garden Pavilion Villa",
          bedType: "2 Queen Beds",
          occupancy: "4 Guests",
          pricePerNight: 890.0,
          amenities: ["Private Plunge Pool", "Outdoor Rain Shower", "Daily Afternoon High Tea"],
          isAvailable: true,
          imageURL: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop",
        },
      ],
    },
  },

  // 3. Cafe
  {
    id: "place-3",
    name: "Kiku Espresso & Botanicals",
    category: "Cafés",
    rating: 4.7,
    reviewCount: 198,
    coordinate: { latitude: 6.8856, longitude: 79.8601 },
    address: "Havelock Town, Colombo 00500",
    priceLevel: 2,
    isOpen: true,
    openingHours: "8:00 AM – 7:00 PM",
    phone: "+94 11 433 9900",
    website: "https://kiku.design",
    imageURLs: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop",
    ],
    atmosphereTags: ["Minimalist", "Japanese-Inspired", "Quiet", "Work Friendly", "Specialty Coffee"],
    editorialDescription:
      "A serene Tokyo-inspired café combining handcrafted single-origin coffee with house-baked pastries and seasonal botanical infusions.",
    restaurantInfo: {
      cuisine: "Japanese Café & Specialty Roasts",
      atmosphereDescription: "Pale wood, unadorned concrete surfaces, soft lo-fi beats, and warm natural sunlight.",
      menuCategories: [
        {
          id: "mcat-5",
          title: "COFFEE",
          items: [
            { id: "mi-11", name: "Kyoto Cold Brew", description: "12-hour slow drip extraction · fruity floral notes", price: 6.5 },
            { id: "mi-12", name: "Oat Cortado", description: "Double espresso ristretto · micro-foamed oat milk", price: 5.5 },
            { id: "mi-13", name: "Ceremonial Matcha Latte", description: "Single-origin Uji matcha · steamed milk", price: 7.0, isSpecial: true },
          ],
        },
        {
          id: "mcat-6",
          title: "SWEET & SAVORY",
          items: [
            { id: "mi-14", name: "Shokupan Avocado Toast", description: "Japanese milk bread · poached organic egg · furikake", price: 11.0 },
            { id: "mi-15", name: "Yuzu Miso French Toast", description: "Caramelized brioche · whipped mascarpone · yuzu curd", price: 13.0, isSpecial: true },
          ],
        },
      ],
    },
  },

  // 4. Landmark / Attraction
  {
    id: "place-4",
    name: "Galle Fort Lighthouse",
    category: "Landmarks",
    rating: 4.9,
    reviewCount: 920,
    coordinate: { latitude: 6.0247, longitude: 80.2201 },
    address: "Rampart St, Galle Fort",
    priceLevel: 1,
    isOpen: true,
    openingHours: "Open 24 Hours",
    phone: "+94 91 223 4400",
    website: "https://whc.unesco.org",
    imageURLs: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
    ],
    atmosphereTags: ["Scenic Ocean Views", "UNESCO World Heritage", "Sunset Point", "Historic Landmark"],
    editorialDescription:
      "Built in 1939 on the Point Utrecht Bastion of Galle Fort, this iconic 26.5-meter lighthouse overlooks the Indian Ocean and is surrounded by swaying palm trees.",
    attractionInfo: {
      highlights: ["360° panoramic view of the Indian Ocean", "Walkable coastal ramparts", "Best sunset vantage point in southern Sri Lanka"],
      ticketPrice: "Free Admission",
      bestTimeToVisit: "5:00 PM – 6:30 PM for breathtaking golden hour",
    },
  },

  // 5. Restaurant (Japanese)
  {
    id: "place-5",
    name: "Nihonbashi Modern",
    category: "Restaurants",
    rating: 4.8,
    reviewCount: 512,
    coordinate: { latitude: 6.915, longitude: 79.855 },
    address: "Galle Face Terrace, Colombo 00300",
    priceLevel: 4,
    isOpen: true,
    openingHours: "12:00 PM – 2:30 PM, 6:30 PM – 11:00 PM",
    phone: "+94 11 232 3847",
    website: "https://nihonbashi.net",
    imageURLs: [
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop",
    ],
    atmosphereTags: ["Fine Dining", "Bamboo Garden", "Sushi Bar", "Intimate", "Date Night"],
    editorialDescription:
      "Ranked among Asia’s 50 Best Restaurants, Nihonbashi serves authentic yakitori and pristine sashimi sourced fresh daily from the Indian Ocean.",
    restaurantInfo: {
      cuisine: "Authentic Japanese & Sushi",
      atmosphereDescription: "Traditional Japanese Tatami rooms, dark slate stone, and private bamboo garden pavilions.",
      menuCategories: [
        {
          id: "mcat-7",
          title: "SASHIMI & NIGIRI",
          items: [
            { id: "mi-16", name: "Yellowfin Tuna O-Toro", description: "Pristine sashimi cut · fresh grated wasabi", price: 32.0, isSpecial: true },
            { id: "mi-17", name: "Botan Ebi Nigiri", description: "Sweet jumbo prawn · nikiri soy glaze", price: 26.0 },
          ],
        },
        {
          id: "mcat-8",
          title: "YAKITORI & ROBATA",
          items: [
            { id: "mi-18", name: "Wagyu A5 Skewers", description: "Charcoal grilled Miyazaki beef · Maldon sea salt", price: 42.0, isSpecial: true },
            { id: "mi-19", name: "Tare Glazed Chicken Thigh", description: "Binchotan grilled · scallions · 30-year aged tare", price: 18.0 },
          ],
        },
      ],
    },
  },

  // 6. Hotel (Boutique)
  {
    id: "place-6",
    name: "Taru Villas - Lake Lodge",
    category: "Hotels",
    rating: 4.8,
    reviewCount: 175,
    coordinate: { latitude: 6.908, longitude: 79.859 },
    address: "Alwis Terrace, Colombo 00300",
    priceLevel: 3,
    isOpen: true,
    openingHours: "Open 24 Hours",
    phone: "+94 11 232 5566",
    website: "https://taruvillas.com",
    imageURLs: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop",
    ],
    atmosphereTags: ["Boutique Hideaway", "Tranquil Lake View", "Contemporary Art", "Lush Courtyard"],
    editorialDescription:
      "An oasis of quiet chic located moments away from the heart of the city, overlooking the peaceful waters of Beira Lake.",
    hotelInfo: {
      stars: 4,
      pricePerNight: 210.0,
      amenities: [
        { id: "am-7", name: "High-Speed Wi-Fi", iconName: "Wifi" },
        { id: "am-8", name: "Courtyard Dining", iconName: "Utensils" },
        { id: "am-9", name: "Rooftop Terrace", iconName: "Sun" },
        { id: "am-10", name: "Airport Transfers", iconName: "Plane" },
      ],
      rooms: [
        {
          id: "rm-4",
          name: "Superior Courtyard Room",
          bedType: "1 Queen Bed",
          occupancy: "2 Guests",
          pricePerNight: 210.0,
          amenities: ["Garden Terrace Access", "Rain Shower", "Artisan Toiletries"],
          isAvailable: true,
          imageURL: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop",
        },
      ],
    },
  },
];
