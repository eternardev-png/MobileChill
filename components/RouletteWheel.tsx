import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import Svg, { Path, G, Text as SvgText, Circle, Polygon, LinearGradient, RadialGradient, Stop, Defs, ClipPath } from 'react-native-svg';
import { useGame } from '../gameState';
import { GemIcon, EnergyIcon, CoinIcon } from './Icons'; // Updated import

const { width } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(width * 0.85, 300);
const RADIUS = WHEEL_SIZE / 2;
const CENTER = RADIUS;

interface RouletteWheelProps {
    onClose: () => void;
}

const PRIZES = [
    { id: 'coins_100', label: '100', value: 100, type: 'coins', color: 'url(#grad_coins)', chance: 15 },
    { id: 'energy_500', label: '500', value: 500, type: 'energy', color: 'url(#grad_energy)', chance: 15 },
    { id: 'grow_15', label: '15', value: 15, type: 'grow_mult', color: 'url(#grad_green)', chance: 5 },
    { id: 'coins_500', label: '500', value: 500, type: 'coins', color: 'url(#grad_coins_dark)', chance: 10 },
    { id: 'energy_1000', label: '1K', value: 1000, type: 'energy', color: 'url(#grad_energy_dark)', chance: 10 },
    { id: 'coins_1000', label: '1K', value: 1000, type: 'coins', color: 'url(#grad_coins)', chance: 8 },
    { id: 'energy_2000', label: '2K', value: 2000, type: 'energy', color: 'url(#grad_energy)', chance: 8 },
    { id: 'diamond', label: 'Shard', value: 1, type: 'shard', color: 'url(#grad_purple)', chance: 3 },
    { id: 'coins_2000', label: '2K', value: 2000, type: 'coins', color: 'url(#grad_gold_premium)', chance: 5 },
];

const SLICE_ANGLE = 360 / PRIZES.length;

export const RouletteWheel: React.FC<RouletteWheelProps> = ({ onClose }) => {
    const { state, spendGems, awardRoulettePrize } = useGame();
    const spinAnim = useRef(new Animated.Value(0)).current;
    const finalAngleRef = useRef(0); // Track total rotation to prevent reset glitches
    const pulseAnim = useRef(new Animated.Value(0)).current;

    const [spinning, setSpinning] = useState(false);
    const [prize, setPrize] = useState<any>(null);

    // Start/Stop pulse animation based on spinning state
    useEffect(() => {
        if (spinning) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1, duration: 400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 0, duration: 400, easing: Easing.in(Easing.ease), useNativeDriver: true })
                ])
            ).start();
        } else {
            pulseAnim.setValue(0);
        }
    }, [spinning]);

    const handleSpin = () => {
        if (spinning) return;

        // Attempt to spend cost immediately
        const success = spendGems(5);
        if (!success) return; // Not enough currency

        setSpinning(true);
        setPrize(null);

        const totalChance = PRIZES.reduce((sum, p) => sum + p.chance, 0);
        let random = Math.random() * totalChance;
        let selectedIndex = 0;
        for (let i = 0; i < PRIZES.length; i++) {
            random -= PRIZES[i].chance;
            if (random <= 0) {
                selectedIndex = i;
                break;
            }
        }

        const wonPrize = PRIZES[selectedIndex];
        // Determinate prize early
        setPrize(wonPrize);

        // Award prize immediately so closing the component doesn't cancel it
        awardRoulettePrize(wonPrize.type, wonPrize.value);

        const segmentCenter = selectedIndex * SLICE_ANGLE + SLICE_ANGLE / 2;

        // CUMULATIVE ROTATION LOGIC to fix re-spin bug
        const baseTarget = 270 - segmentCenter;

        // Get current rotation modulo 360
        const currentAngle = finalAngleRef.current;
        const currentMod = currentAngle % 360;

        // Calculate diff needed to reach target, ensuring we always go forward
        let diff = baseTarget - currentMod;
        if (diff < 0) {
            diff += 360;
        }

        // Add minimum spins (5 full rotations) + precision alignment
        const spinByType = 360 * 5 + diff + (Math.random() * 8 - 4); // +/- 4 deg jitter

        const finalAngle = currentAngle + spinByType;
        finalAngleRef.current = finalAngle;

        Animated.timing(spinAnim, {
            toValue: finalAngle,
            duration: 4000,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start(() => {
            setSpinning(false);
            // Visual feedback already handled by determinePrize
        });
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'coins': return '🪙';
            case 'energy': return '⚡';
            case 'grow_mult': return '🌿';
            case 'shard': return '💎';
            default: return '🎁';
        }
    };

    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                    <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>FORTUNE WHEEL</Text>
                </View>

                <View style={styles.wheelContainer}>
                    {/* SVG POINTER - Fixed at top center */}
                    <View style={styles.pointerContainer}>
                        <Svg width="40" height="40" viewBox="0 0 40 40" style={{ marginTop: 5 }}>
                            <Defs>
                                <LinearGradient id="grad_pointer" x1="0" y1="0" x2="0" y2="1">
                                    <Stop offset="0" stopColor="#fff" />
                                    <Stop offset="1" stopColor="#ccc" />
                                </LinearGradient>
                            </Defs>
                            {/* Shadow */}
                            <Path d="M10,0 L30,0 L20,30 Z" fill="rgba(0,0,0,0.5)" transform="translate(0, 4)" />
                            {/* Arrow */}
                            <Path d="M10,0 L30,0 L20,30 Z" fill="url(#grad_pointer)" stroke="#999" strokeWidth="1" />
                        </Svg>
                    </View>

                    {/* PULSING GLOW BEHIND WHEEL */}
                    <Animated.View style={[
                        styles.wheelGlow,
                        {
                            opacity: pulseAnim,
                            transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1.0, 1.35] }) }]
                        }
                    ]}>
                        <Svg width={WHEEL_SIZE * 1.5} height={WHEEL_SIZE * 1.5}>
                            <Defs>
                                <RadialGradient id="glow_pulse" cx="50%" cy="50%" r="50%">
                                    <Stop offset="40%" stopColor="#fbbf24" stopOpacity="1.0" />
                                    <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
                                </RadialGradient>
                            </Defs>
                            {/* Draw glow slightly larger */}
                            <Circle cx={(WHEEL_SIZE * 1.5) / 2} cy={(WHEEL_SIZE * 1.5) / 2} r={(WHEEL_SIZE * 1.4) / 2} fill="url(#glow_pulse)" />
                        </Svg>
                    </Animated.View>

                    <Animated.View style={[styles.wheel, {
                        transform: [{
                            rotate: spinAnim.interpolate({
                                inputRange: [0, 360],
                                outputRange: ['0deg', '360deg']
                            })
                        }]
                    }]}>
                        <Svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE} `}>
                            <Defs>
                                <ClipPath id="wheelClip">
                                    <Circle cx={CENTER} cy={CENTER} r={RADIUS} />
                                </ClipPath>

                                {/* COINS (Orange/Gold) */}
                                <LinearGradient id="grad_coins" x1="0" y1="0" x2="1" y2="1">
                                    <Stop offset="0%" stopColor="#f59e0b" />
                                    <Stop offset="100%" stopColor="#d97706" />
                                </LinearGradient>
                                <LinearGradient id="grad_coins_dark" x1="0" y1="0" x2="1" y2="1">
                                    <Stop offset="0%" stopColor="#b45309" />
                                    <Stop offset="100%" stopColor="#78350f" />
                                </LinearGradient>
                                <LinearGradient id="grad_gold_premium" x1="0" y1="0" x2="1" y2="1">
                                    <Stop offset="0%" stopColor="#fbbf24" />
                                    <Stop offset="50%" stopColor="#f59e0b" />
                                    <Stop offset="100%" stopColor="#b45309" />
                                </LinearGradient>

                                {/* ENERGY (Blue) */}
                                <LinearGradient id="grad_energy" x1="0" y1="0" x2="1" y2="1">
                                    <Stop offset="0%" stopColor="#3b82f6" />
                                    <Stop offset="100%" stopColor="#1d4ed8" />
                                </LinearGradient>
                                <LinearGradient id="grad_energy_dark" x1="0" y1="0" x2="1" y2="1">
                                    <Stop offset="0%" stopColor="#1e40af" />
                                    <Stop offset="100%" stopColor="#172554" />
                                </LinearGradient>

                                {/* GREEN (Growth) */}
                                <LinearGradient id="grad_green" x1="0" y1="0" x2="1" y2="1">
                                    <Stop offset="0%" stopColor="#4ade80" />
                                    <Stop offset="100%" stopColor="#16a34a" />
                                </LinearGradient>

                                {/* PURPLE (Shard) */}
                                <LinearGradient id="grad_purple" x1="0" y1="0" x2="1" y2="1">
                                    <Stop offset="0%" stopColor="#c084fc" />
                                    <Stop offset="100%" stopColor="#7e22ce" />
                                </LinearGradient>

                                {/* KNOB */}
                                <RadialGradient id="grad_knob" cx="50%" cy="50%" r="50%">
                                    <Stop offset="0%" stopColor="#fbbf24" />
                                    <Stop offset="80%" stopColor="#d97706" />
                                    <Stop offset="100%" stopColor="#b45309" />
                                </RadialGradient>

                                {/* PULSE GLOW GRADIENT */}
                                <RadialGradient id="grad_glow" cx="50%" cy="50%" r="50%">
                                    <Stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                                    <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
                                </RadialGradient>
                            </Defs>

                            {/* Background Circle (Dark fill behind segments) */}
                            <Circle cx={CENTER} cy={CENTER} r={RADIUS} fill="#1a1a1a" />

                            {/* Segments Group with ClipPath for perfect circle */}
                            <G rotation={0} origin={`${CENTER}, ${CENTER} `} clipPath="url(#wheelClip)">
                                {PRIZES.map((p, i) => {
                                    const startAngle = i * SLICE_ANGLE;
                                    const endAngle = (i + 1) * SLICE_ANGLE;
                                    // Oversize segments slightly to ensure no gaps, clipped by ClipPath
                                    const x1 = CENTER + (RADIUS + 2) * Math.cos(Math.PI * startAngle / 180);
                                    const y1 = CENTER + (RADIUS + 2) * Math.sin(Math.PI * startAngle / 180);
                                    const x2 = CENTER + (RADIUS + 2) * Math.cos(Math.PI * endAngle / 180);
                                    const y2 = CENTER + (RADIUS + 2) * Math.sin(Math.PI * endAngle / 180);
                                    const largeArc = SLICE_ANGLE > 180 ? 1 : 0;

                                    const midAngle = startAngle + SLICE_ANGLE / 2;
                                    // Adjusted distances - Moved EVEN FURTHER OUT
                                    const iconDist = RADIUS * 0.82;
                                    const textDist = RADIUS * 0.60;

                                    const iconX = CENTER + iconDist * Math.cos(Math.PI * midAngle / 180);
                                    const iconY = CENTER + iconDist * Math.sin(Math.PI * midAngle / 180);

                                    const textX = CENTER + textDist * Math.cos(Math.PI * midAngle / 180);
                                    const textY = CENTER + textDist * Math.sin(Math.PI * midAngle / 180);

                                    // Fix rotation: Use midAngle for Radial alignment (reading outwards)
                                    // p.s. midAngle + 90 was making it tangential/perpendicular
                                    const rotation = midAngle;
                                    // For left side, maybe flip? Let's stick to consistent radiating out for now.

                                    return (
                                        <G key={i}>
                                            <Path
                                                d={`M${CENTER},${CENTER} L${x1},${y1} A${RADIUS + 2},${RADIUS + 2} 0 ${largeArc}, 1 ${x2},${y2} Z`}
                                                fill={p.color}
                                                stroke="rgba(0,0,0,0.1)"
                                                strokeWidth="0.5"
                                            />

                                            {/* Icon - Added Stroke for visibility (White Outline) */}
                                            <SvgText
                                                x={iconX}
                                                y={iconY}
                                                fontSize="22"
                                                stroke="#fff"
                                                strokeWidth="2"
                                                fill="#fff"
                                                textAnchor="middle"
                                                alignmentBaseline="central"
                                                transform={`rotate(${rotation}, ${iconX}, ${iconY})`}
                                            >
                                                {getIcon(p.type)}
                                            </SvgText>
                                            {/* Icon Content Layer (on top of stroke) */}
                                            <SvgText
                                                x={iconX}
                                                y={iconY}
                                                fontSize="22"
                                                textAnchor="middle"
                                                alignmentBaseline="central"
                                                transform={`rotate(${rotation}, ${iconX}, ${iconY})`}
                                            >
                                                {getIcon(p.type)}
                                            </SvgText>

                                            {/* Text - Radial Alignment */}
                                            <SvgText
                                                x={textX}
                                                y={textY}
                                                fill="#fff"
                                                fontSize={p.label.length > 3 ? "14" : "18"}
                                                fontWeight="900"
                                                textAnchor="middle"
                                                alignmentBaseline="central"
                                                transform={`rotate(${rotation}, ${textX}, ${textY})`}
                                                letterSpacing="1"
                                                stroke="rgba(0,0,0,0.3)"
                                                strokeWidth="0.5" // Reduced stroke for cleaner look
                                            >
                                                {p.label}
                                            </SvgText>
                                        </G>
                                    );
                                })}
                            </G>

                            {/* Outer Border REMOVED as requested */}
                            {/* <Circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="#4b5563" strokeWidth="8" /> */}

                            {/* Center Knob */}
                            <Circle cx={CENTER} cy={CENTER} r={28} fill="url(#grad_knob)" stroke="#78350f" strokeWidth="2" />
                            <Circle cx={CENTER} cy={CENTER} r={20} fill="#f59e0b" opacity="0.5" />
                        </Svg>
                    </Animated.View>
                </View>

                {prize && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultLabel}>YOU WON</Text>
                        <Text style={[styles.prizeText]}>
                            {getIcon(prize.type)} {prize.label}
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.spinButton, state.gems < 5 && styles.spinButtonDisabled]}
                    onPress={handleSpin}
                    disabled={spinning || state.gems < 5}
                >
                    <Text style={styles.spinButtonText}>SPIN</Text>
                    <View style={styles.costBadge}>
                        <Text style={styles.costText}>5</Text>
                        <GemIcon size={16} color="#fff" />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    container: {
        width: '95%',
        maxWidth: 420,  // Increased from 380 -> 420 (Larger Menu)
        backgroundColor: '#1a1a1a',
        borderRadius: 32,
        padding: 32,    // Increased padding from 24 -> 32
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    closeBtn: {
        position: 'absolute',
        top: 10,
        right: 15,
        padding: 5,
        zIndex: 10,
    },
    closeBtnText: {
        color: '#666',
        fontSize: 24,
        fontWeight: 'bold',
    },
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: '900',
        color: '#fbbf24',
        letterSpacing: 3,
        textShadowColor: 'rgba(251, 191, 36, 0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    wheelContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        position: 'relative',
        paddingTop: 10,
        // Removed fixed width/height here to let SVG determine size naturally
        // aspectRatio: 1, // Not needed if SVG defines intrinsic size
    },
    pointerContainer: {
        position: 'absolute',
        top: -15,
        zIndex: 20,
        elevation: 10,
        // Center pointer horizontally based on WHEEL_SIZE
        left: (WHEEL_SIZE) / 2 - 20,
    },
    pointer: {
        display: 'none', // Hidden, replaced by SVG
    },
    wheelGlow: {
        position: 'absolute',
        width: WHEEL_SIZE * 1.4, // Wider glow
        height: WHEEL_SIZE * 1.4,
        top: -(WHEEL_SIZE * 0.2) + 10,
        left: -(WHEEL_SIZE * 0.2) + 10,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: -1, // Behind wheel
    },
    wheel: {
        width: WHEEL_SIZE,
        height: WHEEL_SIZE,
        aspectRatio: 1, // FORCE SQUARE
    },
    resultContainer: {
        marginBottom: 16,
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 15,
        borderRadius: 16,
        width: '100%',
    },
    resultLabel: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 4,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    prizeText: {
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
        marginTop: 5,
    },
    spinButton: {
        backgroundColor: '#f59e0b',
        paddingVertical: 12, // Reduced padding to fit rows
        paddingHorizontal: 32,
        borderRadius: 50,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row', // Horizontal layout
        justifyContent: 'center',
        shadowColor: '#f59e0b',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 5,
        gap: 10, // Spacing between Text and Badge
    },
    spinButtonDisabled: {
        backgroundColor: '#555',
        shadowOpacity: 0,
    },
    spinButtonText: {
        color: '#000',
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: 2,
    },
    costBadge: {
        backgroundColor: '#064e3b', // Dark Green
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#22c55e', // Light green border
    },
    costText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff', // White text for contrast
    },
});
