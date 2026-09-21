//
//  ViewModels.swift
//  MAPPIE
//
//  Wayfinder Application ViewModels
//

import Foundation
import CoreLocation
import MapKit
import SwiftUI
import Combine

// MARK: - Map View Model
@MainActor
public class MapViewModel: ObservableObject {
    @Published public var selectedPlace: Place? = nil
    @Published public var selectedCategory: PlaceCategory = .all
    @Published public var searchQuery: String = ""
    @Published public var cameraPosition: MapCameraPosition = .region(
        MKCoordinateRegion(
            center: CLLocationCoordinate2D(latitude: 6.9150, longitude: 79.8587),
            span: MKCoordinateSpan(latitudeDelta: 0.08, longitudeDelta: 0.08)
        )
    )
    @Published public var activeRoute: RouteDetails? = nil
    
    private let repository = PlacesRepository.shared
    private let locationService = LocationService.shared
    
    public init() {
        self.selectedPlace = MockData.samplePlaces.first
    }
    
    public var visiblePlaces: [Place] {
        repository.search(query: searchQuery, category: selectedCategory)
    }
    
    public func recenterOnUser() {
        let coord = locationService.userCoordinate
        cameraPosition = .region(
            MKCoordinateRegion(
                center: coord,
                span: MKCoordinateSpan(latitudeDelta: 0.04, longitudeDelta: 0.04)
            )
        )
    }
    
    public func focusPlace(_ place: Place) {
        selectedPlace = place
        cameraPosition = .region(
            MKCoordinateRegion(
                center: place.coordinate,
                span: MKCoordinateSpan(latitudeDelta: 0.02, longitudeDelta: 0.02)
            )
        )
    }
    
    public func selectCategory(_ category: PlaceCategory) {
        selectedCategory = category
    }
}

// MARK: - Explore View Model
@MainActor
public class ExploreViewModel: ObservableObject {
    @Published public var searchQuery: String = ""
    @Published public var selectedCategory: PlaceCategory = .all
    
    private let repository = PlacesRepository.shared
    
    public init() {}
    
    public var isSearching: Bool {
        !searchQuery.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || selectedCategory != .all
    }
    
    public var searchResults: [Place] {
        repository.search(query: searchQuery, category: selectedCategory)
    }
    
    public var popularTonight: [Place] {
        repository.allPlaces.filter { $0.rating >= 4.8 }
    }
    
    public var hiddenGems: [Place] {
        repository.allPlaces.filter { $0.atmosphereTags.contains(where: { $0.contains("Quiet") || $0.contains("Minimalist") || $0.contains("Boutique") }) }
    }
    
    public var greatForDinner: [Place] {
        repository.allPlaces.filter { $0.category == .restaurant }
    }
    
    public var hotelsAndStays: [Place] {
        repository.allPlaces.filter { $0.category == .hotel }
    }
}

// MARK: - Saved View Model
@MainActor
public class SavedViewModel: ObservableObject {
    @Published public var selectedCollectionId: String? = nil
    @Published public var showingNewCollectionSheet: Bool = false
    @Published public var newCollectionName: String = ""
    
    private let repository = PlacesRepository.shared
    
    public init() {}
    
    public var collections: [PlaceCollection] {
        repository.collections
    }
    
    public var filteredSavedPlaces: [Place] {
        if let colId = selectedCollectionId {
            return repository.savedItems.filter { $0.collectionId == colId }.map { $0.place }
        } else {
            return repository.savedItems.map { $0.place }
        }
    }
    
    public func createCollection() {
        guard !newCollectionName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }
        repository.addCollection(name: newCollectionName)
        newCollectionName = ""
        showingNewCollectionSheet = false
    }
}
