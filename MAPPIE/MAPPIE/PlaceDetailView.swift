//
//  PlaceDetailView.swift
//  MAPPIE
//
//  Rich Place Experience (Restaurant menus, Hotel rooms & booking, Atmosphere, Directions)
//

import SwiftUI
import MapKit

public struct PlaceDetailView: View {
    public let place: Place
    @ObservedObject var repository = PlacesRepository.shared
    @Environment(\.dismiss) private var dismiss
    
    @State private var selectedMenuCategoryIndex: Int = 0
    @State private var showingBookingSheet: Bool = false
    @State private var showingDirectionsSheet: Bool = false
    @State private var showingCollectionPicker: Bool = false
    @State private var selectedRoomForBooking: HotelRoom? = nil
    @State private var activePhotoIndex: Int = 0
    
    public init(place: Place) {
        self.place = place
    }
    
    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // MARK: - Header Image Gallery
                    ZStack(alignment: .bottomTrailing) {
                        TabView(selection: $activePhotoIndex) {
                            ForEach(0..<place.imageURLs.count, id: \.self) { index in
                                AsyncImage(url: URL(string: place.imageURLs[index])) { phase in
                                    switch phase {
                                    case .success(let img):
                                        img.resizable().aspectRatio(contentMode: .fill)
                                    default:
                                        Rectangle().fill(Color(UIColor.secondarySystemFill))
                                            .overlay(Image(systemName: place.category.iconName).font(.system(size: 40)).foregroundColor(AppTheme.primaryPurple))
                                    }
                                }
                                .tag(index)
                            }
                        }
                        .tabViewStyle(.page(indexDisplayMode: .always))
                        .frame(height: 280)
                        
                        // Price Level Badge
                        Text(place.priceString)
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(.ultraThinMaterial, in: Capsule())
                            .padding(16)
                    }
                    
                    VStack(alignment: .leading, spacing: 20) {
                        // MARK: - Title & Meta Header
                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                Text(place.category.rawValue.uppercased())
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(AppTheme.primaryPurple)
                                    .tracking(1.2)
                                
                                Spacer()
                                
                                HStack(spacing: 4) {
                                    Circle()
                                        .fill(place.isOpen ? AppTheme.emeraldGreen : AppTheme.coralRed)
                                        .frame(width: 8, height: 8)
                                    Text(place.isOpen ? "Open Now" : "Closed")
                                        .font(.system(size: 13, weight: .semibold))
                                        .foregroundColor(place.isOpen ? AppTheme.emeraldGreen : AppTheme.coralRed)
                                }
                            }
                            
                            Text(place.name)
                                .font(.system(size: 28, weight: .bold))
                                .foregroundColor(AppTheme.textPrimary)
                            
                            HStack(spacing: 8) {
                                RatingBadge(rating: place.rating, reviewCount: place.reviewCount)
                                
                                Text("•")
                                    .foregroundColor(AppTheme.textTertiary)
                                
                                Text(place.openingHours)
                                    .font(.system(size: 13))
                                    .foregroundColor(AppTheme.textSecondary)
                            }
                            
                            HStack(spacing: 6) {
                                Image(systemName: "mappin.and.ellipse")
                                    .font(.system(size: 13))
                                    .foregroundColor(AppTheme.primaryPurple)
                                Text(place.address)
                                    .font(.system(size: 13))
                                    .foregroundColor(AppTheme.textSecondary)
                            }
                        }
                        
                        // MARK: - Primary Action Buttons
                        HStack(spacing: 12) {
                            Button(action: { showingDirectionsSheet = true }) {
                                HStack {
                                    Image(systemName: "arrow.triangle.turn.up.right.diamond.fill")
                                    Text("Directions")
                                }
                                .font(.system(size: 15, weight: .semibold))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(AppTheme.primaryPurple)
                                .cornerRadius(AppTheme.radiusMedium)
                                .shadow(color: AppTheme.primaryPurple.opacity(0.35), radius: 8, x: 0, y: 3)
                            }
                            
                            Button(action: {
                                repository.toggleSave(place: place)
                            }) {
                                HStack {
                                    Image(systemName: repository.isSaved(place: place) ? "bookmark.fill" : "bookmark")
                                    Text(repository.isSaved(place: place) ? "Saved" : "Save")
                                }
                                .font(.system(size: 15, weight: .semibold))
                                .foregroundColor(repository.isSaved(place: place) ? AppTheme.vibrantOrange : AppTheme.textPrimary)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(Color(UIColor.secondarySystemGroupedBackground))
                                .cornerRadius(AppTheme.radiusMedium)
                                .overlay(
                                    RoundedRectangle(cornerRadius: AppTheme.radiusMedium)
                                        .stroke(repository.isSaved(place: place) ? AppTheme.vibrantOrange : AppTheme.subtleBorder, lineWidth: 1)
                                )
                            }
                        }
                        
                        // MARK: - Atmosphere Tags
                        if !place.atmosphereTags.isEmpty {
                            VStack(alignment: .leading, spacing: 10) {
                                Text("Atmosphere & Vibe")
                                    .font(.system(size: 17, weight: .semibold))
                                    .foregroundColor(AppTheme.textPrimary)
                                
                                ScrollView(.horizontal, showsIndicators: false) {
                                    HStack(spacing: 8) {
                                        ForEach(place.atmosphereTags, id: \.self) { tag in
                                            AtmosphereTag(title: tag)
                                        }
                                    }
                                }
                                
                                if let restaurant = place.restaurantInfo {
                                    Text(restaurant.atmosphereDescription)
                                        .font(.system(size: 14))
                                        .foregroundColor(AppTheme.textSecondary)
                                        .lineSpacing(3)
                                }
                            }
                            .padding(16)
                            .minimalCard()
                        }
                        
                        // MARK: - Editorial Overview
                        VStack(alignment: .leading, spacing: 8) {
                            Text("About")
                                .font(.system(size: 17, weight: .semibold))
                                .foregroundColor(AppTheme.textPrimary)
                            
                            Text(place.editorialDescription)
                                .font(.system(size: 15))
                                .foregroundColor(AppTheme.textSecondary)
                                .lineSpacing(4)
                        }
                        .padding(16)
                        .minimalCard()
                        
                        // MARK: - Restaurant Digital Menu Experience
                        if let restaurant = place.restaurantInfo, !restaurant.menuCategories.isEmpty {
                            VStack(alignment: .leading, spacing: 14) {
                                HStack {
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text("Digital Menu")
                                            .font(.system(size: 20, weight: .bold))
                                            .foregroundColor(AppTheme.textPrimary)
                                        Text(restaurant.cuisine)
                                            .font(.system(size: 13))
                                            .foregroundColor(AppTheme.primaryPurple)
                                    }
                                    Spacer()
                                }
                                
                                // Category Selector Tabs
                                ScrollView(.horizontal, showsIndicators: false) {
                                    HStack(spacing: 8) {
                                        ForEach(0..<restaurant.menuCategories.count, id: \.self) { idx in
                                            let cat = restaurant.menuCategories[idx]
                                            Button(action: { selectedMenuCategoryIndex = idx }) {
                                                Text(cat.title)
                                                    .font(.system(size: 13, weight: .bold))
                                                    .padding(.horizontal, 14)
                                                    .padding(.vertical, 8)
                                                    .background(selectedMenuCategoryIndex == idx ? AppTheme.primaryPurple : Color(UIColor.tertiarySystemGroupedBackground))
                                                    .foregroundColor(selectedMenuCategoryIndex == idx ? .white : AppTheme.textPrimary)
                                                    .clipShape(Capsule())
                                            }
                                        }
                                    }
                                }
                                
                                // Menu Items List
                                let currentCategory = restaurant.menuCategories[selectedMenuCategoryIndex]
                                VStack(spacing: 12) {
                                    ForEach(currentCategory.items) { item in
                                        HStack(alignment: .top) {
                                            VStack(alignment: .leading, spacing: 4) {
                                                HStack(spacing: 6) {
                                                    Text(item.name)
                                                        .font(.system(size: 16, weight: .semibold))
                                                        .foregroundColor(AppTheme.textPrimary)
                                                    
                                                    if item.isSpecial {
                                                        Text("CHEF'S PICK")
                                                            .font(.system(size: 9, weight: .bold))
                                                            .foregroundColor(AppTheme.vibrantOrange)
                                                            .padding(.horizontal, 6)
                                                            .padding(.vertical, 2)
                                                            .background(AppTheme.vibrantOrange.opacity(0.12), in: Capsule())
                                                    }
                                                }
                                                
                                                Text(item.description)
                                                    .font(.system(size: 13))
                                                    .foregroundColor(AppTheme.textSecondary)
                                                    .lineLimit(2)
                                            }
                                            
                                            Spacer()
                                            
                                            Text(String(format: "$%.0f", item.price))
                                                .font(.system(size: 16, weight: .bold))
                                                .foregroundColor(AppTheme.primaryPurple)
                                        }
                                        .padding(.vertical, 8)
                                        
                                        if item.id != currentCategory.items.last?.id {
                                            Divider()
                                        }
                                    }
                                }
                                .padding(16)
                                .background(Color(UIColor.secondarySystemGroupedBackground))
                                .cornerRadius(AppTheme.radiusMedium)
                                .overlay(
                                    RoundedRectangle(cornerRadius: AppTheme.radiusMedium)
                                        .stroke(AppTheme.subtleBorder, lineWidth: 1)
                                )
                            }
                        }
                        
                        // MARK: - Hotel Experience (Amenities & Rooms)
                        if let hotel = place.hotelInfo {
                            VStack(alignment: .leading, spacing: 16) {
                                Text("Hotel Amenities")
                                    .font(.system(size: 20, weight: .bold))
                                    .foregroundColor(AppTheme.textPrimary)
                                
                                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                                    ForEach(hotel.amenities) { amenity in
                                        HStack(spacing: 10) {
                                            Image(systemName: amenity.iconName)
                                                .font(.system(size: 16))
                                                .foregroundColor(AppTheme.primaryPurple)
                                                .frame(width: 28, height: 28)
                                                .background(AppTheme.primaryPurple.opacity(0.1), in: Circle())
                                            
                                            Text(amenity.name)
                                                .font(.system(size: 13, weight: .medium))
                                                .foregroundColor(AppTheme.textPrimary)
                                                .lineLimit(1)
                                            
                                            Spacer()
                                        }
                                    }
                                }
                                .padding(16)
                                .minimalCard()
                                
                                Text("Available Rooms")
                                    .font(.system(size: 20, weight: .bold))
                                    .foregroundColor(AppTheme.textPrimary)
                                
                                ForEach(hotel.rooms) { room in
                                    VStack(alignment: .leading, spacing: 12) {
                                        AsyncImage(url: URL(string: room.imageURL)) { phase in
                                            switch phase {
                                            case .success(let img):
                                                img.resizable().aspectRatio(contentMode: .fill)
                                            default:
                                                Rectangle().fill(AppTheme.primaryPurple.opacity(0.15))
                                            }
                                        }
                                        .frame(height: 140)
                                        .clipped()
                                        .cornerRadius(AppTheme.radiusMedium)
                                        
                                        HStack {
                                            VStack(alignment: .leading, spacing: 4) {
                                                Text(room.name)
                                                    .font(.system(size: 17, weight: .bold))
                                                    .foregroundColor(AppTheme.textPrimary)
                                                
                                                Text("\(room.bedType) • \(room.occupancy)")
                                                    .font(.system(size: 13))
                                                    .foregroundColor(AppTheme.textSecondary)
                                            }
                                            
                                            Spacer()
                                            
                                            VStack(alignment: .trailing, spacing: 2) {
                                                Text(String(format: "$%.0f", room.pricePerNight))
                                                    .font(.system(size: 18, weight: .bold))
                                                    .foregroundColor(AppTheme.primaryPurple)
                                                Text("per night")
                                                    .font(.system(size: 11))
                                                    .foregroundColor(AppTheme.textTertiary)
                                            }
                                        }
                                        
                                        HStack {
                                            ForEach(room.amenities.prefix(2), id: \.self) { item in
                                                Text(item)
                                                    .font(.system(size: 11))
                                                    .foregroundColor(AppTheme.textSecondary)
                                                    .padding(.horizontal, 8)
                                                    .padding(.vertical, 4)
                                                    .background(Color(UIColor.tertiarySystemGroupedBackground), in: Capsule())
                                            }
                                            
                                            Spacer()
                                            
                                            Button(action: {
                                                selectedRoomForBooking = room
                                                showingBookingSheet = true
                                            }) {
                                                Text("Book Now")
                                                    .font(.system(size: 13, weight: .bold))
                                                    .foregroundColor(.white)
                                                    .padding(.horizontal, 16)
                                                    .padding(.vertical, 8)
                                                    .background(AppTheme.vibrantOrange)
                                                    .clipShape(Capsule())
                                            }
                                        }
                                    }
                                    .padding(14)
                                    .minimalCard()
                                }
                            }
                        }
                        
                        // MARK: - Attraction Highlights
                        if let attraction = place.attractionInfo {
                            VStack(alignment: .leading, spacing: 12) {
                                Text("Visitor Highlights")
                                    .font(.system(size: 18, weight: .bold))
                                    .foregroundColor(AppTheme.textPrimary)
                                
                                ForEach(attraction.highlights, id: \.self) { highlight in
                                    HStack(alignment: .top, spacing: 10) {
                                        Image(systemName: "checkmark.seal.fill")
                                            .foregroundColor(AppTheme.primaryPurple)
                                            .font(.system(size: 14))
                                        Text(highlight)
                                            .font(.system(size: 14))
                                            .foregroundColor(AppTheme.textSecondary)
                                    }
                                }
                                
                                Divider().padding(.vertical, 4)
                                
                                HStack {
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text("Admission")
                                            .font(.system(size: 12))
                                            .foregroundColor(AppTheme.textTertiary)
                                        Text(attraction.ticketPrice)
                                            .font(.system(size: 14, weight: .semibold))
                                            .foregroundColor(AppTheme.textPrimary)
                                    }
                                    Spacer()
                                    VStack(alignment: .trailing, spacing: 2) {
                                        Text("Recommended Time")
                                            .font(.system(size: 12))
                                            .foregroundColor(AppTheme.textTertiary)
                                        Text(attraction.bestTimeToVisit)
                                            .font(.system(size: 13, weight: .medium))
                                            .foregroundColor(AppTheme.primaryPurple)
                                    }
                                }
                            }
                            .padding(16)
                            .minimalCard()
                        }
                        
                        // MARK: - Contact & Web
                        VStack(spacing: 12) {
                            if let phoneURL = URL(string: "tel:\(place.phone.replacingOccurrences(of: " ", with: ""))") {
                                Link(destination: phoneURL) {
                                    HStack {
                                        Image(systemName: "phone.fill")
                                            .foregroundColor(AppTheme.primaryPurple)
                                        Text(place.phone)
                                            .font(.system(size: 14, weight: .medium))
                                            .foregroundColor(AppTheme.textPrimary)
                                        Spacer()
                                        Image(systemName: "arrow.up.right")
                                            .font(.system(size: 12))
                                            .foregroundColor(AppTheme.textTertiary)
                                    }
                                    .padding(.vertical, 8)
                                }
                            }
                            
                            Divider()
                            
                            if let webURL = URL(string: place.website) {
                                Link(destination: webURL) {
                                    HStack {
                                        Image(systemName: "globe")
                                            .foregroundColor(AppTheme.primaryPurple)
                                        Text(place.website)
                                            .font(.system(size: 14, weight: .medium))
                                            .foregroundColor(AppTheme.textPrimary)
                                            .lineLimit(1)
                                        Spacer()
                                        Image(systemName: "arrow.up.right")
                                            .font(.system(size: 12))
                                            .foregroundColor(AppTheme.textTertiary)
                                    }
                                    .padding(.vertical, 8)
                                }
                            }
                        }
                        .padding(16)
                        .minimalCard()
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 40)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 22))
                            .foregroundColor(AppTheme.textTertiary)
                    }
                }
                
                ToolbarItem(placement: .primaryAction) {
                    Button(action: {
                        repository.toggleSave(place: place)
                    }) {
                        Image(systemName: repository.isSaved(place: place) ? "bookmark.fill" : "bookmark")
                            .font(.system(size: 18))
                            .foregroundColor(repository.isSaved(place: place) ? AppTheme.primaryPurple : AppTheme.textPrimary)
                    }
                }
            }
            .sheet(isPresented: $showingDirectionsSheet) {
                DirectionsSheetView(destination: place)
            }
            .sheet(isPresented: $showingBookingSheet) {
                if let room = selectedRoomForBooking {
                    HotelBookingSheet(hotel: place, room: room)
                }
            }
        }
    }
}

// MARK: - Hotel Booking Sheet
public struct HotelBookingSheet: View {
    public let hotel: Place
    public let room: HotelRoom
    @Environment(\.dismiss) private var dismiss
    @State private var checkInDate: Date = Date()
    @State private var checkOutDate: Date = Calendar.current.date(byAdding: .day, value: 2, to: Date()) ?? Date()
    @State private var guestsCount: Int = 2
    @State private var isBooked: Bool = false
    
    public var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                if isBooked {
                    VStack(spacing: 16) {
                        Image(systemName: "checkmark.circle.fill")
                            .font(.system(size: 64))
                            .foregroundColor(AppTheme.emeraldGreen)
                        
                        Text("Reservation Confirmed!")
                            .font(.system(size: 22, weight: .bold))
                        
                        Text("Your stay at \(hotel.name) for \(room.name) has been booked.")
                            .font(.system(size: 15))
                            .foregroundColor(AppTheme.textSecondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 24)
                        
                        Button("Done") {
                            dismiss()
                        }
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 32)
                        .padding(.vertical, 12)
                        .background(AppTheme.primaryPurple)
                        .clipShape(Capsule())
                    }
                    .frame(maxHeight: .infinity)
                } else {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 20) {
                            // Room Summary
                            HStack(spacing: 14) {
                                AsyncImage(url: URL(string: room.imageURL)) { phase in
                                    switch phase {
                                    case .success(let img): img.resizable().aspectRatio(contentMode: .fill)
                                    default: Rectangle().fill(AppTheme.primaryPurple.opacity(0.1))
                                    }
                                }
                                .frame(width: 80, height: 80)
                                .cornerRadius(AppTheme.radiusMedium)
                                
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(room.name)
                                        .font(.system(size: 16, weight: .bold))
                                    Text(room.bedType)
                                        .font(.system(size: 13))
                                        .foregroundColor(AppTheme.textSecondary)
                                    Text(String(format: "$%.0f / night", room.pricePerNight))
                                        .font(.system(size: 14, weight: .semibold))
                                        .foregroundColor(AppTheme.primaryPurple)
                                }
                            }
                            .padding(14)
                            .minimalCard()
                            
                            // Dates
                            VStack(spacing: 12) {
                                DatePicker("Check-In", selection: $checkInDate, displayedComponents: .date)
                                Divider()
                                DatePicker("Check-Out", selection: $checkOutDate, displayedComponents: .date)
                                Divider()
                                Stepper("Guests: \(guestsCount)", value: $guestsCount, in: 1...6)
                            }
                            .padding(16)
                            .minimalCard()
                            
                            // Price Calculation
                            let nights = max(1, Calendar.current.dateComponents([.day], from: checkInDate, to: checkOutDate).day ?? 1)
                            let total = Double(nights) * room.pricePerNight
                            
                            VStack(spacing: 8) {
                                HStack {
                                    Text("\(nights) Nights × $\(Int(room.pricePerNight))")
                                        .foregroundColor(AppTheme.textSecondary)
                                    Spacer()
                                    Text(String(format: "$%.0f", total))
                                        .foregroundColor(AppTheme.textPrimary)
                                }
                                HStack {
                                    Text("Taxes & Service Fees")
                                        .foregroundColor(AppTheme.textSecondary)
                                    Spacer()
                                    Text("Included")
                                        .foregroundColor(AppTheme.emeraldGreen)
                                }
                                Divider()
                                HStack {
                                    Text("Total Amount")
                                        .font(.system(size: 17, weight: .bold))
                                    Spacer()
                                    Text(String(format: "$%.0f", total))
                                        .font(.system(size: 20, weight: .bold))
                                        .foregroundColor(AppTheme.vibrantOrange)
                                }
                            }
                            .padding(16)
                            .minimalCard()
                            
                            Button(action: {
                                withAnimation {
                                    isBooked = true
                                }
                            }) {
                                Text("Confirm & Reserve")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 16)
                                    .background(AppTheme.vibrantOrange)
                                    .cornerRadius(AppTheme.radiusMedium)
                                    .shadow(color: AppTheme.vibrantOrange.opacity(0.4), radius: 8, x: 0, y: 3)
                            }
                            .padding(.top, 10)
                        }
                        .padding(20)
                    }
                }
            }
            .navigationTitle("Reserve Room")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close") { dismiss() }
                }
            }
        }
    }
}
