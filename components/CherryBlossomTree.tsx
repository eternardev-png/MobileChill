import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Line, G, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { TREE_SPECIES } from '../data/treeSpecies';

// Simplified version of tree generation for welcome screen
const generateBranches = (
    x1: number,
    y1: number,
    angle: number,
    length: number,
    depth: number,
    maxDepth: number,
    branchPath: string = "root"
): JSX.Element[] => {
    if (depth > maxDepth || length < 1.5) return [];

    const cherrySpecies = TREE_SPECIES.cherry;

    const x2 = x1 + length * Math.sin((angle * Math.PI) / 180);
    const y2 = y1 - length * Math.cos((angle * Math.PI) / 180);

    // Pink gradient interpolation
    const start = cherrySpecies.gradientStart!;
    const end = cherrySpecies.gradientEnd!;
    const t = Math.min(1, depth / (maxDepth || 10));

    const currentHue = start.hue + (end.hue - start.hue) * t;
    const currentSaturation = (start.saturation + (end.saturation - start.saturation) * t) * 0.7; // Reduced by 30%
    const currentLightness = start.lightness + (end.lightness - start.lightness) * t + 10; // Lighter

    const strokeColor = `hsl(${currentHue}, ${currentSaturation}%, ${currentLightness}%)`;

    let strokeWidth = Math.max(1, (maxDepth - depth + 1) * 0.8);
    if (length < 3) strokeWidth = Math.min(strokeWidth, 1);

    const branches: JSX.Element[] = [
        <Line
            key={branchPath}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
        />
    ];

    const branchCount = cherrySpecies.branchCount;
    const avgAngle = (cherrySpecies.branchAngleRange[0] + cherrySpecies.branchAngleRange[1]) / 2;
    const newLen = length * cherrySpecies.branchLengthMultiplier;

    // Stable seed from path
    let hash = 0;
    for (let i = 0; i < branchPath.length; i++) {
        hash = ((hash << 5) - hash) + branchPath.charCodeAt(i);
        hash |= 0;
    }
    const seed = Math.sin(hash);
    const asymmetry = cherrySpecies.asymmetryFactor * seed * 20;

    // Ternary branching (cherry has 3 branches)
    const asymmetry3 = cherrySpecies.asymmetryFactor * seed * 15;
    branches.push(...generateBranches(x2, y2, angle - avgAngle + asymmetry3, newLen, depth + 1, maxDepth, branchPath + "-0"));
    branches.push(...generateBranches(x2, y2, angle + asymmetry3, newLen * 0.9, depth + 1, maxDepth, branchPath + "-1"));
    branches.push(...generateBranches(x2, y2, angle + avgAngle - asymmetry3, newLen, depth + 1, maxDepth, branchPath + "-2"));

    return branches;
};

export const CherryBlossomTree = () => {
    const cherrySpecies = TREE_SPECIES.cherry;

    // Level 6 tree settings
    const level = 6;
    const maxDepth = 7 + Math.floor(level * 0.8) + cherrySpecies.maxDepthBonus;
    const baseLength = 110;

    const centerX = 200;
    const startY = 395; // Bottom of SVG - this will be at top of titleBox

    const { hue, saturation, lightness } = cherrySpecies.baseColor;
    const glowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`;

    return (
        <View style={styles.container}>
            <Svg width="400" height="400" viewBox="0 0 400 400">
                <Defs>
                    <RadialGradient id="pinkGlow" cx="50%" cy="60%">
                        <Stop offset="0%" stopColor="#ff69b4" stopOpacity="0.25" />
                        <Stop offset="50%" stopColor="#ff69b4" stopOpacity="0.1" />
                        <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </RadialGradient>
                </Defs>

                {/* Pink glow from tree center */}
                <Circle cx={centerX} cy={200} r={200} fill="url(#pinkGlow)" />

                {/* Tree branches */}
                <G>
                    {generateBranches(centerX, startY, 0, baseLength, 0, maxDepth, 'root')}
                </G>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-end', // Align to bottom
        height: 400,
    },
});
