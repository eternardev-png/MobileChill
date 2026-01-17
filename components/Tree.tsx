import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing, TouchableWithoutFeedback, Text } from 'react-native';
import Svg, { Line, G, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useGame } from '../gameState';
import { TreeSpecies } from '../data/treeSpecies';
import { TREE_GROUND_POSITION } from './GameHUD';

const { width, height } = Dimensions.get('window');

// Recursively generate tree branches with species-specific patterns
const generateBranches = (
  x1: number,
  y1: number,
  angle: number,
  length: number,
  depth: number,
  maxDepth: number,
  species: TreeSpecies,
  hueShift: number,
  animValue: Animated.Value,
  zoom: number,
  branchPath: string = "root" // Topological path for stable RNG and keys
): JSX.Element[] => {
  // Recursion Stop Condition - FPS FIX: Minimum length 2px
  if (depth > maxDepth || length < 2) return [];

  // Calculate end point
  const x2 = x1 + length * Math.sin((angle * Math.PI) / 180);
  const y2 = y1 - length * Math.cos((angle * Math.PI) / 180);

  // Dynamic color interpolation
  const start = species.gradientStart || species.baseColor;
  const end = species.gradientEnd || species.baseColor;

  // Calculate interpolation factor (0.0 to 1.0)
  const t = Math.min(1, depth / (maxDepth || 10));

  const currentHue = start.hue + (end.hue - start.hue) * t + hueShift;
  const currentSaturation = start.saturation + (end.saturation - start.saturation) * t;
  const currentLightness = start.lightness + (end.lightness - start.lightness) * t;

  const strokeColor = `hsl(${currentHue}, ${currentSaturation}%, ${currentLightness}%)`;

  // Fix visuals: For very small branches (< 3px), force thin stroke to avoid "dot" look
  let strokeWidth = Math.max(1, (maxDepth - depth + 1) * 0.8 * zoom);
  if (length < 3) strokeWidth = Math.min(strokeWidth, 1);

  // STABLE KEY: Use the topological path (e.g. "root-0-1") instead of coordinates.
  // This ensures React re-uses the same Line component during zoom, preventing flickering.
  const branchKey = branchPath;

  const branches: JSX.Element[] = [
    <Line
      key={branchKey}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  ];

  // Add "foliage" / fluffiness at the tips (removed extra lines for performance, but logic kept if needed)
  /*
  if (depth >= maxDepth) {
      const leafColor = `hsl(${currentHue}, ${currentSaturation}%, ${Math.min(95, currentLightness + 10)}%)`;
      // ...
  }
  */

  // Species-specific branching
  const branchCount = species.branchCount;
  const avgAngle = (species.branchAngleRange[0] + species.branchAngleRange[1]) / 2;
  const newLen = length * species.branchLengthMultiplier;

  // STABLE SEED: Use a hash of the branchPath + depth.
  // This ensures the tree shape depends ONLY on its structure, not its screen position or zoom level.
  // Pseudo-random hash function for string
  let hash = 0;
  for (let i = 0; i < branchPath.length; i++) {
    hash = ((hash << 5) - hash) + branchPath.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const seed = Math.sin(hash); // Deterministic random -1 to 1

  const asymmetry = species.asymmetryFactor * seed * 20;

  // Generate branches based on branchCount
  // We append index to branchPath to strictly identify children
  if (branchCount === 2) {
    // Binary branching
    branches.push(...generateBranches(x2, y2, angle - avgAngle + asymmetry, newLen, depth + 1, maxDepth, species, hueShift, animValue, zoom, branchPath + "-0"));
    branches.push(...generateBranches(x2, y2, angle + avgAngle - asymmetry, newLen, depth + 1, maxDepth, species, hueShift, animValue, zoom, branchPath + "-1"));
  } else if (branchCount === 3) {
    // Ternary branching
    const asymmetry3 = species.asymmetryFactor * seed * 15;
    branches.push(...generateBranches(x2, y2, angle - avgAngle + asymmetry3, newLen, depth + 1, maxDepth, species, hueShift, animValue, zoom, branchPath + "-0"));
    branches.push(...generateBranches(x2, y2, angle + asymmetry3, newLen * 0.9, depth + 1, maxDepth, species, hueShift, animValue, zoom, branchPath + "-1")); // Center branch
    branches.push(...generateBranches(x2, y2, angle + avgAngle - asymmetry3, newLen, depth + 1, maxDepth, species, hueShift, animValue, zoom, branchPath + "-2"));
  } else if (branchCount === 4) {
    // Quaternary branching (baobab)
    const asymmetry4 = species.asymmetryFactor * seed * 25;
    branches.push(...generateBranches(x2, y2, angle - avgAngle * 1.2 + asymmetry4, newLen, depth + 1, maxDepth, species, hueShift, animValue, zoom, branchPath + "-0"));
    branches.push(...generateBranches(x2, y2, angle - avgAngle * 0.5 + asymmetry4, newLen * 0.85, depth + 1, maxDepth, species, hueShift, animValue, zoom, branchPath + "-1"));
    branches.push(...generateBranches(x2, y2, angle + avgAngle * 0.5 - asymmetry4, newLen * 0.85, depth + 1, maxDepth, species, hueShift, animValue, zoom, branchPath + "-2"));
    branches.push(...generateBranches(x2, y2, angle + avgAngle * 1.2 - asymmetry4, newLen, depth + 1, maxDepth, species, hueShift, animValue, zoom, branchPath + "-3"));
  }

  return branches;
};

export const Tree: React.FC = () => {
  const { state, tap, allSpecies } = useGame();
  // const allSpecies = getAllSpecies(); // REMOVED
  const currentSpecies = allSpecies.find(s => s.id === state.currentTreeId) || allSpecies[0];

  const growAnim = useRef(new Animated.Value(0)).current;
  // Scale transform REMOVED as per user request (pure growth only)
  /*
  const scale = growAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.015, 1]
  });
  */

  // Ripple effects on tap (3 circles)
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const ripple3 = useRef(new Animated.Value(0)).current;

  // Stats - use real height for visual growth
  const level = state.treeStats[currentSpecies.id]?.level || 1;
  const currentHeight = state.treeStats[currentSpecies.id]?.height || 50;

  // Complexity: Dynamic depth limit for performance (reduced for mobile FPS)
  const branchCount = currentSpecies.branchCount || 2;
  // FPS FIX: Reduced depth limits - binary:9, ternary:6, quaternary:5
  const depthLimit = branchCount >= 4 ? 5 : (branchCount === 3 ? 6 : 9);
  const maxDepth = Math.min(6 + Math.floor(level * 0.5) + currentSpecies.maxDepthBonus, depthLimit);

  // Size: More noticeable growth, scaled by Zoom
  // Adjusted baseline from 60 to 45 to prevent Level 8 trees from being "Giant" immediately
  const [zoom, setZoom] = React.useState(0.8); // Start slightly zoomed out to fit larger trees
  const baseLength = (45 + (level * 2.0) + Math.min(currentHeight * 0.12, 120)) * zoom;

  const handleTap = () => {
    tap();

    // 1. Subtle Breath/Pulse Animation REMOVED
    /*
    growAnim.setValue(0);
    Animated.timing(growAnim, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true
    }).start();
    */

    // 2. Only ripple animations
    ripple1.setValue(0);
    ripple2.setValue(0);
    ripple3.setValue(0);

    Animated.parallel([
      Animated.timing(ripple1, { toValue: 1, duration: 800, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(ripple2, { toValue: 1, duration: 1000, delay: 50, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(ripple3, { toValue: 1, duration: 1200, delay: 100, easing: Easing.out(Easing.ease), useNativeDriver: true })
    ]).start();
  };


  const BOTTOM_CONTROLS_HEIGHT = 236; // User specified position
  const centerX = width / 2;
  const startY = height - BOTTOM_CONTROLS_HEIGHT; // Always touch the line


  const { hue, saturation, lightness } = currentSpecies.baseColor;
  const glowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.4)`;
  const rippleColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 1)`;

  // Animated ripple scales and opacities
  const ripple1Scale = ripple1.interpolate({ inputRange: [0, 1], outputRange: [0.5, 2.5] });
  const ripple1Opacity = ripple1.interpolate({ inputRange: [0, 0.01, 0.5, 1], outputRange: [0, 0.6, 0.3, 0] });
  const ripple2Scale = ripple2.interpolate({ inputRange: [0, 1], outputRange: [0.5, 2.8] });
  const ripple2Opacity = ripple2.interpolate({ inputRange: [0, 0.01, 0.5, 1], outputRange: [0, 0.5, 0.25, 0] });
  const ripple3Scale = ripple3.interpolate({ inputRange: [0, 1], outputRange: [0.5, 3] });
  const ripple3Opacity = ripple3.interpolate({ inputRange: [0, 0.01, 0.5, 1], outputRange: [0, 0.4, 0.2, 0] });

  // Zoom handlers
  const handleZoomIn = (e: any) => {
    e.stopPropagation(); // Prevent tap on tree
    setZoom(prev => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = (e: any) => {
    e.stopPropagation();
    setZoom(prev => Math.max(prev - 0.1, 0.3));
  };

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={styles.container}>
        {/* Animated Container for the Tree pulse effect (Scale removed, just view) */}
        <Animated.View style={[styles.svgContainer /*, { transform: [{ scale }] } */]}>
          <Svg width={width} height={height}>
            <Defs>
              <RadialGradient id="glow" cx="50%" cy="50%">
                <Stop offset="0%" stopColor={glowColor} stopOpacity="0.8" />
                <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </RadialGradient>
            </Defs>

            {/* Glow at tree base */}
            <Circle cx={centerX} cy={startY} r={baseLength * 2} fill="url(#glow)" />

            {/* Tree branches */}
            <G>
              {generateBranches(centerX, startY, 0, baseLength, 0, maxDepth, currentSpecies, 0, growAnim, zoom, 'root')}
            </G>
          </Svg>
        </Animated.View>

        {/* Zoom Controls with SVG Icons */}
        <View style={styles.zoomControls}>
          <TouchableWithoutFeedback onPress={handleZoomIn}>
            <View style={[styles.zoomButton, { marginBottom: 10 }]}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <Circle cx="11" cy="11" r="8" />
                <Line x1="21" y1="21" x2="16.65" y2="16.65" />
                <Line x1="11" y1="8" x2="11" y2="14" />
                <Line x1="8" y1="11" x2="14" y2="11" />
              </Svg>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={handleZoomOut}>
            <View style={styles.zoomButton}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <Circle cx="11" cy="11" r="8" />
                <Line x1="21" y1="21" x2="16.65" y2="16.65" />
                <Line x1="8" y1="11" x2="14" y2="11" />
              </Svg>
            </View>
          </TouchableWithoutFeedback>
        </View>

        {/* Ripple effects overlay (Outside scaled view to stay consistent) */}
        <Animated.View style={[styles.ripple, { left: centerX - 50, top: startY - 50, opacity: ripple1Opacity, transform: [{ scale: ripple1Scale }] }]}>
          <View style={[styles.rippleCircle, { backgroundColor: rippleColor }]} />
        </Animated.View>

        <Animated.View style={[styles.ripple, { left: centerX - 50, top: startY - 50, opacity: ripple2Opacity, transform: [{ scale: ripple2Scale }] }]}>
          <View style={[styles.rippleCircle, { backgroundColor: rippleColor }]} />
        </Animated.View>

        <Animated.View style={[styles.ripple, { left: centerX - 50, top: startY - 50, opacity: ripple3Opacity, transform: [{ scale: ripple3Scale }] }]}>
          <View style={[styles.rippleCircle, { backgroundColor: rippleColor }]} />
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  ripple: {
    position: 'absolute',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 5,
  },
  rippleCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.3,
  },
  zoomControls: {
    position: 'absolute',
    right: 20,
    bottom: 250, // Just above the HUD area
    zIndex: 50,
    alignItems: 'center',
  },
  zoomButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)', // Glass effect
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
