//
//  Services.swift
//  MAPPIE
//
//  MapKit, Location & Discovery Services
//

import Foundation
import CoreLocation
import MapKit
import Combine

// MARK: - Location Service
@MainActor
public class LocationService: NSObject, ObservableObject, CLLocationManagerDelegate {
    public static let shared = LocationService()
    
    private let locationManager = CLLocationManager()
    @Published public var userCoordinate: CLLocationCoordinate2D = CLLocationCoordinate2D(latitude: 6.9150, longitude: 79.8587) // Default to vibrant Colombo area
    @Published public var authorizationStatus: CLAuthorizationStatus = .notDetermined
    
    public override init() {
        super.init()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        authorizationStatus = locationManager.authorizationStatus
    }
    
    public func requestPermission() {
        locationManager.requestWhenInUseAuthorization()
        locationManager.startUpdatingLocation()
    }
    
    nonisolated public func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }
        Task { @MainActor in
            self.userCoordinate = location.coordinate
        }
    }
    
    nonisolated public func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        Task { @MainActor in
            self.authorizationStatus = manager.authorizationStatus
            if manager.authorizationStatus == .authorizedWhenInUse || manager.authorizationStatus == .authorizedAlways {
                manager.startUpdatingLocation()
            }
        }
    }
}

// MARK: - Directions Service
public class DirectionsService {
    public static let shared = DirectionsService()
    
    public func calculateRoute(
        from origin: CLLocationCoordinate2D,
        to destination: Place,
        transportType: MKDirectionsTransportType = .automobile
    ) async -> RouteDetails {
        let request = MKDirections.Request()
        request.source = MKMapItem(placemark: MKPlacemark(coordinate: origin))
        request.destination = MKMapItem(placemark: MKPlacemark(coordinate: destination.coordinate))
        request.transportType = transportType
        
        let directions = MKDirections(request: request)
        
        do {
            let response: MKDirections.Response = try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<MKDirections.Response, Error>) in
                directions.calculate { response, error in
                    if let error = error {
                        continuation.resume(throwing: error)
                    } else if let response = response {
                        continuation.resume(returning: response)
                    } else {
                        continuation.resume(throwing: NSError(domain: "Directions", code: -1, userInfo: nil))
                    }
                }
            }
            
            if let primaryRoute = response.routes.first {
                let timeMinutes = Int(ceil(primaryRoute.expectedTravelTime / 60))
                let distanceKm = String(format: "%.1f km", primaryRoute.distance / 1000.0)
                
                let pointCount = primaryRoute.polyline.pointCount
                var coords = [CLLocationCoordinate2D](repeating: CLLocationCoordinate2D(), count: pointCount)
                primaryRoute.polyline.getCoordinates(&coords, range: NSRange(location: 0, length: pointCount))
                
                let steps = primaryRoute.steps.filter { !$0.instructions.isEmpty }.map {
                    RouteStepInfo(
                        instruction: $0.instructions,
                        distanceFormatted: String(format: "%.0f m", $0.distance)
                    )
                }
                
                return RouteDetails(
                    destinationName: destination.name,
                    travelTimeFormatted: "\(timeMinutes) min",
                    distanceFormatted: distanceKm,
                    transportType: transportType,
                    steps: steps.isEmpty ? [RouteStepInfo(instruction: "Proceed toward \(destination.name)", distanceFormatted: distanceKm)] : steps,
                    polylineCoordinates: coords
                )
            }
        } catch {
            // Fallback estimation if Apple routing is offline
            let distanceMeters = CLLocation(latitude: origin.latitude, longitude: origin.longitude)
                .distance(from: CLLocation(latitude: destination.coordinate.latitude, longitude: destination.coordinate.longitude))
            let km = distanceMeters / 1000.0
            let speedKmH: Double = transportType == .walking ? 4.5 : 30.0
            let hours = km / speedKmH
            let minutes = max(3, Int(hours * 60))
            
            let simulatedSteps = [
                RouteStepInfo(instruction: "Head toward \(destination.name)", distanceFormatted: String(format: "%.0f m", min(400, distanceMeters))),
                RouteStepInfo(instruction: "Continue along the main avenue", distanceFormatted: String(format: "%.1f km", km * 0.7)),
                RouteStepInfo(instruction: "Arrive at \(destination.name)", distanceFormatted: "Destination on right")
            ]
            
            let interpolatedPoints = [
                origin,
                CLLocationCoordinate2D(latitude: (origin.latitude + destination.coordinate.latitude) / 2 + 0.001, longitude: (origin.longitude + destination.coordinate.longitude) / 2),
                destination.coordinate
            ]
            
            return RouteDetails(
                destinationName: destination.name,
                travelTimeFormatted: "\(minutes) min",
                distanceFormatted: String(format: "%.1f km", km),
                transportType: transportType,
                steps: simulatedSteps,
                polylineCoordinates: interpolatedPoints
            )
        }
        
        return RouteDetails(
            destinationName: destination.name,
            travelTimeFormatted: "15 min",
            distanceFormatted: "4.2 km",
            transportType: transportType,
            steps: [RouteStepInfo(instruction: "Head to destination", distanceFormatted: "4.2 km")]
        )
    }
}

// MARK: - Places Repository
@MainActor
public class PlacesRepository: ObservableObject {
    public static let shared = PlacesRepository()
    
    @Published public var allPlaces: [Place] = MockData.samplePlaces
    @Published public var collections: [PlaceCollection] = MockData.defaultCollections
    @Published public var savedItems: [SavedPlaceItem] = [
        SavedPlaceItem(place: MockData.samplePlaces[0], collectionId: "col-datenight"),
        SavedPlaceItem(place: MockData.samplePlaces[1], collectionId: "col-weekend")
    ]
    
    public init() {}
    
    public func isSaved(place: Place) -> Bool {
        savedItems.contains(where: { $0.place.id == place.id })
    }
    
    public func toggleSave(place: Place, collectionId: String? = nil) {
        if let idx = savedItems.firstIndex(where: { $0.place.id == place.id }) {
            savedItems.remove(at: idx)
        } else {
            savedItems.append(SavedPlaceItem(place: place, collectionId: collectionId))
        }
    }
    
    public func addCollection(name: String, iconName: String = "bookmark.fill", colorHex: UInt = 0x0EA5E9) {
        let newCol = PlaceCollection(name: name, iconName: iconName, colorHex: colorHex)
        collections.append(newCol)
    }
    
    public func search(query: String, category: PlaceCategory = .all) -> [Place] {
        var results = allPlaces
        
        if category != .all {
            results = results.filter { $0.category == category }
        }
        
        guard !query.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
            return results
        }
        
        let q = query.lowercased()
        return results.filter { place in
            place.name.lowercased().contains(q) ||
            place.address.lowercased().contains(q) ||
            place.editorialDescription.lowercased().contains(q) ||
            place.atmosphereTags.contains(where: { $0.lowercased().contains(q) }) ||
            (place.restaurantInfo?.cuisine.lowercased().contains(q) ?? false)
        }
    }
}
