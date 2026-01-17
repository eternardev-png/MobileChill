// SVG Icons for consistent game style
import React from 'react';
import Svg, { Circle, Ellipse, Line, Path, Polygon, Rect, G, Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg';

export interface IconProps {
    size?: number;
    color?: string;
    style?: any;
}

// Coin icon - Minimalist flat design
export const CoinIcon: React.FC<IconProps> = ({ size = 20, color = '#fbbf24' }) => (
    <Svg width={size} height={size} viewBox="0 0 20 20">
        <Defs>
            <LinearGradient id="coinFlatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#fde68a" />
                <Stop offset="50%" stopColor={color} />
                <Stop offset="100%" stopColor="#f59e0b" />
            </LinearGradient>
        </Defs>
        {/* Main coin circle */}
        <Circle cx="10" cy="10" r="8.5" fill="url(#coinFlatGrad)" stroke="#d97706" strokeWidth="1.5" />
        {/* Inner circle for depth */}
        <Circle cx="10" cy="10" r="6" fill="none" stroke="#f59e0b" strokeWidth="1" opacity={0.4} />
    </Svg>
);

// Energy/Lightning icon - Enhanced with glow
export const EnergyIcon: React.FC<IconProps> = ({ size = 20, color = '#facc15' }) => (
    <Svg width={size} height={size} viewBox="0 0 20 20">
        <defs>
            <radialGradient id="energyGlow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor={color} />
                <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
        </defs>
        {/* Glow effect */}
        <Circle cx="10" cy="10" r="9" fill="url(#energyGlow)" opacity={0.6} />
        {/* Lightning bolt */}
        <Path d="M11 2 L6 11 L9 11 L7 18 L14 9 L11 9 L11 2"
            fill="url(#lightningGrad)"
            stroke="#eab308"
            strokeWidth="0.5" />
        {/* Inner highlight */}
        <Path d="M10.5 3 L7 10 L9 10 L8 15 L12 10 L10.5 10 L10.5 3"
            fill="#fff"
            opacity={0.3} />
    </Svg>
);

// Gem Icon - Green Diamond (Classic Gem Shape)
export const GemIcon: React.FC<IconProps> = ({ size = 20, color = '#22c55e' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            <LinearGradient id="gemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#4ade80" />
                <Stop offset="50%" stopColor={color} />
                <Stop offset="100%" stopColor="#15803d" />
            </LinearGradient>
            <LinearGradient id="gemShine" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
                <Stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </LinearGradient>
        </Defs>
        {/* Main Diamond Shape */}
        <Polygon points="7,4 17,4 22,10 12,22 2,10" fill="url(#gemGrad)" stroke="#064e3b" strokeWidth="0.5" />
        {/* Facets for "Brilliant" look */}
        <Polygon points="7,4 17,4 12,10" fill="#fff" opacity={0.25} /> {/* Top center facet */}
        <Polygon points="7,4 12,10 2,10" fill="#14532d" opacity={0.2} /> {/* Top left */}
        <Polygon points="17,4 22,10 12,10" fill="#14532d" opacity={0.2} /> {/* Top right */}
        <Polygon points="2,10 12,22 12,10" fill="#064e3b" opacity={0.3} /> {/* Bottom left */}
        <Polygon points="22,10 12,22 12,10" fill="#14532d" opacity={0.4} /> {/* Bottom right */}

        {/* Sparkle/Shine edges */}
        <Line x1="7" y1="4" x2="17" y2="4" stroke="#fff" strokeWidth="0.5" opacity={0.5} />
        <Line x1="2" y1="10" x2="22" y2="10" stroke="#fff" strokeWidth="0.3" opacity={0.3} />

        {/* Top Shine Highlight */}
        <Polygon points="9,5 15,5 12,8" fill="url(#gemShine)" opacity={0.3} />
    </Svg>
);


// Growth Rate Icon - Distinct from Seeds (Upward Chart/Arrow with Sprout)
export const GrowthRateIcon: React.FC<IconProps> = ({ size = 20, color = '#4ade80' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Graph/Chart upward */}
        <Path d="M3 20 L21 20" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Path d="M5 16 L9 11 L13 14 L20 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Arrow head */}
        <Path d="M16 6 L20 6 L20 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Nature element - Sprout leaves at top */}
        <Path d="M20 6 L22 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <Circle cx="22" cy="4" r="1.5" fill={color} />
    </Svg>
);

// Diamond/Shard icon for prestige - Updated to match the requested simple diamond shape
export const DiamondIcon: React.FC<IconProps> = ({ size = 20, color = '#a855f7' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            <LinearGradient id="shardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#d8b4fe" />
                <Stop offset="50%" stopColor={color} />
                <Stop offset="100%" stopColor="#7e22ce" />
            </LinearGradient>
        </Defs>
        {/* Simple Diamond Shape from reference */}
        <Path
            d="M12,2 L20,12 L12,22 L4,12 Z"
            fill="url(#shardGrad)"
            stroke="#6b21a8"
            strokeWidth="0.5"
        />
        {/* Top Highlight Facet */}
        <Path
            d="M12,2 L16,7 L12,12 L8,7 Z"
            fill="#fff"
            opacity={0.3}
        />
    </Svg>
);

// Prestige Icon (alias for Diamond or specific)
export const PrestigeIcon = DiamondIcon;

// Time icon
export const TimeIcon = ({ size = 24, color = "#fff" }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="2" />
        <Path d="M12 7 V12 L15 15" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);



// Shop/Cart icon
export const ShopIcon: React.FC<IconProps> = ({ size = 20, color = '#fff' }) => (
    <Svg width={size} height={size} viewBox="0 0 20 20">
        <Path d="M3 4 L5 4 L7 14 L16 14 L18 6 L6 6" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="8" cy="17" r="1.5" fill={color} />
        <Circle cx="14" cy="17" r="1.5" fill={color} />
    </Svg>
);

// Quest Upgrade Icon - Simple Gear + Arrow Up
export const QuestUpgradeIcon: React.FC<IconProps> = ({ size = 20, color = '#60a5fa' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Gear */}
        <G transform="translate(2, 8)">
            <Circle cx="7" cy="7" r="5" fill="none" stroke={color} strokeWidth="2" />
            <Circle cx="7" cy="7" r="2" fill={color} />
            {/* Gear teeth */}
            <Path d="M7,1 L7,0 M7,13 L7,14 M1,7 L0,7 M13,7 L14,7 M2.5,2.5 L1.5,1.5 M11.5,11.5 L12.5,12.5 M2.5,11.5 L1.5,12.5 M11.5,2.5 L12.5,1.5"
                stroke={color} strokeWidth="2" strokeLinecap="round" />
        </G>
        {/* Arrow Up */}
        <G transform="translate(14, 2)">
            <Path d="M4,16 L4,4 M0,8 L4,4 L8,8" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </G>
    </Svg>
);

// Prestige Cosmetic Icon - Paintbrush with sparkles
export const PrestigeCosmeticIcon: React.FC<IconProps> = ({ size = 28, color = '#e879f9' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Paintbrush Handle */}
        <Path d="M4,20 L10,14" stroke="#7e22ce" strokeWidth="3" strokeLinecap="round" />
        {/* Brush Ferrule */}
        <Rect x="9" y="11" width="4" height="5" rx="1" fill="#9ca3af" transform="rotate(-45, 11, 13.5)" />
        {/* Brush Bristles */}
        <Path d="M12,12 L18,6 Q20,4 18,6 L14,10" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Sparkles */}
        <Path d="M18,3 L19,5 L21,4 L19,5 L20,7 L19,5 L17,6 L19,5 L18,3" fill="#fff" stroke="#fff" strokeWidth="0.5" />
        <Circle cx="6" cy="8" r="1" fill="#e879f9" />
        <Circle cx="16" cy="10" r="0.8" fill="#fff" opacity={0.7} />
    </Svg>
);

// Scroll/Quest icon
export const QuestIcon: React.FC<IconProps> = ({ size = 20, color = '#fbbf24' }) => (
    <Svg width={size} height={size} viewBox="0 0 20 20">
        <Rect x="5" y="2" width="10" height="16" rx="2" fill="#292524" stroke={color} strokeWidth="1.5" />
        <Line x1="7" y1="6" x2="13" y2="6" stroke={color} strokeWidth="1" />
        <Line x1="7" y1="9" x2="13" y2="9" stroke={color} strokeWidth="1" />
        <Line x1="7" y1="12" x2="11" y2="12" stroke={color} strokeWidth="1" />
    </Svg>
);

// Roulette/Wheel icon
export const RouletteIcon: React.FC<IconProps> = ({ size = 20, color = '#f472b6' }) => (
    <Svg width={size} height={size} viewBox="0 0 20 20">
        <Circle cx="10" cy="10" r="8" fill="none" stroke={color} strokeWidth="2" />
        <Circle cx="10" cy="10" r="3" fill={color} />
        <Line x1="10" y1="2" x2="10" y2="5" stroke={color} strokeWidth="1.5" />
        <Line x1="10" y1="15" x2="10" y2="18" stroke={color} strokeWidth="1.5" />
        <Line x1="2" y1="10" x2="5" y2="10" stroke={color} strokeWidth="1.5" />
        <Line x1="15" y1="10" x2="18" y2="10" stroke={color} strokeWidth="1.5" />
    </Svg>
);

// Lab/Flask Icon - Redrawn as Erlenmeyer flask based on reference
export const LabIcon: React.FC<IconProps> = ({ size = 20, color = '#a855f7' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Flask Glass Outline & Body */}
        <Path
            d="M9,3 L15,3 M10,3 L10,8 L5,19 C4.5,20.5 5.5,21 7,21 L17,21 C18.5,21 19.5,20.5 19,19 L14,8 L14,3"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinejoin="round"
        />
        {/* Liquid Inside */}
        <Path
            d="M7.5,14 L16.5,14 L18.5,19 C18.7,19.5 18.2,20 17,20 L7,20 C5.8,20 5.3,19.5 5.5,19 L7.5,14 Z"
            fill={color}
            opacity={0.6}
        />
        {/* Bubbles/Shine */}
        <Circle cx="10" cy="17" r="1" fill="#fff" opacity={0.4} />
        <Circle cx="14" cy="18" r="0.7" fill="#fff" opacity={0.3} />
        {/* Top Rim highlighting */}
        <Path d="M9.5,4 L14.5,4" stroke="#fff" strokeWidth="1" opacity={0.3} />
    </Svg>
);

// Tree icon (for collection)
export const TreeNavIcon: React.FC<IconProps> = ({ size = 20, color = '#22c55e' }) => (
    <Svg width={size} height={size} viewBox="0 0 20 20">
        <Line x1="10" y1="18" x2="10" y2="7" stroke="#854d0e" strokeWidth="3" strokeLinecap="round" />
        <Circle cx="10" cy="6" r="5" fill={color} />
        <Circle cx="6" cy="9" r="3" fill={color} />
        <Circle cx="14" cy="9" r="3" fill={color} />
    </Svg>
);

// Alias TreeNavIcon as TreeIcon since App.tsx expects TreeIcon
export const TreeIcon = TreeNavIcon;

// Settings Icon
export const SettingsIcon: React.FC<IconProps> = ({ size = 20, color = '#888' }) => (
    <Svg width={size} height={size} viewBox="0 0 20 20">
        <Circle cx="10" cy="10" r="5" fill="none" stroke={color} strokeWidth="2" />
        <Line x1="10" y1="2" x2="10" y2="18" stroke={color} strokeWidth="2" strokeDasharray="2,4" />
        <Line x1="2" y1="10" x2="18" y2="10" stroke={color} strokeWidth="2" strokeDasharray="2,4" />
    </Svg>
);

// Height/Ruler icon
export const HeightIcon: React.FC<IconProps> = ({ size = 16, color = '#888' }) => (
    <Svg width={size} height={size} viewBox="0 0 16 16">
        <Line x1="8" y1="2" x2="8" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Line x1="5" y1="2" x2="11" y2="2" stroke={color} strokeWidth="1.5" />
        <Line x1="5" y1="14" x2="11" y2="14" stroke={color} strokeWidth="1.5" />
    </Svg>
);

// Tap/Hand icon
export const TapIcon: React.FC<IconProps> = ({ size = 16, color = '#888' }) => (
    <Svg width={size} height={size} viewBox="0 0 16 16">
        <Circle cx="8" cy="4" r="2.5" fill="none" stroke={color} strokeWidth="1.5" />
        <Path d="M8 6.5 L8 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M5 10 L8 13 L11 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
);

// Auto/Loop icon
export const AutoIcon: React.FC<IconProps> = ({ size = 16, color = '#4ade80' }) => (
    <Svg width={size} height={size} viewBox="0 0 16 16">
        <Path d="M12 4 A5 5 0 1 1 8 3" fill="none" stroke={color} strokeWidth="1.5" />
        <Polygon points="12,1 14,4 12,4" fill={color} />
    </Svg>
);

// Star icon
export const StarIcon: React.FC<IconProps> = ({ size = 16, color = '#fbbf24' }) => (
    <Svg width={size} height={size} viewBox="0 0 16 16">
        <Polygon points="8,1 10,6 15,6 11,9 13,15 8,11 3,15 5,9 1,6 6,6" fill={color} />
    </Svg>
);

// ============ PRESTIGE UPGRADE ICONS (Purple Theme) ============

// Prestige Tap Power Icon
export const PrestigeTapIcon: React.FC<IconProps> = ({ size = 28, color = '#a855f7' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            <LinearGradient id="tapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#e879f9" />
                <Stop offset="100%" stopColor={color} />
            </LinearGradient>
        </Defs>
        {/* Hand/Finger pointing */}
        <Circle cx="12" cy="8" r="4" fill="url(#tapGrad)" />
        <Path d="M12 12 L12 20" stroke="url(#tapGrad)" strokeWidth="3" strokeLinecap="round" />
        <Path d="M8 16 L12 20 L16 16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Ripple effect */}
        <Circle cx="12" cy="20" r="5" fill="none" stroke="#c084fc" strokeWidth="1" opacity={0.4} />
    </Svg>
);

// Prestige Coin Icon
export const PrestigeCoinIcon: React.FC<IconProps> = ({ size = 28, color = '#a855f7' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            <RadialGradient id="prestigeCoinGrad" cx="40%" cy="30%">
                <Stop offset="0%" stopColor="#e879f9" />
                <Stop offset="70%" stopColor={color} />
                <Stop offset="100%" stopColor="#7e22ce" />
            </RadialGradient>
        </Defs>
        <Circle cx="12" cy="12" r="10" fill="url(#prestigeCoinGrad)" stroke="#9333ea" strokeWidth="1" />
        <Ellipse cx="12" cy="12" rx="7" ry="10" fill="none" stroke="#c084fc" strokeWidth="1.5" />
        <Circle cx="10" cy="9" r="3" fill="#fff" opacity={0.3} />
    </Svg>
);

// Prestige Energy Icon
export const PrestigeEnergyIcon: React.FC<IconProps> = ({ size = 28, color = '#a855f7' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            <LinearGradient id="prestigeEnergyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#e879f9" />
                <Stop offset="100%" stopColor="#7e22ce" />
            </LinearGradient>
            <RadialGradient id="energyGlowPurple" cx="50%" cy="50%">
                <Stop offset="0%" stopColor="#e879f9" stopOpacity="0.6" />
                <Stop offset="100%" stopColor={color} stopOpacity="0" />
            </RadialGradient>
        </Defs>
        <Circle cx="12" cy="12" r="11" fill="url(#energyGlowPurple)" />
        <Path d="M13 3 L8 13 L11 13 L9 21 L16 11 L13 11 L13 3" fill="url(#prestigeEnergyGrad)" stroke="#9333ea" strokeWidth="0.5" />
        <Path d="M12.5 5 L9 12 L11 12 L10 18 L14 12 L12.5 12 L12.5 5" fill="#fff" opacity={0.25} />
    </Svg>
);

// Prestige Growth Icon
export const PrestigeGrowthIcon: React.FC<IconProps> = ({ size = 28, color = '#a855f7' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            <LinearGradient id="growthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#e879f9" />
                <Stop offset="100%" stopColor="#7e22ce" />
            </LinearGradient>
        </Defs>
        {/* Stem */}
        <Path d="M12 20 L12 10" stroke="url(#growthGrad)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Leaves */}
        <Ellipse cx="9" cy="10" rx="4" ry="6" fill={color} transform="rotate(-25 9 10)" opacity={0.8} />
        <Ellipse cx="15" cy="10" rx="4" ry="6" fill="#c084fc" transform="rotate(25 15 10)" opacity={0.8} />
        {/* Sprout at top */}
        <Circle cx="12" cy="8" r="3" fill="#e879f9" />
        <Path d="M12 5 Q10 3 12 1" fill="none" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

// Prestige Tree Icon
export const PrestigeTreeIcon: React.FC<IconProps> = ({ size = 28, color = '#a855f7' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            <RadialGradient id="treeLeafGrad" cx="50%" cy="30%">
                <Stop offset="0%" stopColor="#e879f9" />
                <Stop offset="100%" stopColor={color} />
            </RadialGradient>
        </Defs>
        {/* Trunk */}
        <Path d="M12 22 L12 12" stroke="#7e22ce" strokeWidth="3" strokeLinecap="round" />
        {/* Canopy */}
        <Circle cx="12" cy="10" r="6" fill="url(#treeLeafGrad)" />
        <Circle cx="8" cy="13" r="4" fill={color} opacity={0.8} />
        <Circle cx="16" cy="13" r="4" fill="#c084fc" opacity={0.8} />
        {/* Highlight */}
        <Circle cx="11" cy="8" r="2" fill="#fff" opacity={0.4} />
    </Svg>
);

// Prestige Rainbow/RGB Icon
export const PrestigeRainbowIcon: React.FC<IconProps> = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            <LinearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#e879f9" />
                <Stop offset="33%" stopColor="#a855f7" />
                <Stop offset="66%" stopColor="#7e22ce" />
                <Stop offset="100%" stopColor="#c084fc" />
            </LinearGradient>
        </Defs>
        {/* Rainbow arcs */}
        <Path d="M4 18 Q12 4 20 18" fill="none" stroke="url(#rainbowGrad)" strokeWidth="3" strokeLinecap="round" />
        <Path d="M6 18 Q12 8 18 18" fill="none" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" opacity={0.7} />
        <Path d="M8 18 Q12 12 16 18" fill="none" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" opacity={0.5} />
    </Svg>
);

// Prestige Sparkle Icon
export const PrestigeSparkleIcon: React.FC<IconProps> = ({ size = 28, color = '#a855f7' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            <RadialGradient id="sparkleGrad" cx="50%" cy="50%">
                <Stop offset="0%" stopColor="#fff" />
                <Stop offset="50%" stopColor="#e879f9" />
                <Stop offset="100%" stopColor={color} />
            </RadialGradient>
        </Defs>
        {/* Main star */}
        <Polygon points="12,2 14,10 22,12 14,14 12,22 10,14 2,12 10,10" fill="url(#sparkleGrad)" />
        {/* Small sparkles */}
        <Polygon points="6,6 7,8 9,9 7,10 6,12 5,10 3,9 5,8" fill="#e879f9" opacity={0.6} />
        <Polygon points="18,6 19,8 21,9 19,10 18,12 17,10 15,9 17,8" fill="#c084fc" opacity={0.6} />
    </Svg>
);

// Prestige Glow Icon
export const PrestigeGlowIcon: React.FC<IconProps> = ({ size = 28, color = '#a855f7' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            <RadialGradient id="glowMainGrad" cx="50%" cy="50%">
                <Stop offset="0%" stopColor="#e879f9" stopOpacity="1" />
                <Stop offset="70%" stopColor={color} stopOpacity="0.6" />
                <Stop offset="100%" stopColor={color} stopOpacity="0" />
            </RadialGradient>
        </Defs>
        {/* Outer glow rings */}
        <Circle cx="12" cy="12" r="11" fill="url(#glowMainGrad)" opacity={0.3} />
        <Circle cx="12" cy="12" r="8" fill="url(#glowMainGrad)" opacity={0.5} />
        <Circle cx="12" cy="12" r="5" fill={color} />
        {/* Radial lines */}
        <Line x1="12" y1="2" x2="12" y2="6" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" opacity={0.8} />
        <Line x1="12" y1="18" x2="12" y2="22" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" opacity={0.8} />
        <Line x1="2" y1="12" x2="6" y2="12" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" opacity={0.8} />
        <Line x1="18" y1="12" x2="22" y2="12" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" opacity={0.8} />
        {/* Center bright spot */}
        <Circle cx="12" cy="12" r="2" fill="#fff" opacity={0.9} />
    </Svg>
);

// ============ TREE ICONS (Replacing Emojis) ============

export const TreeOakIcon: React.FC<IconProps> = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Trunk */}
        <Path d="M12 22 L12 12" stroke="#854d0e" strokeWidth="3" strokeLinecap="round" />
        {/* Oak Canopy - Round and fluffy */}
        <Circle cx="12" cy="10" r="7" fill="#4ade80" stroke="#166534" strokeWidth="1" />
        <Circle cx="9" cy="8" r="4" fill="#86efac" opacity={0.5} />
    </Svg>
);

export const TreePineIcon: React.FC<IconProps> = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M12 22 L12 18" stroke="#854d0e" strokeWidth="3" strokeLinecap="round" />
        {/* Pine shape - Triangles */}
        <Path d="M12 2 L4 18 L20 18 Z" fill="#15803d" stroke="#052e16" strokeWidth="1" />
        <Path d="M12 5 L6 14 L18 14 Z" fill="#166534" />
        <Path d="M12 2 L9 8 L15 8 Z" fill="#22c55e" />
    </Svg>
);

export const TreeMapleIcon: React.FC<IconProps> = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M12 22 L12 14" stroke="#854d0e" strokeWidth="3" strokeLinecap="round" />
        {/* Maple Leaf Shape (Stylized) */}
        <Path d="M12 3 L15 8 L20 8 L16 12 L18 18 L12 15 L6 18 L8 12 L4 8 L9 8 Z" fill="#fb923c" stroke="#c2410c" strokeWidth="1" />
        <Circle cx="12" cy="10" r="2" fill="#fed7aa" opacity={0.3} />
    </Svg>
);

export const TreeBaobabIcon: React.FC<IconProps> = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Thick Trunk */}
        <Path d="M8 22 L8 12 Q8 6 12 12 Q16 6 16 12 L16 22" fill="#78350f" stroke="#451a03" strokeWidth="1" />
        {/* Flat Top Canopy */}
        <Path d="M6 10 Q12 0 18 10" fill="#a3e635" stroke="#3f6212" strokeWidth="1" />
        <Path d="M7 8 Q12 1 17 8" fill="#d9f99d" opacity={0.4} />
    </Svg>
);

export const TreeMoneyIcon: React.FC<IconProps> = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M12 22 L12 12" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
        {/* Golden Canopy */}
        <Circle cx="12" cy="10" r="7" fill="#facc15" stroke="#a16207" strokeWidth="1" />
        {/* Dollar Sign */}
        <Path d="M12 7 L12 13 M10 8 C10 8 14 8 14 9 C14 10 10 10 10 11 C10 12 14 12 14 12" stroke="#854d0e" strokeWidth="2" strokeLinecap="round" fill="none" />
    </Svg>
);

export const TreeCherryIcon: React.FC<IconProps> = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M12 22 L12 12" stroke="#5f370e" strokeWidth="3" strokeLinecap="round" />
        {/* Pink Cloud */}
        <Path d="M12 4 Q18 4 19 9 Q20 15 12 15 Q4 15 5 9 Q6 4 12 4" fill="#f9a8d4" stroke="#db2777" strokeWidth="1" />
        <Circle cx="10" cy="8" r="1.5" fill="#fbcfe8" />
        <Circle cx="15" cy="10" r="1.5" fill="#fbcfe8" />
    </Svg>
);

// ============ QUEST ICONS ============

export const QuestTapIcon: React.FC<IconProps> = ({ size = 20, color = '#f472b6' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M12 2 L12 6" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Circle cx="12" cy="14" r="6" fill="none" stroke={color} strokeWidth="2" />
        <Circle cx="12" cy="14" r="3" fill={color} />
    </Svg>
);

export const QuestHeightIcon: React.FC<IconProps> = ({ size = 20, color = '#22c55e' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M12 22 L12 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Path d="M8 6 L12 2 L16 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <Line x1="8" y1="22" x2="16" y2="22" stroke={color} strokeWidth="2" />
        <Line x1="9" y1="18" x2="15" y2="18" stroke={color} strokeWidth="1" opacity={0.5} />
        <Line x1="9" y1="14" x2="15" y2="14" stroke={color} strokeWidth="1" opacity={0.5} />
    </Svg>
);

export const QuestLabIcon: React.FC<IconProps> = ({ size = 20, color = '#a855f7' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M9 21h6v-1.5a2.5 2.5 0 0 0-1.5-2.3V11h2V9H8v2h2v6.2A2.5 2.5 0 0 0 8.5 19.5V21H9z" fill={color} stroke={color} strokeWidth="1" fillOpacity={0.3} />
        <Circle cx="12" cy="15" r="1.5" fill={color} />
        <Circle cx="11" cy="18" r="1" fill={color} />
    </Svg>
);

// Casino/Roulette Icon
export const CasinoIcon: React.FC<IconProps> = ({ size = 24, color = '#fbbf24' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            <RadialGradient id="rouletteGrad" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#fff" stopOpacity="0.2" />
                <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </RadialGradient>
        </Defs>
        {/* Outer Wheel Rim */}
        <Circle cx="12" cy="12" r="10" fill="#222" stroke="#333" strokeWidth="1" />
        {/* Segments (Simulated) */}
        <G transform="translate(12, 12)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <Path
                    key={angle}
                    d={`M0,0 L${8 * Math.cos(angle * Math.PI / 180)},${8 * Math.sin(angle * Math.PI / 180)} A8,8 0 0,1 ${8 * Math.cos((angle + 45) * Math.PI / 180)},${8 * Math.sin((angle + 45) * Math.PI / 180)} Z`}
                    fill={i % 2 === 0 ? '#ef4444' : '#111'}
                />
            ))}
        </G>
        {/* Glow */}
        <Circle cx="12" cy="12" r="8" fill="url(#rouletteGrad)" />
        {/* Center Knob */}
        <Circle cx="12" cy="12" r="3" fill={color} stroke="#b45309" strokeWidth="0.5" />
        {/* Shine */}
        <Circle cx="11" cy="11" r="1.2" fill="#fff" opacity={0.6} />
    </Svg>
);

// Slot Machine Icon (777)
export const SlotIcon: React.FC<IconProps> = ({ size = 24, color = '#ef4444' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke={color} strokeWidth="1.5" />
        <Line x1="2" y1="9" x2="22" y2="9" stroke={color} strokeWidth="1" opacity={0.5} />
        <Line x1="2" y1="15" x2="22" y2="15" stroke={color} strokeWidth="1" opacity={0.5} />
        <Line x1="8" y1="4" x2="8" y2="20" stroke={color} strokeWidth="1" opacity={0.5} />
        <Line x1="16" y1="4" x2="16" y2="20" stroke={color} strokeWidth="1" opacity={0.5} />
        {/* Sevens */}
        <Path d="M4 11 L7 11 L5 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <Path d="M10.5 11 L13.5 11 L11.5 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <Path d="M17 11 L20 11 L18 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
);

// Shop Composite Icons

export const ShopFasterGrowthIcon: React.FC<IconProps> = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Tree Part */}
        <G transform="translate(-2, 2) scale(0.85)">
            <Path d="M10 22 L10 14" stroke="#854d0e" strokeWidth="3" strokeLinecap="round" />
            <Circle cx="10" cy="8" r="7" fill="#22c55e" stroke="#166534" strokeWidth="1" />
        </G>
        {/* Smaller Arrow Up Part - closer to tree */}
        <G transform="translate(16, 6) scale(0.7)">
            <Path d="M0 6 L4 0 L8 6 M4 0 L4 16" fill="none" stroke="#4ade80" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </G>
    </Svg>
);

export const ShopAutoEnergyIcon: React.FC<IconProps> = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Energy Part */}
        <G transform="translate(-1, 0) scale(1.0)">
            <Path d="M13 3 L8 13 L11 13 L9 21 L16 11 L13 11 L13 3" fill="#facc15" stroke="#eab308" strokeWidth="1" />
        </G>
        {/* Mini Time Part - closer */}
        <G transform="translate(11, 11) scale(0.55)">
            <Circle cx="12" cy="12" r="9" fill="#1a1a1a" stroke="#fff" strokeWidth="2.5" />
            <Path d="M12 7 V12 L15 15" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </G>
    </Svg>
);

export const ShopAutoGrowthIcon: React.FC<IconProps> = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Tree Part */}
        <G transform="translate(-2, 2) scale(0.8)">
            <Path d="M12 22 L12 12" stroke="#854d0e" strokeWidth="3" strokeLinecap="round" />
            <Circle cx="12" cy="6" r="5" fill="#22c55e" />
            <Circle cx="6" cy="9" r="3" fill="#22c55e" />
            <Circle cx="14" cy="9" r="3" fill="#22c55e" />
        </G>
        {/* Mini Time Part - closer */}
        <G transform="translate(11, 11) scale(0.55)">
            <Circle cx="12" cy="12" r="9" fill="#1a1a1a" stroke="#fff" strokeWidth="2.5" />
            <Path d="M12 7 V12 L15 15" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </G>
    </Svg>
);

export const ShopGoldMineIcon: React.FC<IconProps> = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Gold Part */}
        <G transform="translate(-1, 2) scale(1.0)">
            <Circle cx="10" cy="10" r="8.5" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            <Circle cx="10" cy="10" r="6" fill="none" stroke="#f59e0b" strokeWidth="1" opacity={0.4} />
        </G>
        {/* Mini Time Part - closer */}
        <G transform="translate(11, 11) scale(0.55)">
            <Circle cx="12" cy="12" r="9" fill="#1a1a1a" stroke="#fff" strokeWidth="2.5" />
            <Path d="M12 7 V12 L15 15" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </G>
    </Svg>
);

export const ShopTapIcon: React.FC<IconProps> = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* The Energy Bolt (on the left) */}
        <G transform="translate(2, 4) scale(0.8)">
            <Path d="M11 2 L6 11 L9 11 L7 18 L14 9 L11 9 L11 2" fill="#facc15" stroke="#eab308" strokeWidth="1" />
        </G>

        {/* White Mouse Arrow Cursor (to the right of the bolt) */}
        <G transform="translate(10, 6) rotate(-10)">
            {/* Black Outline */}
            <Path
                d="M0,0 v13 l3,-3 l2,5 h2 l-2,-5 h5 Z"
                fill="#000"
            />
            {/* White Fill */}
            <Path
                d="M1,2 v9 l2,-2 l2,5 h1 l-2,-5 h4 Z"
                fill="#fff"
            />
        </G>
    </Svg>
);

export const ShopCoinMultiplierIcon: React.FC<IconProps> = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Arrow Up Part */}
        <Path d="M6 14 L10 10 M10 10 L14 14 M10 10 L10 20" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {/* Coin Part */}
        <G transform="translate(12, 4) scale(0.5)">
            <Circle cx="10" cy="10" r="8.5" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
            <Path d="M10 6 V14 M8 8 H12" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
        </G>
    </Svg>
);

// Standalone White Cursor for Quests
export const CursorWhiteIcon: React.FC<IconProps> = ({ size = 20 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <G transform="rotate(-15, 12, 12)">
            <Path d="M4,0 v13 l3,-3 l2,5 h2 l-2,-5 h5 Z" fill="#fff" stroke="#000" strokeWidth="1" />
        </G>
    </Svg>
);

// Colored Lab Icons
export const LabGreyIcon: React.FC<IconProps> = (props) => <LabIcon {...props} color="#94a3b8" />;
export const LabBlueIcon: React.FC<IconProps> = (props) => <LabIcon {...props} color="#38bdf8" />;
export const LabPurpleIcon: React.FC<IconProps> = (props) => <LabIcon {...props} color="#a855f7" />;
export const LabYellowIcon: React.FC<IconProps> = (props) => <LabIcon {...props} color="#fbbf24" />;

// ============ PRESTIGE SHOP ICONS (Specific) ============

export const PrestigeStrongArmIcon: React.FC<IconProps> = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            <LinearGradient id="armGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#e879f9" />
                <Stop offset="100%" stopColor="#a855f7" />
            </LinearGradient>
        </Defs>
        {/* Strong Arm / Flexing Muscle */}
        <Path
            d="M4 14 Q2 10 6 8 Q10 6 12 10 L16 8 Q20 10 18 16 Q16 22 10 20 Q6 18 4 14"
            fill="url(#armGrad)"
            stroke="#7e22ce"
            strokeWidth="1.5"
        />
        <Path d="M10 12 Q12 10 14 12" fill="none" stroke="#fff" strokeWidth="1.5" opacity={0.4} />
    </Svg>
);

export const PrestigeGoldenTouchIcon: React.FC<IconProps> = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Purple Coin */}
        <G transform="translate(-2, 2)">
            <Circle cx="10" cy="10" r="9" fill="#a855f7" stroke="#7e22ce" strokeWidth="1.5" />
            <Path d="M10 5 V15 M7 8 L10 5 L13 8" fill="none" stroke="#fff" strokeWidth="2" opacity={0.3} />
        </G>
        {/* Floating Purple Arrow Up */}
        <G transform="translate(14, 4) scale(0.8)">
            <Path d="M0 8 L4 0 L8 8 M4 0 L4 16" fill="none" stroke="#e879f9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </G>
    </Svg>
);

export const PrestigeLargeEnergyIcon: React.FC<IconProps> = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <RadialGradient id="bigEnergyGlow" cx="50%" cy="50%">
            <Stop offset="0%" stopColor="#e879f9" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </RadialGradient>
        <Circle cx="12" cy="12" r="11" fill="url(#bigEnergyGlow)" />
        <Path d="M14 2 L7 13 L11 13 L9 22 L17 11 L13 11 L13 2" fill="#a855f7" stroke="#7e22ce" strokeWidth="1" />
        <Path d="M13.5 4 L9 12 L11 12 L10 18 L15 12 L13.5 12 L13.5 4" fill="#fff" opacity={0.3} />
    </Svg>
);

export const PrestigeRapidGrowthIcon: React.FC<IconProps> = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Purple Tree */}
        <G transform="translate(-2, 2) scale(0.9)">
            <Path d="M10 22 L10 14" stroke="#7e22ce" strokeWidth="3" strokeLinecap="round" />
            <Circle cx="10" cy="8" r="7" fill="#a855f7" stroke="#7e22ce" strokeWidth="1" />
        </G>
        {/* Tiny Arrow Right of Tree */}
        <G transform="translate(16, 8) scale(0.5)">
            <Path d="M0 8 L4 0 L8 8 M4 0 L4 16" fill="none" stroke="#e879f9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </G>
    </Svg>
);

export const PrestigeEternalEnergyIcon: React.FC<IconProps> = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Large Energy */}
        <Path d="M12 2 L7 12 L11 12 L9 21 L16 11 L12 11 L12 2" fill="#a855f7" stroke="#7e22ce" strokeWidth="1" />
        {/* Tiny Time Badge Bottom Right */}
        <G transform="translate(13, 13) scale(0.45)">
            <Circle cx="12" cy="12" r="10" fill="#1a1a1a" stroke="#e879f9" strokeWidth="3" />
            <Path d="M12 6 V12 L16 16" fill="none" stroke="#e879f9" strokeWidth="3" strokeLinecap="round" />
        </G>
    </Svg>
);

export const PrestigeEternalWealthIcon: React.FC<IconProps> = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Purple Coin */}
        <Circle cx="10" cy="10" r="9" fill="#a855f7" stroke="#7e22ce" strokeWidth="1.5" />
        {/* Tiny Time Badge Bottom Right */}
        <G transform="translate(13, 13) scale(0.45)">
            <Circle cx="12" cy="12" r="10" fill="#1a1a1a" stroke="#e879f9" strokeWidth="3" />
            <Path d="M12 6 V12 L16 16" fill="none" stroke="#e879f9" strokeWidth="3" strokeLinecap="round" />
        </G>
    </Svg>
);

// Map string identifiers to Components
export const getIconByName = (name: string, size = 20, color?: string) => {
    const props = { size, color };
    switch (name) {
        // Resources
        case 'icon_coin': return <CoinIcon {...props} />;
        case 'icon_energy': return <EnergyIcon {...props} />;
        case 'icon_gem': return <GemIcon {...props} />;
        case 'icon_prestige': return <PrestigeIcon {...props} />;

        // Prestige Specific
        case 'prestige_power': return <PrestigeStrongArmIcon {...props} />;
        case 'prestige_coin': return <PrestigeGoldenTouchIcon {...props} />;
        case 'prestige_energy_big': return <PrestigeLargeEnergyIcon {...props} />;
        case 'prestige_rapid': return <PrestigeRapidGrowthIcon {...props} />;
        case 'prestige_auto_energy': return <PrestigeEternalEnergyIcon {...props} />;
        case 'prestige_auto_wealth': return <PrestigeEternalWealthIcon {...props} />;
        case 'prestige_cosmetic': return <PrestigeCosmeticIcon {...props} />;

        // Shop Specific
        case 'shop_tap': return <ShopTapIcon {...props} />;
        case 'shop_faster_growth': return <ShopFasterGrowthIcon {...props} />;
        case 'shop_auto_energy': return <ShopAutoEnergyIcon {...props} />;
        case 'shop_auto_growth': return <ShopAutoGrowthIcon {...props} />;
        case 'shop_gold_mine': return <ShopGoldMineIcon {...props} />;
        case 'shop_coin_multiplier': return <ShopCoinMultiplierIcon {...props} />;

        // Trees
        case 'tree_oak': return <TreeOakIcon {...props} />;
        case 'tree_pine': return <TreePineIcon {...props} />;
        case 'tree_maple': return <TreeMapleIcon {...props} />;
        case 'tree_baobab': return <TreeBaobabIcon {...props} />;
        case 'tree_money': return <TreeMoneyIcon {...props} />;
        case 'tree_cherry': return <TreeCherryIcon {...props} />;

        // Settings/UI
        case 'icon_settings': return <SettingsIcon {...props} />;
        case 'icon_shop': return <ShopIcon {...props} />;
        case 'icon_quest': return <QuestIcon {...props} />;
        case 'icon_lab': return <LabIcon {...props} />;
        case 'icon_casino': return <CasinoIcon {...props} />;

        // Quests
        case 'quest_upgrade': return <QuestUpgradeIcon {...props} />;
        case 'quest_tap': return <QuestTapIcon {...props} />;
        case 'quest_cursor': return <CursorWhiteIcon {...props} />;
        case 'quest_height': return <QuestHeightIcon {...props} />;
        case 'quest_energy': return <EnergyIcon {...props} />;
        case 'quest_roulette': return <CasinoIcon {...props} />;
        case 'quest_lab': return <QuestLabIcon {...props} />;
        case 'lab_grey': return <LabGreyIcon {...props} />;
        case 'lab_blue': return <LabBlueIcon {...props} />;
        case 'lab_purple': return <LabPurpleIcon {...props} />;
        case 'lab_yellow': return <LabYellowIcon {...props} />;
        case 'quest_unlock': return <TreeIcon {...props} />; // Reuse genric tree

        // Fallback
        default: return <EnergyIcon {...props} />; // Default
    }
};
