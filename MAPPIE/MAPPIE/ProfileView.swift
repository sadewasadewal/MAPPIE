//
//  ProfileView.swift
//  MAPPIE
//
//  User Travel Profile, Stats & Preferences
//

import SwiftUI
import CoreLocation

public struct ProfileView: View {
    @ObservedObject private var repository = PlacesRepository.shared
    @ObservedObject private var locationService = LocationService.shared
    
    @AppStorage("preferredDietary") private var preferredDietary: String = "All Cuisines"
    @AppStorage("mapStyleChoice") private var mapStyleChoice: String = "Standard"
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: 24) {
                    // MARK: - User Header
                    VStack(spacing: 12) {
                        ZStack {
                            Circle()
                                .fill(LinearGradient(
                                    colors: [AppTheme.lightBlue, AppTheme.vibrantOrange],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                ))
                                .frame(width: 84, height: 84)
                            
                            Image(systemName: "person.fill")
                                .font(.system(size: 38))
                                .foregroundColor(.white)
                        }
                        .shadow(color: AppTheme.lightBlue.opacity(0.35), radius: 10, x: 0, y: 4)
                        
                        VStack(spacing: 4) {
                            Text("Traveler")
                                .font(.system(size: 22, weight: .bold))
                                .foregroundColor(AppTheme.textPrimary)
                            Text("Global Explorer & Food Connoisseur")
                                .font(.system(size: 14))
                                .foregroundColor(AppTheme.textSecondary)
                        }
                    }
                    .padding(.top, 10)
                    
                    // MARK: - Stats Row
                    HStack(spacing: 16) {
                        StatBox(title: "Saved", value: "\(repository.savedItems.count)", icon: "bookmark.fill")
                        StatBox(title: "Collections", value: "\(repository.collections.count)", icon: "folder.fill")
                        StatBox(title: "Explored", value: "\(repository.allPlaces.count)", icon: "sparkles")
                    }
                    
                    // MARK: - Preferences Section
                    VStack(alignment: .leading, spacing: 14) {
                        Text("Travel Preferences")
                            .font(.system(size: 17, weight: .bold))
                            .foregroundColor(AppTheme.textPrimary)
                        
                        VStack(spacing: 14) {
                            HStack {
                                Label("Cuisine Preference", systemImage: "fork.knife")
                                    .font(.system(size: 15))
                                Spacer()
                                Picker("Dietary", selection: $preferredDietary) {
                                    Text("All Cuisines").tag("All Cuisines")
                                    Text("Italian & French").tag("Italian & French")
                                    Text("Asian Fusion").tag("Asian Fusion")
                                    Text("Vegetarian").tag("Vegetarian")
                                }
                                .pickerStyle(.menu)
                                .tint(AppTheme.primaryPurple)
                            }
                            
                            Divider()
                            
                            HStack {
                                Label("Map Appearance", systemImage: "map")
                                    .font(.system(size: 15))
                                Spacer()
                                Picker("Map", selection: $mapStyleChoice) {
                                    Text("Standard").tag("Standard")
                                    Text("Hybrid").tag("Hybrid")
                                    Text("Satellite").tag("Satellite")
                                }
                                .pickerStyle(.menu)
                                .tint(AppTheme.primaryPurple)
                            }
                        }
                        .padding(16)
                        .minimalCard()
                    }
                    
                    // MARK: - Location Services
                    VStack(alignment: .leading, spacing: 14) {
                        Text("Location Services")
                            .font(.system(size: 17, weight: .bold))
                            .foregroundColor(AppTheme.textPrimary)
                        
                        VStack(spacing: 12) {
                            HStack {
                                Label("GPS Location", systemImage: "location.fill")
                                    .font(.system(size: 15))
                                Spacer()
                                Text(locationStatusText)
                                    .font(.system(size: 14, weight: .semibold))
                                    .foregroundColor(AppTheme.emeraldGreen)
                            }
                            
                            if locationService.authorizationStatus != .authorizedWhenInUse && locationService.authorizationStatus != .authorizedAlways {
                                Button(action: { locationService.requestPermission() }) {
                                    Text("Enable Location")
                                        .font(.system(size: 14, weight: .bold))
                                        .foregroundColor(.white)
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 10)
                                        .background(AppTheme.primaryPurple)
                                        .cornerRadius(AppTheme.radiusMedium)
                                }
                            }
                        }
                        .padding(16)
                        .minimalCard()
                    }
                    
                    // MARK: - About & Philosophy
                    VStack(spacing: 8) {
                        Text("Wayfinder")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(AppTheme.primaryPurple)
                        Text("Discover a place → Understand it → Get there → Save it")
                            .font(.system(size: 13))
                            .foregroundColor(AppTheme.textSecondary)
                            .multilineTextAlignment(.center)
                        Text("Version 1.0 • Built with native SwiftUI & Apple MapKit")
                            .font(.system(size: 11))
                            .foregroundColor(AppTheme.textTertiary)
                    }
                    .padding(.top, 10)
                    .padding(.bottom, 30)
                }
                .padding(.horizontal, 20)
            }
            .navigationTitle("Profile")
        }
    }
    
    private var locationStatusText: String {
        switch locationService.authorizationStatus {
        case .authorizedWhenInUse, .authorizedAlways: return "Active"
        case .denied, .restricted: return "Denied"
        case .notDetermined: return "Ready"
        @unknown default: return "Active"
        }
    }
}

// MARK: - Stat Box
private struct StatBox: View {
    let title: String
    let value: String
    let icon: String
    
    var body: some View {
        VStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 18))
                .foregroundColor(AppTheme.primaryPurple)
            Text(value)
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(AppTheme.textPrimary)
            Text(title)
                .font(.system(size: 12))
                .foregroundColor(AppTheme.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 14)
        .minimalCard()
    }
}
