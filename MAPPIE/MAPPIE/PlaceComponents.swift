//
//  PlaceComponents.swift
//  MAPPIE
//
//  Wayfinder Design System Components
//

import SwiftUI
import CoreLocation

// MARK: - Category Chip
public struct CategoryChip: View {
    public let category: PlaceCategory
    public let isSelected: Bool
    public let action: () -> Void
    
    public init(category: PlaceCategory, isSelected: Bool, action: @escaping () -> Void) {
        self.category = category
        self.isSelected = isSelected
        self.action = action
    }
    
    public var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Image(systemName: category.iconName)
                    .font(.system(size: 13, weight: .semibold))
                Text(category.rawValue)
                    .font(.system(size: 14, weight: .medium))
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 8)
            .background(
                Capsule()
                    .fill(isSelected ? AppTheme.primaryPurple : Color(UIColor.secondarySystemGroupedBackground))
            )
            .foregroundColor(isSelected ? .white : AppTheme.textPrimary)
            .overlay(
                Capsule()
                    .stroke(isSelected ? Color.clear : AppTheme.subtleBorder, lineWidth: 1)
            )
            .shadow(color: isSelected ? AppTheme.primaryPurple.opacity(0.3) : Color.black.opacity(0.04), radius: 6, x: 0, y: 2)
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Rating Badge
public struct RatingBadge: View {
    public let rating: Double
    public let reviewCount: Int?
    
    public init(rating: Double, reviewCount: Int? = nil) {
        self.rating = rating
        self.reviewCount = reviewCount
    }
    
    public var body: some View {
        HStack(spacing: 3) {
            Image(systemName: "star.fill")
                .font(.system(size: 11, weight: .bold))
                .foregroundColor(AppTheme.starGold)
            Text(String(format: "%.1f", rating))
                .font(.system(size: 12, weight: .bold))
                .foregroundColor(AppTheme.textPrimary)
            
            if let count = reviewCount {
                Text("(\(count))")
                    .font(.system(size: 11, weight: .regular))
                    .foregroundColor(AppTheme.textSecondary)
            }
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(.ultraThinMaterial, in: Capsule())
    }
}

// MARK: - Atmosphere Tag
public struct AtmosphereTag: View {
    public let title: String
    
    public init(title: String) {
        self.title = title
    }
    
    public var body: some View {
        Text(title)
            .font(.system(size: 12, weight: .medium))
            .foregroundColor(AppTheme.textSecondary)
            .padding(.horizontal, 10)
            .padding(.vertical, 5)
            .background(Color(UIColor.tertiarySystemGroupedBackground))
            .clipShape(Capsule())
            .overlay(
                Capsule()
                    .stroke(AppTheme.subtleBorder, lineWidth: 0.5)
            )
    }
}

// MARK: - Place Card (Compact / Carousel)
public struct PlaceCardCompact: View {
    public let place: Place
    public let isSaved: Bool
    public let onSaveToggle: () -> Void
    public let onSelect: () -> Void
    
    public init(
        place: Place,
        isSaved: Bool,
        onSaveToggle: @escaping () -> Void,
        onSelect: @escaping () -> Void
    ) {
        self.place = place
        self.isSaved = isSaved
        self.onSaveToggle = onSaveToggle
        self.onSelect = onSelect
    }
    
    public var body: some View {
        Button(action: onSelect) {
            VStack(alignment: .leading, spacing: 10) {
                // Photo Header
                ZStack(alignment: .topTrailing) {
                    AsyncImage(url: URL(string: place.imageURLs.first ?? "")) { phase in
                        switch phase {
                        case .success(let image):
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        case .failure, .empty:
                            Rectangle()
                                .fill(LinearGradient(
                                    colors: [AppTheme.primaryPurple.opacity(0.3), Color(UIColor.tertiarySystemFill)],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                ))
                                .overlay(
                                    Image(systemName: place.category.iconName)
                                        .font(.system(size: 30))
                                        .foregroundColor(.white.opacity(0.7))
                                )
                        @unknown default:
                            EmptyView()
                        }
                    }
                    .frame(width: 220, height: 140)
                    .clipped()
                    .cornerRadius(AppTheme.radiusMedium)
                    
                    // Floating Save Button
                    Button(action: onSaveToggle) {
                        Image(systemName: isSaved ? "bookmark.fill" : "bookmark")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(isSaved ? AppTheme.vibrantOrange : .white)
                            .frame(width: 32, height: 32)
                            .background(.ultraThinMaterial, in: Circle())
                            .shadow(radius: 4)
                    }
                    .padding(8)
                    
                    // Rating Badge overlay
                    VStack {
                        Spacer()
                        HStack {
                            RatingBadge(rating: place.rating)
                            Spacer()
                        }
                        .padding(8)
                    }
                }
                .frame(width: 220, height: 140)
                
                // Info
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text(place.name)
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(AppTheme.textPrimary)
                            .lineLimit(1)
                        Spacer()
                    }
                    
                    HStack(spacing: 6) {
                        Text(place.category.rawValue)
                            .font(.system(size: 13, weight: .medium))
                            .foregroundColor(AppTheme.primaryPurple)
                        
                        Text("•")
                            .foregroundColor(AppTheme.textTertiary)
                        
                        Text(place.priceString)
                            .font(.system(size: 13, weight: .medium))
                            .foregroundColor(AppTheme.textSecondary)
                        
                        if let cuisine = place.restaurantInfo?.cuisine {
                            Text("•")
                                .foregroundColor(AppTheme.textTertiary)
                            Text(cuisine)
                                .font(.system(size: 12))
                                .foregroundColor(AppTheme.textSecondary)
                                .lineLimit(1)
                        }
                    }
                    
                    Text(place.address)
                        .font(.system(size: 12))
                        .foregroundColor(AppTheme.textTertiary)
                        .lineLimit(1)
                }
                .frame(width: 220)
            }
            .padding(10)
            .background(Color(UIColor.secondarySystemGroupedBackground))
            .cornerRadius(AppTheme.radiusLarge)
            .overlay(
                RoundedRectangle(cornerRadius: AppTheme.radiusLarge)
                    .stroke(AppTheme.subtleBorder, lineWidth: 1)
            )
            .shadow(color: AppTheme.softShadow.color, radius: AppTheme.softShadow.radius, x: 0, y: 2)
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Place Card (Full Width / Vertical)
public struct PlaceCardRow: View {
    public let place: Place
    public let isSaved: Bool
    public let onSaveToggle: () -> Void
    public let onSelect: () -> Void
    
    public init(
        place: Place,
        isSaved: Bool,
        onSaveToggle: @escaping () -> Void,
        onSelect: @escaping () -> Void
    ) {
        self.place = place
        self.isSaved = isSaved
        self.onSaveToggle = onSaveToggle
        self.onSelect = onSelect
    }
    
    public var body: some View {
        Button(action: onSelect) {
            HStack(spacing: 14) {
                // Thumbnail
                ZStack(alignment: .bottomLeading) {
                    AsyncImage(url: URL(string: place.imageURLs.first ?? "")) { phase in
                        switch phase {
                        case .success(let image):
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        default:
                            Rectangle()
                                .fill(LinearGradient(
                                    colors: [AppTheme.primaryPurple.opacity(0.3), Color(UIColor.secondarySystemFill)],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                ))
                                .overlay(
                                    Image(systemName: place.category.iconName)
                                        .font(.system(size: 24))
                                        .foregroundColor(.white.opacity(0.8))
                                )
                        }
                    }
                    .frame(width: 100, height: 100)
                    .clipped()
                    .cornerRadius(AppTheme.radiusMedium)
                }
                
                // Info
                VStack(alignment: .leading, spacing: 6) {
                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(place.name)
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(AppTheme.textPrimary)
                                .lineLimit(1)
                            
                            HStack(spacing: 6) {
                                Text(place.category.rawValue)
                                    .font(.system(size: 13, weight: .medium))
                                    .foregroundColor(AppTheme.primaryPurple)
                                Text("•")
                                    .foregroundColor(AppTheme.textTertiary)
                                Text(place.priceString)
                                    .font(.system(size: 13))
                                    .foregroundColor(AppTheme.textSecondary)
                            }
                        }
                        
                        Spacer()
                        
                        Button(action: onSaveToggle) {
                            Image(systemName: isSaved ? "bookmark.fill" : "bookmark")
                                .font(.system(size: 16))
                                .foregroundColor(isSaved ? AppTheme.vibrantOrange : AppTheme.textTertiary)
                                .padding(4)
                        }
                    }
                    
                    Text(place.editorialDescription)
                        .font(.system(size: 13))
                        .foregroundColor(AppTheme.textSecondary)
                        .lineLimit(2)
                    
                    HStack(spacing: 8) {
                        RatingBadge(rating: place.rating, reviewCount: place.reviewCount)
                        
                        Spacer()
                        
                        Text(place.isOpen ? "Open" : "Closed")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(place.isOpen ? AppTheme.emeraldGreen : AppTheme.coralRed)
                    }
                }
            }
            .padding(12)
            .background(Color(UIColor.secondarySystemGroupedBackground))
            .cornerRadius(AppTheme.radiusLarge)
            .overlay(
                RoundedRectangle(cornerRadius: AppTheme.radiusLarge)
                    .stroke(AppTheme.subtleBorder, lineWidth: 1)
            )
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Section Header
public struct SectionHeader: View {
    public let title: String
    public let subtitle: String?
    public var actionTitle: String? = nil
    public var action: (() -> Void)? = nil
    
    public init(title: String, subtitle: String? = nil, actionTitle: String? = nil, action: (() -> Void)? = nil) {
        self.title = title
        self.subtitle = subtitle
        self.actionTitle = actionTitle
        self.action = action
    }
    
    public var body: some View {
        HStack(alignment: .firstTextBaseline) {
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(AppTheme.textPrimary)
                
                if let sub = subtitle {
                    Text(sub)
                        .font(.system(size: 13))
                        .foregroundColor(AppTheme.textSecondary)
                }
            }
            
            Spacer()
            
            if let actionTitle = actionTitle, let action = action {
                Button(action: action) {
                    Text(actionTitle)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(AppTheme.primaryPurple)
                }
            }
        }
    }
}

// MARK: - Floating Map Place Preview Card
public struct PlacePreviewSheet: View {
    public let place: Place
    public let onDetails: () -> Void
    public let onDirections: () -> Void
    public let onClose: () -> Void
    
    public init(place: Place, onDetails: @escaping () -> Void, onDirections: @escaping () -> Void, onClose: @escaping () -> Void) {
        self.place = place
        self.onDetails = onDetails
        self.onDirections = onDirections
        self.onClose = onClose
    }
    
    public var body: some View {
        VStack(spacing: 12) {
            HStack(spacing: 12) {
                // Photo
                AsyncImage(url: URL(string: place.imageURLs.first ?? "")) { phase in
                    switch phase {
                    case .success(let img):
                        img.resizable().aspectRatio(contentMode: .fill)
                    default:
                        Rectangle().fill(AppTheme.primaryPurple.opacity(0.2))
                            .overlay(Image(systemName: place.category.iconName).foregroundColor(AppTheme.primaryPurple))
                    }
                }
                .frame(width: 76, height: 76)
                .clipped()
                .cornerRadius(AppTheme.radiusMedium)
                
                // Info
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text(place.name)
                            .font(.system(size: 17, weight: .bold))
                            .foregroundColor(AppTheme.textPrimary)
                            .lineLimit(1)
                        
                        Spacer()
                        
                        Button(action: onClose) {
                            Image(systemName: "xmark.circle.fill")
                                .font(.system(size: 20))
                                .foregroundColor(AppTheme.textTertiary)
                        }
                    }
                    
                    HStack(spacing: 6) {
                        Text(place.category.rawValue)
                            .font(.system(size: 13, weight: .medium))
                            .foregroundColor(AppTheme.primaryPurple)
                        Text("•")
                            .foregroundColor(AppTheme.textTertiary)
                        RatingBadge(rating: place.rating)
                        Text("•")
                            .foregroundColor(AppTheme.textTertiary)
                        Text(place.priceString)
                            .font(.system(size: 13))
                            .foregroundColor(AppTheme.textSecondary)
                    }
                    
                    Text(place.address)
                        .font(.system(size: 12))
                        .foregroundColor(AppTheme.textSecondary)
                        .lineLimit(1)
                }
            }
            
            // Action Buttons
            HStack(spacing: 10) {
                Button(action: onDetails) {
                    HStack {
                        Image(systemName: "info.circle.fill")
                        Text("Explore Details")
                    }
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(AppTheme.textPrimary)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(Color(UIColor.tertiarySystemGroupedBackground))
                    .cornerRadius(AppTheme.radiusMedium)
                }
                
                Button(action: onDirections) {
                    HStack {
                        Image(systemName: "arrow.triangle.turn.up.right.diamond.fill")
                        Text("Directions")
                    }
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(AppTheme.vibrantOrange)
                    .cornerRadius(AppTheme.radiusMedium)
                    .shadow(color: AppTheme.vibrantOrange.opacity(0.4), radius: 8, x: 0, y: 3)
                }
            }
        }
        .padding(16)
        .glassCard(cornerRadius: AppTheme.radiusLarge)
        .padding(.horizontal, 16)
        .padding(.bottom, 20)
    }
}
