//
//  Models.swift
//  MAPPIE
//
//  Wayfinder Core Domain Models & Curated Catalog
//

import Foundation
import CoreLocation
import MapKit

// MARK: - Category
public enum PlaceCategory: String, CaseIterable, Codable, Identifiable {
    case all = "All"
    case restaurant = "Restaurants"
    case cafe = "Cafés"
    case hotel = "Hotels"
    case attraction = "Attractions"
    case shopping = "Shopping"
    case nature = "Nature"
    case landmark = "Landmarks"
    
    public var id: String { rawValue }
    
    public var iconName: String {
        switch self {
        case .all: return "sparkles"
        case .restaurant: return "fork.knife"
        case .cafe: return "cup.and.saucer.fill"
        case .hotel: return "bed.double.fill"
        case .attraction: return "camera.fill"
        case .shopping: return "bag.fill"
        case .nature: return "leaf.fill"
        case .landmark: return "building.columns.fill"
        }
    }
}

// MARK: - Place Model
public struct Place: Identifiable, Equatable, Hashable {
    public let id: String
    public let name: String
    public let category: PlaceCategory
    public let rating: Double
    public let reviewCount: Int
    public let coordinate: CLLocationCoordinate2D
    public let address: String
    public let priceLevel: Int // 1 to 4
    public let isOpen: Bool
    public let openingHours: String
    public let phone: String
    public let website: String
    public let imageURLs: [String]
    public let atmosphereTags: [String]
    public let editorialDescription: String
    
    // Category specifics
    public let restaurantInfo: RestaurantInfo?
    public let hotelInfo: HotelInfo?
    public let attractionInfo: AttractionInfo?
    
    public init(
        id: String = UUID().uuidString,
        name: String,
        category: PlaceCategory,
        rating: Double,
        reviewCount: Int,
        coordinate: CLLocationCoordinate2D,
        address: String,
        priceLevel: Int,
        isOpen: Bool = true,
        openingHours: String,
        phone: String,
        website: String,
        imageURLs: [String],
        atmosphereTags: [String] = [],
        editorialDescription: String,
        restaurantInfo: RestaurantInfo? = nil,
        hotelInfo: HotelInfo? = nil,
        attractionInfo: AttractionInfo? = nil
    ) {
        self.id = id
        self.name = name
        self.category = category
        self.rating = rating
        self.reviewCount = reviewCount
        self.coordinate = coordinate
        self.address = address
        self.priceLevel = priceLevel
        self.isOpen = isOpen
        self.openingHours = openingHours
        self.phone = phone
        self.website = website
        self.imageURLs = imageURLs
        self.atmosphereTags = atmosphereTags
        self.editorialDescription = editorialDescription
        self.restaurantInfo = restaurantInfo
        self.hotelInfo = hotelInfo
        self.attractionInfo = attractionInfo
    }
    
    public static func == (lhs: Place, rhs: Place) -> Bool {
        lhs.id == rhs.id
    }
    
    public func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
    
    public var priceString: String {
        String(repeating: "$", count: max(1, min(4, priceLevel)))
    }
}

// MARK: - Restaurant Info & Menu
public struct RestaurantInfo: Equatable, Hashable {
    public let cuisine: String
    public let atmosphereDescription: String
    public let menuCategories: [MenuCategory]
    
    public init(cuisine: String, atmosphereDescription: String, menuCategories: [MenuCategory]) {
        self.cuisine = cuisine
        self.atmosphereDescription = atmosphereDescription
        self.menuCategories = menuCategories
    }
}

public struct MenuCategory: Identifiable, Equatable, Hashable {
    public let id: String
    public let title: String
    public let items: [MenuItem]
    
    public init(id: String = UUID().uuidString, title: String, items: [MenuItem]) {
        self.id = id
        self.title = title
        self.items = items
    }
}

public struct MenuItem: Identifiable, Equatable, Hashable {
    public let id: String
    public let name: String
    public let description: String
    public let price: Double
    public let isSpecial: Bool
    
    public init(id: String = UUID().uuidString, name: String, description: String, price: Double, isSpecial: Bool = false) {
        self.id = id
        self.name = name
        self.description = description
        self.price = price
        self.isSpecial = isSpecial
    }
}

// MARK: - Hotel Info & Rooms
public struct HotelInfo: Equatable, Hashable {
    public let stars: Int
    public let pricePerNight: Double
    public let amenities: [Amenity]
    public let rooms: [HotelRoom]
    
    public init(stars: Int, pricePerNight: Double, amenities: [Amenity], rooms: [HotelRoom]) {
        self.stars = stars
        self.pricePerNight = pricePerNight
        self.amenities = amenities
        self.rooms = rooms
    }
}

public struct Amenity: Identifiable, Equatable, Hashable {
    public let id: String
    public let name: String
    public let iconName: String
    
    public init(id: String = UUID().uuidString, name: String, iconName: String) {
        self.id = id
        self.name = name
        self.iconName = iconName
    }
}

public struct HotelRoom: Identifiable, Equatable, Hashable {
    public let id: String
    public let name: String
    public let bedType: String
    public let occupancy: String
    public let pricePerNight: Double
    public let amenities: [String]
    public let isAvailable: Bool
    public let imageURL: String
    
    public init(
        id: String = UUID().uuidString,
        name: String,
        bedType: String,
        occupancy: String,
        pricePerNight: Double,
        amenities: [String],
        isAvailable: Bool = true,
        imageURL: String
    ) {
        self.id = id
        self.name = name
        self.bedType = bedType
        self.occupancy = occupancy
        self.pricePerNight = pricePerNight
        self.amenities = amenities
        self.isAvailable = isAvailable
        self.imageURL = imageURL
    }
}

// MARK: - Attraction Info
public struct AttractionInfo: Equatable, Hashable {
    public let highlights: [String]
    public let ticketPrice: String
    public let bestTimeToVisit: String
    
    public init(highlights: [String], ticketPrice: String, bestTimeToVisit: String) {
        self.highlights = highlights
        self.ticketPrice = ticketPrice
        self.bestTimeToVisit = bestTimeToVisit
    }
}

// MARK: - Saved Place & Collections
public struct PlaceCollection: Identifiable, Equatable, Hashable {
    public let id: String
    public var name: String
    public var iconName: String
    public var colorHex: UInt
    
    public init(id: String = UUID().uuidString, name: String, iconName: String, colorHex: UInt = 0x7C5CFF) {
        self.id = id
        self.name = name
        self.iconName = iconName
        self.colorHex = colorHex
    }
}

public struct SavedPlaceItem: Identifiable, Equatable, Hashable {
    public let id: String
    public let place: Place
    public var collectionId: String?
    public let savedAt: Date
    
    public init(id: String = UUID().uuidString, place: Place, collectionId: String? = nil, savedAt: Date = Date()) {
        self.id = id
        self.place = place
        self.collectionId = collectionId
        self.savedAt = savedAt
    }
}

// MARK: - Route & Navigation
public struct RouteStepInfo: Identifiable, Equatable {
    public let id: String
    public let instruction: String
    public let distanceFormatted: String
    
    public init(id: String = UUID().uuidString, instruction: String, distanceFormatted: String) {
        self.id = id
        self.instruction = instruction
        self.distanceFormatted = distanceFormatted
    }
}

public struct RouteDetails: Equatable {
    public let destinationName: String
    public let travelTimeFormatted: String
    public let distanceFormatted: String
    public let transportType: MKDirectionsTransportType
    public let steps: [RouteStepInfo]
    public let polylineCoordinates: [CLLocationCoordinate2D]
    
    public init(
        destinationName: String,
        travelTimeFormatted: String,
        distanceFormatted: String,
        transportType: MKDirectionsTransportType = .automobile,
        steps: [RouteStepInfo],
        polylineCoordinates: [CLLocationCoordinate2D] = []
    ) {
        self.destinationName = destinationName
        self.travelTimeFormatted = travelTimeFormatted
        self.distanceFormatted = distanceFormatted
        self.transportType = transportType
        self.steps = steps
        self.polylineCoordinates = polylineCoordinates
    }
    
    public static func == (lhs: RouteDetails, rhs: RouteDetails) -> Bool {
        lhs.destinationName == rhs.destinationName &&
        lhs.travelTimeFormatted == rhs.travelTimeFormatted &&
        lhs.distanceFormatted == rhs.distanceFormatted &&
        lhs.transportType == rhs.transportType
    }
}

// MARK: - Curated Mock Catalog
public struct MockData {
    public static let defaultCollections: [PlaceCollection] = [
        PlaceCollection(id: "col-weekend", name: "Weekend Escapes", iconName: "sparkles", colorHex: 0x0EA5E9),
        PlaceCollection(id: "col-datenight", name: "Date Night", iconName: "heart.fill", colorHex: 0xF97316),
        PlaceCollection(id: "col-cafes", name: "Cozy Cafés", iconName: "cup.and.saucer.fill", colorHex: 0xFB923C),
        PlaceCollection(id: "col-places", name: "Places to Visit", iconName: "bookmark.fill", colorHex: 0x0284C7)
    ]
    
    public static let samplePlaces: [Place] = [
        // 1. Restaurant
        Place(
            id: "place-1",
            name: "The Gallery Café",
            category: .restaurant,
            rating: 4.8,
            reviewCount: 342,
            coordinate: CLLocationCoordinate2D(latitude: 6.8969, longitude: 79.8587),
            address: "2 Alfred House Rd, Colombo 00300",
            priceLevel: 3,
            isOpen: true,
            openingHours: "10:00 AM – 11:30 PM",
            phone: "+94 11 258 2162",
            website: "https://paradiseroad.lk",
            imageURLs: [
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop"
            ],
            atmosphereTags: ["Romantic", "Outdoor Courtyard", "Elegant", "Geoffrey Bawa Architecture", "Date Night"],
            editorialDescription: "Housed in the former offices of renowned world architect Geoffrey Bawa, The Gallery Café features an open courtyard with reflecting pools and modern contemporary art. An iconic Sri Lankan culinary destination.",
            restaurantInfo: RestaurantInfo(
                cuisine: "Contemporary Sri Lankan & Italian",
                atmosphereDescription: "Soothing reflecting ponds, candlelight, open-air colonial verandas, and bespoke art pieces created by local artisans.",
                menuCategories: [
                    MenuCategory(title: "STARTERS", items: [
                        MenuItem(name: "Truffle Crostini", description: "Wild mushroom · shaved parmesan · white truffle essence", price: 14.0, isSpecial: true),
                        MenuItem(name: "Lemongrass Prawn Skewers", description: "Jumbo prawns · sweet chili glaze · lime leaf", price: 18.0),
                        MenuItem(name: "Burrata & Heirloom Tomatoes", description: "Basil pesto · aged balsamic reduction · sea salt", price: 16.0)
                    ]),
                    MenuCategory(title: "MAIN COURSE", items: [
                        MenuItem(name: "Black Pepper Crab Risotto", description: "Lagoon crab · arborio rice · cracked black pepper · herbs", price: 28.0, isSpecial: true),
                        MenuItem(name: "Truffle Handcrafted Pasta", description: "Creamy parmesan emulsion · hand-rolled fettuccine · summer black truffle", price: 24.0),
                        MenuItem(name: "Pan-Seared Sea Bass", description: "Saffron potato puree · baby asparagus · lemon butter", price: 26.0)
                    ]),
                    MenuCategory(title: "DESSERTS", items: [
                        MenuItem(name: "Signature Jaggery Crème Brûlée", description: "Infused with organic kitul treacle and roasted cashew crisp", price: 12.0, isSpecial: true),
                        MenuItem(name: "Dark Chocolate Fondant", description: "Warm molten center · salted caramel gelato", price: 13.0)
                    ]),
                    MenuCategory(title: "DRINKS & COCKTAILS", items: [
                        MenuItem(name: "Passion Fruit Arrack Sour", description: "Ceylon coconut spirit · fresh passion fruit · aromatic bitters", price: 15.0),
                        MenuItem(name: "Artisan Ginger Lemongrass Cooler", description: "Cold-pressed ginger · citrus juice · sparkling soda", price: 8.0)
                    ])
                ]
            )
        ),
        
        // 2. Hotel
        Place(
            id: "place-2",
            name: "Amangalla Heritage",
            category: .hotel,
            rating: 4.9,
            reviewCount: 428,
            coordinate: CLLocationCoordinate2D(latitude: 6.0287, longitude: 80.2173),
            address: "10 Church Street, Galle Fort",
            priceLevel: 4,
            isOpen: true,
            openingHours: "Open 24 Hours",
            phone: "+94 91 223 3388",
            website: "https://aman.com/resorts/amangalla",
            imageURLs: [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop"
            ],
            atmosphereTags: ["Luxury Heritage", "Historic 1684", "Peaceful Garden", "Ayurvedic Spa"],
            editorialDescription: "Set within the ramparts of seventeenth-century Galle Fort, Amangalla is a living museum of colonial serenity, offering four-poster beds, polished teak floorboards, and unmatched world-class hospitality.",
            hotelInfo: HotelInfo(
                stars: 5,
                pricePerNight: 480.0,
                amenities: [
                    Amenity(name: "High-Speed Wi-Fi", iconName: "wifi"),
                    Amenity(name: "Garden Swimming Pool", iconName: "water.waves"),
                    Amenity(name: "The Baths Hydrotherapy Spa", iconName: "sparkles"),
                    Amenity(name: "Signature Breakfast Included", iconName: "cup.and.saucer.fill"),
                    Amenity(name: "Valet Parking", iconName: "car.fill"),
                    Amenity(name: "Fine Dining Restaurant", iconName: "fork.knife")
                ],
                rooms: [
                    HotelRoom(
                        name: "Heritage Verandah Suite",
                        bedType: "1 Four-Poster King Bed",
                        occupancy: "2 Adults",
                        pricePerNight: 480.0,
                        amenities: ["Private Balcony overlooking Garden", "Freestanding Clawfoot Tub", "Complimentary Mini Bar"],
                        imageURL: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop"
                    ),
                    HotelRoom(
                        name: "Church Street Chamber",
                        bedType: "1 Super King Bed",
                        occupancy: "2 Adults · 1 Child",
                        pricePerNight: 620.0,
                        amenities: ["Original 17th-Century Antiques", "Twin Marble Vanities", "Butler Service"],
                        imageURL: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop"
                    ),
                    HotelRoom(
                        name: "Garden Pavilion Villa",
                        bedType: "2 Queen Beds",
                        occupancy: "4 Guests",
                        pricePerNight: 890.0,
                        amenities: ["Private Plunge Pool", "Outdoor Rain Shower", "Daily Afternoon High Tea"],
                        imageURL: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop"
                    )
                ]
            )
        ),
        
        // 3. Cafe
        Place(
            id: "place-3",
            name: "Kiku Espresso & Botanicals",
            category: .cafe,
            rating: 4.7,
            reviewCount: 198,
            coordinate: CLLocationCoordinate2D(latitude: 6.8856, longitude: 79.8601),
            address: "Havelock Town, Colombo 00500",
            priceLevel: 2,
            isOpen: true,
            openingHours: "8:00 AM – 7:00 PM",
            phone: "+94 11 433 9900",
            website: "https://kiku.design",
            imageURLs: [
                "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop"
            ],
            atmosphereTags: ["Minimalist", "Japanese-Inspired", "Quiet", "Work Friendly", "Specialty Coffee"],
            editorialDescription: "A serene Tokyo-inspired café combining handcrafted single-origin coffee with house-baked pastries and seasonal botanical infusions.",
            restaurantInfo: RestaurantInfo(
                cuisine: "Japanese Café & Specialty Roasts",
                atmosphereDescription: "Pale wood, unadorned concrete surfaces, soft lo-fi beats, and warm natural sunlight.",
                menuCategories: [
                    MenuCategory(title: "COFFEE", items: [
                        MenuItem(name: "Kyoto Cold Brew", description: "12-hour slow drip extraction · fruity floral notes", price: 6.5),
                        MenuItem(name: "Oat Cortado", description: "Double espresso ristretto · micro-foamed oat milk", price: 5.5),
                        MenuItem(name: "Ceremonial Matcha Latte", description: "Single-origin Uji matcha · steamed milk", price: 7.0, isSpecial: true)
                    ]),
                    MenuCategory(title: "SWEET & SAVORY", items: [
                        MenuItem(name: "Shokupan Avocado Toast", description: "Japanese milk bread · poached organic egg · furikake", price: 11.0),
                        MenuItem(name: "Yuzu Miso French Toast", description: "Caramelized brioche · whipped mascarpone · yuzu curd", price: 13.0, isSpecial: true)
                    ])
                ]
            )
        ),
        
        // 4. Landmark / Attraction
        Place(
            id: "place-4",
            name: "Galle Fort Lighthouse",
            category: .landmark,
            rating: 4.9,
            reviewCount: 920,
            coordinate: CLLocationCoordinate2D(latitude: 6.0247, longitude: 80.2201),
            address: "Rampart St, Galle Fort",
            priceLevel: 1,
            isOpen: true,
            openingHours: "Open 24 Hours",
            phone: "+94 91 223 4400",
            website: "https://whc.unesco.org",
            imageURLs: [
                "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop"
            ],
            atmosphereTags: ["Scenic Ocean Views", "UNESCO World Heritage", "Sunset Point", "Historic Landmark"],
            editorialDescription: "Built in 1939 on the Point Utrecht Bastion of Galle Fort, this iconic 26.5-meter lighthouse overlooks the Indian Ocean and is surrounded by swaying palm trees.",
            attractionInfo: AttractionInfo(
                highlights: ["360° panoramic view of the Indian Ocean", "Walkable coastal ramparts", "Best sunset vantage point in southern Sri Lanka"],
                ticketPrice: "Free Admission",
                bestTimeToVisit: "5:00 PM – 6:30 PM for breathtaking golden hour"
            )
        ),
        
        // 5. Restaurant (Japanese)
        Place(
            id: "place-5",
            name: "Nihonbashi Modern",
            category: .restaurant,
            rating: 4.8,
            reviewCount: 512,
            coordinate: CLLocationCoordinate2D(latitude: 6.9150, longitude: 79.8550),
            address: "Galle Face Terrace, Colombo 00300",
            priceLevel: 4,
            isOpen: true,
            openingHours: "12:00 PM – 2:30 PM, 6:30 PM – 11:00 PM",
            phone: "+94 11 232 3847",
            website: "https://nihonbashi.net",
            imageURLs: [
                "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop"
            ],
            atmosphereTags: ["Fine Dining", "Bamboo Garden", "Sushi Bar", "Intimate", "Date Night"],
            editorialDescription: "Ranked among Asia’s 50 Best Restaurants, Nihonbashi serves authentic yakitori and pristine sashimi sourced fresh daily from the Indian Ocean.",
            restaurantInfo: RestaurantInfo(
                cuisine: "Authentic Japanese & Sushi",
                atmosphereDescription: "Traditional Japanese Tatami rooms, dark slate stone, and private bamboo garden pavilions.",
                menuCategories: [
                    MenuCategory(title: "SASHIMI & NIGIRI", items: [
                        MenuItem(name: "Yellowfin Tuna O-Toro", description: "Pristine sashimi cut · fresh grated wasabi", price: 32.0, isSpecial: true),
                        MenuItem(name: "Botan Ebi Nigiri", description: "Sweet jumbo prawn · nikiri soy glaze", price: 26.0)
                    ]),
                    MenuCategory(title: "YAKITORI & ROBATA", items: [
                        MenuItem(name: "Wagyu A5 Skewers", description: "Charcoal grilled Miyazaki beef · Maldon sea salt", price: 42.0, isSpecial: true),
                        MenuItem(name: "Tare Glazed Chicken Thigh", description: "Binchotan grilled · scallions · 30-year aged tare", price: 18.0)
                    ])
                ]
            )
        ),
        
        // 6. Hotel (Boutique)
        Place(
            id: "place-6",
            name: "Taru Villas - Lake Lodge",
            category: .hotel,
            rating: 4.8,
            reviewCount: 175,
            coordinate: CLLocationCoordinate2D(latitude: 6.9080, longitude: 79.8590),
            address: "Alwis Terrace, Colombo 00300",
            priceLevel: 3,
            isOpen: true,
            openingHours: "Open 24 Hours",
            phone: "+94 11 232 5566",
            website: "https://taruvillas.com",
            imageURLs: [
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop"
            ],
            atmosphereTags: ["Boutique Hideaway", "Tranquil Lake View", "Contemporary Art", "Lush Courtyard"],
            editorialDescription: "An oasis of quiet chic located moments away from the heart of the city, overlooking the peaceful waters of Beira Lake.",
            hotelInfo: HotelInfo(
                stars: 4,
                pricePerNight: 210.0,
                amenities: [
                    Amenity(name: "High-Speed Wi-Fi", iconName: "wifi"),
                    Amenity(name: "Courtyard Dining", iconName: "fork.knife"),
                    Amenity(name: "Rooftop Terrace", iconName: "sun.max.fill"),
                    Amenity(name: "Airport Transfers", iconName: "airplane")
                ],
                rooms: [
                    HotelRoom(
                        name: "Superior Courtyard Room",
                        bedType: "1 Queen Bed",
                        occupancy: "2 Guests",
                        pricePerNight: 210.0,
                        amenities: ["Garden Terrace Access", "Rain Shower", "Artisan Toiletries"],
                        imageURL: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop"
                    )
                ]
            )
        )
    ]
}
