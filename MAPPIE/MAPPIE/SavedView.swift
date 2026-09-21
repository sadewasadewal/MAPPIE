//
//  SavedView.swift
//  MAPPIE
//
//  Saved Places & Personal Collections
//

import SwiftUI

public struct SavedView: View {
    @StateObject private var viewModel = SavedViewModel()
    @ObservedObject private var repository = PlacesRepository.shared
    @State private var selectedPlace: Place? = nil
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 22) {
                    // MARK: - Collections Horizontal Filter
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text("Collections")
                                .font(.system(size: 18, weight: .bold))
                            Spacer()
                            Button(action: { viewModel.showingNewCollectionSheet = true }) {
                                HStack(spacing: 4) {
                                    Image(systemName: "plus.circle.fill")
                                    Text("New")
                                }
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(AppTheme.vibrantOrange)
                            }
                        }
                        
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 10) {
                                // "All Saved" button
                                Button(action: { viewModel.selectedCollectionId = nil }) {
                                    HStack(spacing: 6) {
                                        Image(systemName: "bookmark.fill")
                                            .font(.system(size: 13))
                                        Text("All Saved (\(repository.savedItems.count))")
                                            .font(.system(size: 14, weight: .medium))
                                    }
                                    .padding(.horizontal, 14)
                                    .padding(.vertical, 8)
                                    .background(viewModel.selectedCollectionId == nil ? AppTheme.vibrantOrange : Color(UIColor.secondarySystemGroupedBackground))
                                    .foregroundColor(viewModel.selectedCollectionId == nil ? .white : AppTheme.textPrimary)
                                    .clipShape(Capsule())
                                }
                                
                                ForEach(viewModel.collections) { col in
                                    let isSelected = viewModel.selectedCollectionId == col.id
                                    let count = repository.savedItems.filter { $0.collectionId == col.id }.count
                                    
                                    Button(action: { viewModel.selectedCollectionId = col.id }) {
                                        HStack(spacing: 6) {
                                            Image(systemName: col.iconName)
                                                .font(.system(size: 13))
                                            Text("\(col.name) (\(count))")
                                                .font(.system(size: 14, weight: .medium))
                                        }
                                        .padding(.horizontal, 14)
                                        .padding(.vertical, 8)
                                        .background(isSelected ? AppTheme.vibrantOrange : Color(UIColor.secondarySystemGroupedBackground))
                                        .foregroundColor(isSelected ? .white : AppTheme.textPrimary)
                                        .clipShape(Capsule())
                                    }
                                }
                            }
                        }
                    }
                    
                    // MARK: - Saved Places List
                    VStack(alignment: .leading, spacing: 14) {
                        let places = viewModel.filteredSavedPlaces
                        
                        if places.isEmpty {
                            VStack(spacing: 14) {
                                Image(systemName: "bookmark")
                                    .font(.system(size: 48))
                                    .foregroundColor(AppTheme.textTertiary)
                                Text("No saved places yet")
                                    .font(.system(size: 18, weight: .semibold))
                                Text("Explore restaurants, cafés, and hotels to add them to your collections.")
                                    .font(.system(size: 14))
                                    .foregroundColor(AppTheme.textSecondary)
                                    .multilineTextAlignment(.center)
                                    .padding(.horizontal, 24)
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 60)
                        } else {
                            ForEach(places) { place in
                                PlaceCardRow(
                                    place: place,
                                    isSaved: true,
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
            .navigationTitle("Saved")
            .sheet(item: $selectedPlace) { place in
                PlaceDetailView(place: place)
            }
            .sheet(isPresented: $viewModel.showingNewCollectionSheet) {
                NavigationStack {
                    VStack(spacing: 20) {
                        TextField("Collection Name (e.g. Kyoto Trip, Date Night)", text: $viewModel.newCollectionName)
                            .font(.system(size: 16))
                            .padding(14)
                            .minimalCard()
                            .padding(.horizontal, 20)
                            .padding(.top, 20)
                        
                        Button(action: { viewModel.createCollection() }) {
                            Text("Create Collection")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(AppTheme.vibrantOrange)
                                .cornerRadius(AppTheme.radiusMedium)
                        }
                        .padding(.horizontal, 20)
                        .disabled(viewModel.newCollectionName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                        
                        Spacer()
                    }
                    .navigationTitle("New Collection")
                    .navigationBarTitleDisplayMode(.inline)
                    .toolbar {
                        ToolbarItem(placement: .cancellationAction) {
                            Button("Cancel") { viewModel.showingNewCollectionSheet = false }
                        }
                    }
                }
                .presentationDetents([.fraction(0.35)])
            }
        }
    }
}
