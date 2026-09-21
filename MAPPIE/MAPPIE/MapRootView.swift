//
//  MapRootView.swift
//  MAPPIE
//
//  Full Interactive Apple MapKit Experience
//

import SwiftUI
import MapKit

public struct MapRootView: View {
    @StateObject private var viewModel = MapViewModel()
    @ObservedObject private var locationService = LocationService.shared
    
    @State private var showingDetailSheet: Bool = false
    @State private var showingDirectionsSheet: Bool = false
    @State private var placeForDetail: Place? = nil
    @State private var placeForDirections: Place? = nil
    
    public init() {}
    
    public var body: some View {
        ZStack(alignment: .top) {
            // MARK: - Native SwiftUI Map
            Map(position: $viewModel.cameraPosition) {
                UserAnnotation()
                
                ForEach(viewModel.visiblePlaces) { place in
                    Annotation(place.name, coordinate: place.coordinate) {
                        Button(action: {
                            withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                                viewModel.focusPlace(place)
                            }
                        }) {
                            let isSelected = viewModel.selectedPlace?.id == place.id
                            VStack(spacing: 2) {
                                ZStack {
                                    Circle()
                                        .fill(isSelected ? AppTheme.primaryPurple : Color(UIColor.systemBackground))
                                        .frame(width: isSelected ? 44 : 36, height: isSelected ? 44 : 36)
                                        .overlay(
                                            Circle()
                                                .stroke(isSelected ? Color.white : AppTheme.primaryPurple, lineWidth: 2)
                                        )
                                        .shadow(color: isSelected ? AppTheme.primaryPurple.opacity(0.6) : Color.black.opacity(0.15), radius: isSelected ? 10 : 4, x: 0, y: 3)
                                    
                                    Image(systemName: place.category.iconName)
                                        .font(.system(size: isSelected ? 18 : 14, weight: .bold))
                                        .foregroundColor(isSelected ? .white : AppTheme.primaryPurple)
                                }
                                
                                if isSelected {
                                    Text(place.name)
                                        .font(.system(size: 11, weight: .bold))
                                        .foregroundColor(AppTheme.textPrimary)
                                        .padding(.horizontal, 6)
                                        .padding(.vertical, 2)
                                        .background(.ultraThinMaterial, in: Capsule())
                                        .shadow(radius: 2)
                                }
                            }
                        }
                    }
                }
                
                if let route = viewModel.activeRoute, !route.polylineCoordinates.isEmpty {
                    MapPolyline(coordinates: route.polylineCoordinates)
                        .stroke(AppTheme.primaryPurple, lineWidth: 6)
                }
            }
            .mapControls {
                MapCompass()
                MapScaleView()
            }
            .ignoresSafeArea()
            
            // MARK: - Top Floating Search & Category Filter
            VStack(spacing: 10) {
                // Search Bar
                HStack(spacing: 10) {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(AppTheme.textSecondary)
                    
                    TextField("Search places, cuisines, hotels...", text: $viewModel.searchQuery)
                        .font(.system(size: 15))
                    
                    if !viewModel.searchQuery.isEmpty {
                        Button(action: { viewModel.searchQuery = "" }) {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(AppTheme.textTertiary)
                        }
                    }
                }
                .padding(.horizontal, 14)
                .padding(.vertical, 12)
                .glassCard(cornerRadius: AppTheme.radiusMedium)
                .padding(.horizontal, 16)
                
                // Category Filter Scroller
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(PlaceCategory.allCases) { category in
                            CategoryChip(
                                category: category,
                                isSelected: viewModel.selectedCategory == category,
                                action: {
                                    withAnimation {
                                        viewModel.selectCategory(category)
                                    }
                                }
                            )
                        }
                    }
                    .padding(.horizontal, 16)
                }
            }
            .padding(.top, 50)
            
            // MARK: - Floating Map Controls & Bottom Preview Sheet
            VStack {
                Spacer()
                
                // Floating Recenter Button
                HStack {
                    Spacer()
                    Button(action: {
                        locationService.requestPermission()
                        withAnimation {
                            viewModel.recenterOnUser()
                        }
                    }) {
                        Image(systemName: "location.fill")
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(AppTheme.primaryPurple)
                            .frame(width: 44, height: 44)
                            .background(.ultraThinMaterial, in: Circle())
                            .overlay(Circle().stroke(AppTheme.subtleBorder, lineWidth: 1))
                            .shadow(color: Color.black.opacity(0.12), radius: 8, x: 0, y: 4)
                    }
                    .padding(.trailing, 20)
                    .padding(.bottom, viewModel.selectedPlace != nil ? 10 : 90)
                }
                
                // Selected Place Floating Card
                if let place = viewModel.selectedPlace {
                    PlacePreviewSheet(
                        place: place,
                        onDetails: {
                            placeForDetail = place
                            showingDetailSheet = true
                        },
                        onDirections: {
                            placeForDirections = place
                            showingDirectionsSheet = true
                        },
                        onClose: {
                            withAnimation {
                                viewModel.selectedPlace = nil
                            }
                        }
                    )
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                    .padding(.bottom, 75)
                }
            }
        }
        .sheet(item: $placeForDetail) { place in
            PlaceDetailView(place: place)
        }
        .sheet(item: $placeForDirections) { place in
            DirectionsSheetView(destination: place)
        }
        .onAppear {
            locationService.requestPermission()
        }
    }
}
