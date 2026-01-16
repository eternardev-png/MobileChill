import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    StatusBar,
    Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Svg, { Line } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TreeBranchProps {
    x1: number;
    y1: number;
    angle: number;
    length: number;
    depth: number;
    maxDepth: number;
    branchAngle: number;
}

const FractalTree: React.FC = () => {
    const [branchAngle, setBranchAngle] = useState(25);
    const [recursionDepth, setRecursionDepth] = useState(8);
    const [baseLength, setBaseLength] = useState(100);

    // Generate tree branches recursively
    const generateBranches = (
        x1: number,
        y1: number,
        angle: number,
        length: number,
        depth: number
    ): JSX.Element[] => {
        if (depth > recursionDepth || length < 2) {
            return [];
        }

        // Calculate end point of current branch
        const x2 = x1 + length * Math.sin((angle * Math.PI) / 180);
        const y2 = y1 - length * Math.cos((angle * Math.PI) / 180);

        // Dynamic color based on depth (greens to browns)
        const hue = 120 - depth * 15; // From green to brown
        const saturation = 60 + depth * 5;
        const lightness = 40 - depth * 2;
        const strokeColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

        // Dynamic stroke width - thicker at base, thinner at tips
        const strokeWidth = Math.max(1, recursionDepth - depth + 1);

        const branches: JSX.Element[] = [
            <Line
                key={`branch-${x1}-${y1}-${angle}-${depth}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
            />,
        ];

        // Recursively generate left and right branches
        const newLength = length * 0.67;
        branches.push(
            ...generateBranches(x2, y2, angle - branchAngle, newLength, depth + 1)
        );
        branches.push(
            ...generateBranches(x2, y2, angle + branchAngle, newLength, depth + 1)
        );

        return branches;
    };

    const canvasHeight = SCREEN_HEIGHT * 0.65;
    const startX = SCREEN_WIDTH / 2;
    const startY = canvasHeight - 40;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>🌳 Fractal Tree</Text>
                <Text style={styles.subtitle}>Interactive Generative Art</Text>
            </View>

            {/* SVG Canvas */}
            <View style={styles.canvasContainer}>
                <Svg width={SCREEN_WIDTH} height={canvasHeight} style={styles.canvas}>
                    {generateBranches(startX, startY, 0, baseLength, 0)}
                </Svg>
            </View>

            {/* Debug Sliders */}
            <View style={styles.controlsContainer}>
                <Text style={styles.controlsTitle}>Debug Controls</Text>

                {/* Branch Angle Slider */}
                <View style={styles.sliderContainer}>
                    <View style={styles.sliderHeader}>
                        <Text style={styles.sliderLabel}>Branch Angle</Text>
                        <Text style={styles.sliderValue}>{branchAngle.toFixed(0)}°</Text>
                    </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={10}
                        maximumValue={45}
                        value={branchAngle}
                        onValueChange={setBranchAngle}
                        minimumTrackTintColor="#4ade80"
                        maximumTrackTintColor="#333"
                        thumbTintColor="#22c55e"
                    />
                </View>

                {/* Recursion Depth Slider */}
                <View style={styles.sliderContainer}>
                    <View style={styles.sliderHeader}>
                        <Text style={styles.sliderLabel}>Recursion Depth</Text>
                        <Text style={styles.sliderValue}>{Math.round(recursionDepth)}</Text>
                    </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={10}
                        step={1}
                        value={recursionDepth}
                        onValueChange={setRecursionDepth}
                        minimumTrackTintColor="#60a5fa"
                        maximumTrackTintColor="#333"
                        thumbTintColor="#3b82f6"
                    />
                </View>

                {/* Base Length Slider */}
                <View style={styles.sliderContainer}>
                    <View style={styles.sliderHeader}>
                        <Text style={styles.sliderLabel}>Base Length</Text>
                        <Text style={styles.sliderValue}>{baseLength.toFixed(0)}px</Text>
                    </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={40}
                        maximumValue={150}
                        value={baseLength}
                        onValueChange={setBaseLength}
                        minimumTrackTintColor="#f472b6"
                        maximumTrackTintColor="#333"
                        thumbTintColor="#ec4899"
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    header: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        backgroundColor: '#111',
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        fontWeight: '500',
    },
    canvasContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f0f0f',
    },
    canvas: {
        backgroundColor: '#0f0f0f',
    },
    controlsContainer: {
        backgroundColor: '#111',
        paddingHorizontal: 24,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#222',
    },
    controlsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
    },
    sliderContainer: {
        marginBottom: 20,
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sliderLabel: {
        fontSize: 15,
        color: '#bbb',
        fontWeight: '600',
    },
    sliderValue: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    slider: {
        width: '100%',
        height: 40,
    },
});

export default FractalTree;
