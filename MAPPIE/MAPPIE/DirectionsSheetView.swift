//
//  DirectionsSheetView.swift
//  MAPPIE
//
//  MapKit Route Guidance & Step-by-Step Directions
//

import SwiftUI
import MapKit

public struct DirectionsSheetView: View {
    public let destination: Place
    @Environment(\.dismiss) private var dismiss
    @ObservedObject var locationService = LocationService.shared
    
    public enum TravelMode: String, CaseIterable, Identifiable {
        case driving = "Driving"
        case walking = "Walking"
        public var id: String { rawValue }
        
        public var mkType: MKDirectionsTransportType {
            switch self {
            case .driving: return .automobile
            case .walking: return .walking
            }
        }
    }
    
    @State private var travelMode: TravelMode = .driving
    @State private var routeDetails: RouteDetails? = nil
    @State private var isLoading: Bool = true
    
    public init(destination: Place) {
        self.destination = destination
    }
    
    public var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Header Transport Mode Picker
                Picker("Mode", selection: $travelMode) {
                    Label("Driving", systemImage: "car.fill").tag(TravelMode.driving)
                    Label("Walking", systemImage: "figure.walk").tag(TravelMode.walking)
                }
                .pickerStyle(.segmented)
                .padding(.horizontal, 20)
                .padding(.vertical, 12)
                .onChange(of: travelMode) { _ in
                    Task { await loadRoute() }
                }
                
                if isLoading {
                    VStack(spacing: 16) {
                        ProgressView()
                            .tint(AppTheme.primaryPurple)
                        Text("Calculating best route...")
                            .font(.system(size: 14))
                            .foregroundColor(AppTheme.textSecondary)
                    }
                    .frame(maxHeight: .infinity)
                } else if let details = routeDetails {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 18) {
                            // Route Summary Card
                            HStack(spacing: 16) {
                                Image(systemName: travelMode.mkType == .walking ? "figure.walk" : "car.fill")
                                    .font(.system(size: 28))
                                    .foregroundColor(AppTheme.primaryPurple)
                                    .frame(width: 52, height: 52)
                                    .background(AppTheme.primaryPurple.opacity(0.12), in: Circle())
                                
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(details.travelTimeFormatted)
                                        .font(.system(size: 24, weight: .bold))
                                        .foregroundColor(AppTheme.textPrimary)
                                    
                                    HStack(spacing: 6) {
                                        Text(details.distanceFormatted)
                                            .font(.system(size: 14, weight: .semibold))
                                            .foregroundColor(AppTheme.textSecondary)
                                        Text("•")
                                            .foregroundColor(AppTheme.textTertiary)
                                        Text("Fastest route with typical traffic")
                                            .font(.system(size: 13))
                                            .foregroundColor(AppTheme.textTertiary)
                                    }
                                }
                                Spacer()
                            }
                            .padding(16)
                            .minimalCard()
                            
                            // Destination Info
                            HStack(spacing: 12) {
                                Image(systemName: "mappin.circle.fill")
                                    .font(.system(size: 24))
                                    .foregroundColor(AppTheme.primaryPurple)
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(destination.name)
                                        .font(.system(size: 16, weight: .semibold))
                                    Text(destination.address)
                                        .font(.system(size: 13))
                                        .foregroundColor(AppTheme.textSecondary)
                                }
                            }
                            .padding(14)
                            .minimalCard()
                            
                            // Step by step turns
                            VStack(alignment: .leading, spacing: 12) {
                                Text("Turn-by-Turn Steps")
                                    .font(.system(size: 17, weight: .bold))
                                    .foregroundColor(AppTheme.textPrimary)
                                
                                VStack(spacing: 0) {
                                    ForEach(Array(details.steps.enumerated()), id: \.offset) { index, step in
                                        HStack(alignment: .top, spacing: 12) {
                                            VStack(spacing: 4) {
                                                Circle()
                                                    .fill(index == 0 ? AppTheme.primaryPurple : Color(UIColor.tertiaryLabel))
                                                    .frame(width: 10, height: 10)
                                                if index < details.steps.count - 1 {
                                                    Rectangle()
                                                        .fill(Color(UIColor.separator))
                                                        .frame(width: 2, height: 28)
                                                }
                                            }
                                            .padding(.top, 4)
                                            
                                            VStack(alignment: .leading, spacing: 2) {
                                                Text(step.instruction)
                                                    .font(.system(size: 14, weight: .medium))
                                                    .foregroundColor(AppTheme.textPrimary)
                                                Text(step.distanceFormatted)
                                                    .font(.system(size: 12))
                                                    .foregroundColor(AppTheme.textSecondary)
                                            }
                                            Spacer()
                                        }
                                        .padding(.vertical, 4)
                                    }
                                }
                            }
                            .padding(16)
                            .minimalCard()
                            
                            // Open in Apple Maps Button
                            Button(action: openInAppleMaps) {
                                HStack {
                                    Image(systemName: "arrow.triangle.turn.up.right.diamond.fill")
                                    Text("Start Navigation in Apple Maps")
                                }
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
            .navigationTitle("Directions")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Done") { dismiss() }
                }
            }
            .task {
                await loadRoute()
            }
        }
    }
    
    private func loadRoute() async {
        isLoading = true
        let origin = locationService.userCoordinate
        let details = await DirectionsService.shared.calculateRoute(from: origin, to: destination, transportType: travelMode.mkType)
        routeDetails = details
        isLoading = false
    }
    
    private func openInAppleMaps() {
        let placemark = MKPlacemark(coordinate: destination.coordinate)
        let mapItem = MKMapItem(placemark: placemark)
        mapItem.name = destination.name
        
        let launchOptions = [
            MKLaunchOptionsDirectionsModeKey: (travelMode.mkType == .walking ? MKLaunchOptionsDirectionsModeWalking : MKLaunchOptionsDirectionsModeDriving)
        ]
        mapItem.openInMaps(launchOptions: launchOptions)
    }
}
