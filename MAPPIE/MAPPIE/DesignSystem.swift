//
//  DesignSystem.swift
//  MAPPIE
//
//  Wayfinder Design System - Ultra-minimal Apple-inspired visual language
//

import SwiftUI

public enum AppTheme {
    // Primary Brand Accent - Light Blue & Vibrant Orange (No purple)
    public static let lightBlue = Color(hex: 0x0EA5E9)      // Vibrant Sky / Light Blue
    public static let deepBlue = Color(hex: 0x0284C7)       // Deep Ocean Blue
    public static let vibrantOrange = Color(hex: 0xF97316)  // Energetic Tangerine Orange
    public static let softOrange = Color(hex: 0xFB923C)     // Warm Peach / Soft Orange
    
    // Core semantic accents
    public static let primaryAccent = lightBlue
    public static let secondaryAccent = vibrantOrange
    public static let primaryPurple = lightBlue            // Redirected to light blue
    public static let orangeAccent = vibrantOrange
    
    // Backgrounds
    public static let background = Color(UIColor.systemBackground)
    public static let secondaryBackground = Color(UIColor.secondarySystemBackground)
    public static let tertiaryBackground = Color(UIColor.tertiarySystemBackground)
    public static let groupedBackground = Color(UIColor.systemGroupedBackground)
    
    // Text colors
    public static let textPrimary = Color(UIColor.label)
    public static let textSecondary = Color(UIColor.secondaryLabel)
    public static let textTertiary = Color(UIColor.tertiaryLabel)
    
    // Accents & Badges
    public static let starGold = Color(hex: 0xFFB800)
    public static let emeraldGreen = Color(hex: 0x10B981)
    public static let coralRed = Color(hex: 0xF43F5E)
    public static let subtleBorder = Color.primary.opacity(0.08)
    
    // Gradients
    public static let brandGradient = LinearGradient(
        colors: [lightBlue, vibrantOrange],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
    public static let blueGradient = LinearGradient(
        colors: [lightBlue, deepBlue],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
    public static let orangeGradient = LinearGradient(
        colors: [softOrange, vibrantOrange],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
    
    // Radii
    public static let radiusSmall: CGFloat = 8
    public static let radiusMedium: CGFloat = 14
    public static let radiusLarge: CGFloat = 20
    public static let radiusPill: CGFloat = 100
    
    // Shadows
    public static let softShadow = ShadowStyle(color: Color.black.opacity(0.06), radius: 12, x: 0, y: 4)
    public static let floatingShadow = ShadowStyle(color: Color.black.opacity(0.12), radius: 20, x: 0, y: 8)
}

public struct ShadowStyle {
    public let color: Color
    public let radius: CGFloat
    public let x: CGFloat
    public let y: CGFloat
}

// MARK: - Color Hex Extension
public extension Color {
    init(hex: UInt, alpha: Double = 1.0) {
        let r = Double((hex >> 16) & 0xFF) / 255.0
        let g = Double((hex >> 8) & 0xFF) / 255.0
        let b = Double(hex & 0xFF) / 255.0
        self.init(.sRGB, red: r, green: g, blue: b, opacity: alpha)
    }
}

// MARK: - View Modifiers
public struct MinimalCardModifier: ViewModifier {
    var cornerRadius: CGFloat = AppTheme.radiusLarge
    
    public func body(content: Content) -> some View {
        content
            .background(
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .fill(Color(UIColor.secondarySystemGroupedBackground))
            )
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .stroke(AppTheme.subtleBorder, lineWidth: 1)
            )
            .shadow(color: AppTheme.softShadow.color, radius: AppTheme.softShadow.radius, x: AppTheme.softShadow.x, y: AppTheme.softShadow.y)
    }
}

public struct GlassCardModifier: ViewModifier {
    var cornerRadius: CGFloat = AppTheme.radiusLarge
    
    public func body(content: Content) -> some View {
        content
            .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .stroke(Color.white.opacity(0.15), lineWidth: 1)
            )
            .shadow(color: AppTheme.floatingShadow.color, radius: AppTheme.floatingShadow.radius, x: AppTheme.floatingShadow.x, y: AppTheme.floatingShadow.y)
    }
}

public extension View {
    func minimalCard(cornerRadius: CGFloat = AppTheme.radiusLarge) -> some View {
        modifier(MinimalCardModifier(cornerRadius: cornerRadius))
    }
    
    func glassCard(cornerRadius: CGFloat = AppTheme.radiusLarge) -> some View {
        modifier(GlassCardModifier(cornerRadius: cornerRadius))
    }
}
