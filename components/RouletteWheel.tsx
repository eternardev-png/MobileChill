import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import Svg, { Path, G, Text as SvgText, Circle, Polygon, LinearGradient, RadialGradient, Stop, Defs, ClipPath, Rect } from 'react-native-svg';
import { useGame } from '../gameState';
import { GemIcon, EnergyIcon, CoinIcon, GrowthRateIcon, DiamondIcon } from './Icons'; // Updated import

const { width } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(width * 0.85, 300);
const RADIUS = WHEEL_SIZE / 2;
const CENTER = RADIUS;

interface RouletteWheelProps {
    onClose: () => void;
}

const PRIZES = [
    { id: 'coins_100', label: '100', value: 100, type: 'coins', color: 'rgba(251, 191, 36, 0.85)', chance: 15 },      // Yellow bright
    { id: 'energy_500', label: '500', value: 500, type: 'energy', color: 'rgba(59, 130, 246, 0.85)', chance: 15 },    // Blue bright
    { id: 'grow_15', label: '15', value: 15, type: 'grow_mult', color: 'rgba(74, 222, 128, 0.85)', chance: 5 },       // Green bright - no "x"
    { id: 'coins_500', label: '500', value: 500, type: 'coins', color: 'rgba(251, 191, 36, 0.85)', chance: 10 },      // Yellow bright
    { id: 'energy_1000', label: '1K', value: 1000, type: 'energy', color: 'rgba(59, 130, 246, 0.85)', chance: 10 },   // Blue bright
    { id: 'coins_1000', label: '1K', value: 1000, type: 'coins', color: 'rgba(251, 191, 36, 0.85)', chance: 8 },      // Yellow bright
    { id: 'energy_2000', label: '2K', value: 2000, type: 'energy', color: 'rgba(59, 130, 246, 0.85)', chance: 8 },    // Blue bright
    { id: 'shard', label: 'Shard', value: 1, type: 'shard', color: 'rgba(168, 85, 247, 0.85)', chance: 3 },           // Purple for shards
    { id: 'coins_2000', label: '2K', value: 2000, type: 'coins', color: 'rgba(251, 191, 36, 0.85)', chance: 5 },      // Yellow bright
    { id: 'grow_50', label: '50', value: 50, type: 'grow_mult', color: 'rgba(74, 222, 128, 0.85)', chance: 2 },       // Rare 50x - between 2K and 100 coins
];

const TOTAL_CHANCE = PRIZES.reduce((sum, p) => sum + p.chance, 0);

export const RouletteWheel: React.FC<RouletteWheelProps> = ({ onClose }) => {
    const { state, spendGems, awardRoulettePrize } = useGame();
    const spinAnim = useRef(new Animated.Value(0)).current;
    const finalAngleRef = useRef(0); // Track total rotation to prevent reset glitches
    const pulseAnim = useRef(new Animated.Value(0)).current;

    const [spinning, setSpinning] = useState(false);
    const [prize, setPrize] = useState<any>(null);

    const pendingPrizeRef = useRef<any>(null); // Track pending prize to award on finish/close

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

    // Safety: Award prize if user closes modal while spinning
    useEffect(() => {
        return () => {
            if (pendingPrizeRef.current) {
                awardRoulettePrize(pendingPrizeRef.current.type, pendingPrizeRef.current.value);
                pendingPrizeRef.current = null;
            }
        };
    }, [awardRoulettePrize]);

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
        // Store pending prize (Don't award yet, don't show UI yet)
        pendingPrizeRef.current = wonPrize;

        // Calculate segment center based on chance-proportional angles
        const cumulativeBefore = PRIZES.slice(0, selectedIndex).reduce((sum, prize) => sum + prize.chance, 0);
        const sliceAngle = (wonPrize.chance / TOTAL_CHANCE) * 360;
        const segmentCenter = ((cumulativeBefore / TOTAL_CHANCE) * 360) + (sliceAngle / 2);

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
            // Animation finished -> Award prize
            if (pendingPrizeRef.current) {
                awardRoulettePrize(pendingPrizeRef.current.type, pendingPrizeRef.current.value);
                setPrize(pendingPrizeRef.current); // Show "YOU WON"
                pendingPrizeRef.current = null; // Clear pending
            }
        });
    };

    // Handle close: Award pending prize if spinning, then close
    const handleClose = () => {
        if (pendingPrizeRef.current) {
            awardRoulettePrize(pendingPrizeRef.current.type, pendingPrizeRef.current.value);
            pendingPrizeRef.current = null;
        }
        onClose();
    };

    // getIcon removed as we now render standard components

    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
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

                                {/* ICON GLOW (Dark Shadow/Glow) */}
                                <RadialGradient id="grad_icon_glow" cx="50%" cy="50%" r="50%">
                                    <Stop offset="0%" stopColor="#000" stopOpacity="0.8" />
                                    <Stop offset="100%" stopColor="#000" stopOpacity="0" />
                                </RadialGradient>
                            </Defs>

                            {/* Background Circle (Dark fill behind segments) */}
                            <Circle cx={CENTER} cy={CENTER} r={RADIUS} fill="#1a1a1a" />

                            {/* Segments Group with ClipPath for perfect circle */}
                            <G rotation={0} origin={`${CENTER}, ${CENTER} `} clipPath="url(#wheelClip)">
                                {PRIZES.map((p, i) => {
                                    // Calculate cumulative angles based on chance
                                    const cumulativeBefore = PRIZES.slice(0, i).reduce((sum, prize) => sum + prize.chance, 0);
                                    const startAngle = (cumulativeBefore / TOTAL_CHANCE) * 360;
                                    const sliceAngle = (p.chance / TOTAL_CHANCE) * 360;
                                    const endAngle = startAngle + sliceAngle;

                                    // Oversize segments slightly to ensure no gaps, clipped by ClipPath
                                    const x1 = CENTER + (RADIUS + 2) * Math.cos(Math.PI * startAngle / 180);
                                    const y1 = CENTER + (RADIUS + 2) * Math.sin(Math.PI * startAngle / 180);
                                    const x2 = CENTER + (RADIUS + 2) * Math.cos(Math.PI * endAngle / 180);
                                    const y2 = CENTER + (RADIUS + 2) * Math.sin(Math.PI * endAngle / 180);
                                    const largeArc = sliceAngle > 180 ? 1 : 0;

                                    const midAngle = startAngle + sliceAngle / 2;
                                    // Adjusted distances - Moved EVEN FURTHER OUT
                                    const iconDist = RADIUS * 0.82;
                                    const textDist = RADIUS * 0.60;

                                    const iconX = CENTER + iconDist * Math.cos(Math.PI * midAngle / 180);
                                    const iconY = CENTER + iconDist * Math.sin(Math.PI * midAngle / 180);

                                    const textX = CENTER + textDist * Math.cos(Math.PI * midAngle / 180);
                                    const textY = CENTER + textDist * Math.sin(Math.PI * midAngle / 180);

                                    // Fix rotation: Use midAngle for Radial alignment (reading outwards)
                                    const rotation = midAngle;

                                    // Transform for Icon (Center at iconX, iconY)
                                    const iconSize = 22;
                                    const iconOffset = iconSize / 2;

                                    // Determine icon color based on type - match GameHUD colors
                                    let iconColor = '#fff';
                                    if (p.type === 'coins') iconColor = '#fbbf24';      // Yellow/Gold for coins (same as GameHUD)
                                    if (p.type === 'energy') iconColor = '#facc15';     // Yellow for energy (same as GameHUD)
                                    if (p.type === 'grow_mult') iconColor = '#4ade80';  // Green for growth
                                    if (p.type === 'shard') iconColor = '#a855f7';      // Purple for shards

                                    return (
                                        <G key={i}>

                                            <Path
                                                d={`M${CENTER},${CENTER} L${x1},${y1} A${RADIUS + 2},${RADIUS + 2} 0 ${largeArc}, 1 ${x2},${y2} Z`}
                                                fill={p.color}
                                                stroke="rgba(0,0,0,0.3)"
                                                strokeWidth="2"
                                            />

                                            {/* Render Icon Component inside G with Transform */}
                                            {/* Note: In nested SVG, transform order matters. Translate to pos, then rotate. */}
                                            <G transform={`translate(${iconX - iconOffset}, ${iconY - iconOffset}) rotate(${rotation}, ${iconOffset}, ${iconOffset})`}>
                                                {/* Dark Glow behind icons */}
                                                <Circle cx={iconOffset} cy={iconOffset} r={iconSize * 0.8} fill="url(#grad_icon_glow)" />

                                                {p.type === 'coins' && <CoinIcon size={iconSize} />}
                                                {p.type === 'energy' && <EnergyIcon size={iconSize} />}
                                                {p.type === 'grow_mult' && <GemIcon size={iconSize} />}
                                                {p.type === 'shard' && <DiamondIcon size={iconSize} />}
                                            </G>

                                            {/* Dark background for text - Glow/Shadow (Rectangular) */}
                                            {(() => {
                                                const isLong = p.label.length > 3;
                                                const fSize = isLong ? 14 : 18;
                                                const bgW = p.label.length * (fSize * 0.6) + 20;
                                                const bgH = fSize + 12;
                                                return (
                                                    <Rect
                                                        x={textX - bgW / 2}
                                                        y={textY - bgH / 2}
                                                        width={bgW}
                                                        height={bgH}
                                                        rx={bgH / 2}
                                                        fill="url(#grad_icon_glow)"
                                                        transform={`rotate(${rotation}, ${textX}, ${textY})`}
                                                    />
                                                );
                                            })()}

                                            {/* Text - Radial Alignment with heavy shadow/glow look */}
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
                                                stroke="rgba(0,0,0,0.8)"
                                                strokeWidth="3" // Heavy stroke acting as glow/outline
                                            >
                                                {p.label}
                                            </SvgText>
                                            {/* Foreground text for sharpness */}
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
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            {prize.type === 'coins' && <CoinIcon size={32} />}
                            {prize.type === 'energy' && <EnergyIcon size={32} />}
                            {prize.type === 'grow_mult' && <GemIcon size={32} />}
                            {prize.type === 'shard' && <DiamondIcon size={32} />}
                            <Text style={[styles.prizeText, { marginTop: 0 }]}>
                                {prize.label}
                            </Text>
                        </View>
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
