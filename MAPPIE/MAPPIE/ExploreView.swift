//
//  ExploreView.swift
//  MAPPIE
//
//  Wayfinder Discovery & Editorial Recommendations
//

import SwiftUI

public struct ExploreView: View {
    @StateObject private var viewModel = ExploreViewModel()
    @ObservedObject private var repository = PlacesRepository.shared
    @State private var selectedPlace: Place? = nil
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 24) {
                    // MARK: - Search Bar
                    HStack(spacing: 10) {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(AppTheme.textSecondary)
                        
                        TextField("Search places, cuisines, landmarks...", text: $viewModel.searchQuery)
                            .font(.system(size: 16))
                        
                        if !viewModel.searchQuery.isEmpty {
                            Button(action: { viewModel.searchQuery = "" }) {
                                Image(systemName: "xmark.circle.fill")
                                    .foregroundColor(AppTheme.textTertiary)
                            }
                        }
                    }
                    .padding(.horizontal, 14)
                    .padding(.vertical, 12)
                    .minimalCard(cornerRadius: AppTheme.radiusMedium)
                    
                    // MARK: - Category Filter Chips
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            ForEach(PlaceCategory.allCases) { category in
                                CategoryChip(
                                    category: category,
                                    isSelected: viewModel.selectedCategory == category,
                                    action: {
                                        withAnimation {
                                            viewModel.selectedCategory = category
                                        }
                                    }
                                )
                            }
                        }
                    }
                    
                    // MARK: - Content Sections
                    if viewModel.isSearching {
                        // Search / Filtered Results
                        VStack(alignment: .leading, spacing: 14) {
                            SectionHeader(
                                title: "Results",
                                subtitle: "\(viewModel.searchResults.count) places found"
                            )
                            
                            if viewModel.searchResults.isEmpty {
                                VStack(spacing: 12) {
                                    Image(systemName: "magnifyingglass")
                                        .font(.system(size: 40))
                                        .foregroundColor(AppTheme.textTertiary)
                                    Text("No places found")
                                        .font(.system(size: 17, weight: .semibold))
                                    Text("Try searching for a different keyword or category")
                                        .font(.system(size: 14))
                                        .foregroundColor(AppTheme.textSecondary)
                                }
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 40)
                            } else {
                                ForEach(viewModel.searchResults) { place in
                                    PlaceCardRow(
                                        place: place,
                                        isSaved: repository.isSaved(place: place),
                                        onSaveToggle: { repository.toggleSave(place: place) },
                                        onSelect: { selectedPlace = place }
                                    )
                                }
                            }
                        }
                    } else {
                        // Curated Editorial Carousels
                        
                        // 1. Popular Tonight
                        VStack(alignment: .leading, spacing: 14) {
                            SectionHeader(
                                title: "Popular Tonight",
                                subtitle: "Top rated places in high demand right now"
                            )
                            
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 14) {
                                    ForEach(viewModel.popularTonight) { place in
                                        PlaceCardCompact(
                                            place: place,
                                            isSaved: repository.isSaved(place: place),
                                            onSaveToggle: { repository.toggleSave(place: place) },
                                            onSelect: { selectedPlace = place }
                                        )
                                    }
                                }
                            }
                        }
                        
                        // 2. Hidden Gems
                        VStack(alignment: .leading, spacing: 14) {
                            SectionHeader(
                                title: "Hidden Gems",
                                subtitle: "Unique atmospheres, quiet spots, and bespoke design"
                            )
                            
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 14) {
                                    ForEach(viewModel.hiddenGems) { place in
                                        PlaceCardCompact(
                                            place: place,
                                            isSaved: repository.isSaved(place: place),
                                            onSaveToggle: { repository.toggleSave(place: place) },
                                            onSelect: { selectedPlace = place }
                                        )
                                    }
                                }
                            }
                        }
                        
                        // 3. Great for Dinner
                        VStack(alignment: .leading, spacing: 14) {
                            SectionHeader(
                                title: "Great for Dinner",
                                subtitle: "Chef-driven menus, romantic terraces, and fine cuisine"
                            )
                            
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 14) {
                                    ForEach(viewModel.greatForDinner) { place in
                                        PlaceCardCompact(
                                            place: place,
                                            isSaved: repository.isSaved(place: place),
                                            onSaveToggle: { repository.toggleSave(place: place) },
                                            onSelect: { selectedPlace = place }
                                        )
                                    }
                                }
                            }
                        }
                        
                        // 4. Stays & Escapes
                        VStack(alignment: .leading, spacing: 14) {
                            SectionHeader(
                                title: "Stays & Escapes",
                                subtitle: "Boutique villas, colonial sanctuaries, and private suites"
                            )
                            
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 14) {
                                    ForEach(viewModel.hotelsAndStays) { place in
                                        PlaceCardCompact(
                                            place: place,
                                            isSaved: repository.isSaved(place: place),
                                            onSaveToggle: { repository.toggleSave(place: place) },
                                            onSelect: { selectedPlace = place }
                                        )
                                    }
                                }
                            }
                        }
                        
                        // 5. All Featured Places
                        VStack(alignment: .leading, spacing: 14) {
                            SectionHeader(
                                title: "All Destinations",
                                subtitle: "Curated selections around Sri Lanka"
                            )
                            
                            ForEach(repository.allPlaces) { place in
                                PlaceCardRow(
                                    place: place,
                                    isSaved: repository.isSaved(place: place),
                                    onSaveToggle: { repository.toggleSave(place: place) },
                                    onSelect: { selectedPlace = place }
                                )
                            }
                        }
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 16)
                .padding(.bottom, 40)
            }
            .navigationTitle("Explore")
            .sheet(item: $selectedPlace) { place in
                PlaceDetailView(place: place)
            }
        }
    }
}
