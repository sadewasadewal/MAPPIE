//
//  ContentView.swift
//  MAPPIE
//
//  Wayfinder Navigation Root
//

import SwiftUI

public struct ContentView: View {
    @State private var selectedTab: Int = 0
    
    public init() {
        UITabBar.appearance().unselectedItemTintColor = UIColor.secondaryLabel
    }

    public var body: some View {
        TabView(selection: $selectedTab) {
            ExploreView()
                .tabItem {
                    Image(systemName: "sparkles")
                    Text("Explore")
                }
                .tag(0)

            MapRootView()
                .tabItem {
                    Image(systemName: selectedTab == 1 ? "map.fill" : "map")
                    Text("Map")
                }
                .tag(1)

            SavedView()
                .tabItem {
                    Image(systemName: selectedTab == 2 ? "bookmark.fill" : "bookmark")
                    Text("Saved")
                }
                .tag(2)

            ProfileView()
                .tabItem {
                    Image(systemName: selectedTab == 3 ? "person.fill" : "person")
                    Text("Profile")
                }
                .tag(3)
        }
        .tint(AppTheme.lightBlue)
    }
}

#Preview {
    ContentView()
}
