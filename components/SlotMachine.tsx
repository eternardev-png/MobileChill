import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import Svg, { Rect, G, Text as SvgText, Defs, LinearGradient, Stop, ClipPath } from 'react-native-svg';
import { useGame } from '../gameState';
import { GemIcon, CoinIcon, EnergyIcon, DiamondIcon } from './Icons';

const { width } = Dimensions.get('window');
const SLOT_WIDTH = Math.min(width * 0.25, 80);
const SLOT_HEIGHT = SLOT_WIDTH * 1.2;
const SYMBOL_SIZE = SLOT_WIDTH * 0.6;
const VISIBLE_ROWS = 3;

interface SlotMachineProps {
    onClose: () => void;
}

// Slot symbols with their properties
const SYMBOLS = [
    { id: 'coin', color: '#fbbf24', icon: 'coin', multiplier: 2 },
    { id: 'energy', color: '#3b82f6', icon: 'energy', multiplier: 3 },
    { id: 'gem', color: '#22c55e', icon: 'gem', multiplier: 5 },
    { id: 'diamond', color: '#a855f7', icon: 'diamond', multiplier: 10 },
    { id: 'seven', color: '#ef4444', icon: '7', multiplier: 25 },
];

// Weighted symbol distribution (more coins, fewer diamonds/sevens)
const SYMBOL_WEIGHTS = [
    { symbol: SYMBOLS[0], weight: 30 }, // coin - common
    { symbol: SYMBOLS[1], weight: 25 }, // energy - common
    { symbol: SYMBOLS[2], weight: 20 }, // gem - medium
    { symbol: SYMBOLS[3], weight: 15 }, // diamond - rare
    { symbol: SYMBOLS[4], weight: 10 }, // seven - very rare
];

const getRandomSymbol = () => {
    const totalWeight = SYMBOL_WEIGHTS.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const s of SYMBOL_WEIGHTS) {
        random -= s.weight;
        if (random <= 0) return s.symbol;
    }
    return SYMBOLS[0];
};

// Generate reel with extra symbols for smooth scrolling
const generateReel = (length: number = 20) => {
    return Array.from({ length }, () => getRandomSymbol());
};

export const SlotMachine: React.FC<SlotMachineProps> = ({ onClose }) => {
    const { state, spendGems, awardRoulettePrize } = useGame();

    // Animation values for 3 reels
    const reel1Anim = useRef(new Animated.Value(0)).current;
    const reel2Anim = useRef(new Animated.Value(0)).current;
    const reel3Anim = useRef(new Animated.Value(0)).current;

    const [spinning, setSpinning] = useState(false);
    const [reels, setReels] = useState([generateReel(), generateReel(), generateReel()]);
    const [result, setResult] = useState<{ symbols: typeof SYMBOLS[0][], win: number } | null>(null);

    const SPIN_COST = 3; // Gems cost per spin

    const handleSpin = () => {
        if (spinning) return;

        const success = spendGems(SPIN_COST);
        if (!success) return;

        setSpinning(true);
        setResult(null);

        // Generate new reels
        const newReels = [generateReel(), generateReel(), generateReel()];
        setReels(newReels);

        // Final symbols (middle row of each reel)
        const finalSymbols = [
            newReels[0][10],
            newReels[1][10],
            newReels[2][10],
        ];

        // Reset animations
        reel1Anim.setValue(0);
        reel2Anim.setValue(0);
        reel3Anim.setValue(0);

        // Staggered spin animations
        const spinDuration = 2000;
        const stagger = 300;

        Animated.sequence([
            Animated.parallel([
                Animated.timing(reel1Anim, {
                    toValue: 1,
                    duration: spinDuration,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(reel2Anim, {
                    toValue: 1,
                    duration: spinDuration + stagger,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(reel3Anim, {
                    toValue: 1,
                    duration: spinDuration + stagger * 2,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]),
        ]).start(() => {
            // Check for win
            const allSame = finalSymbols[0].id === finalSymbols[1].id && finalSymbols[1].id === finalSymbols[2].id;
            const twoSame = finalSymbols[0].id === finalSymbols[1].id ||
                finalSymbols[1].id === finalSymbols[2].id ||
                finalSymbols[0].id === finalSymbols[2].id;

            let winAmount = 0;
            if (allSame) {
                winAmount = finalSymbols[0].multiplier * 100;
            } else if (twoSame) {
                // Find matching pair
                const matchSymbol = finalSymbols[0].id === finalSymbols[1].id ? finalSymbols[0] :
                    finalSymbols[1].id === finalSymbols[2].id ? finalSymbols[1] : finalSymbols[0];
                winAmount = matchSymbol.multiplier * 20;
            }

            if (winAmount > 0) {
                awardRoulettePrize('coins', winAmount);
            }

            setResult({ symbols: finalSymbols, win: winAmount });
            setSpinning(false);
        });
    };

    const renderSymbol = (symbol: typeof SYMBOLS[0], size: number = SYMBOL_SIZE) => {
        if (symbol.icon === '7') {
            return (
                <View style={[styles.symbolContainer, { width: size, height: size }]}>
                    <Text style={[styles.sevenText, { fontSize: size * 0.7 }]}>7</Text>
                </View>
            );
        }

        return (
            <View style={[styles.symbolContainer, { width: size, height: size }]}>
                {symbol.icon === 'coin' && <CoinIcon size={size * 0.8} />}
                {symbol.icon === 'energy' && <EnergyIcon size={size * 0.8} />}
                {symbol.icon === 'gem' && <GemIcon size={size * 0.8} />}
                {symbol.icon === 'diamond' && <DiamondIcon size={size * 0.8} />}
            </View>
        );
    };

    const renderReel = (reelData: typeof SYMBOLS[0][], animValue: Animated.Value, index: number) => {
        const translateY = animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -SYMBOL_SIZE * 9], // Scroll distance
        });

        return (
            <View key={index} style={styles.reelContainer}>
                <View style={styles.reelMask}>
                    <Animated.View style={[styles.reelStrip, { transform: [{ translateY }] }]}>
                        {reelData.slice(0, 15).map((symbol, i) => (
                            <View key={i} style={styles.symbolWrapper}>
                                {renderSymbol(symbol)}
                            </View>
                        ))}
                    </Animated.View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                    <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>SLOTS</Text>
                </View>

                {/* Slot Machine Frame */}
                <View style={styles.machineFrame}>
                    {/* Win Line Indicator */}
                    <View style={styles.winLine} />

                    {/* Reels */}
                    <View style={styles.reelsContainer}>
                        {renderReel(reels[0], reel1Anim, 0)}
                        {renderReel(reels[1], reel2Anim, 1)}
                        {renderReel(reels[2], reel3Anim, 2)}
                    </View>
                </View>

                {/* Result Display */}
                {result && (
                    <View style={styles.resultContainer}>
                        {result.win > 0 ? (
                            <>
                                <Text style={styles.winText}>YOU WON!</Text>
                                <View style={styles.winAmount}>
                                    <CoinIcon size={28} />
                                    <Text style={styles.winValue}>{result.win}</Text>
                                </View>
                            </>
                        ) : (
                            <Text style={styles.loseText}>Try Again!</Text>
                        )}
                    </View>
                )}

                {/* Paytable */}
                <View style={styles.paytable}>
                    <Text style={styles.paytableTitle}>PAYOUTS</Text>
                    <View style={styles.paytableRow}>
                        <Text style={styles.paytableText}>3x Match = Symbol × 100</Text>
                    </View>
                    <View style={styles.paytableRow}>
                        <Text style={styles.paytableText}>2x Match = Symbol × 20</Text>
                    </View>
                </View>

                {/* Spin Button */}
                <TouchableOpacity
                    style={[styles.spinButton, state.gems < SPIN_COST && styles.spinButtonDisabled]}
                    onPress={handleSpin}
                    disabled={spinning || state.gems < SPIN_COST}
                >
                    <Text style={styles.spinButtonText}>SPIN</Text>
                    <View style={styles.costBadge}>
                        <Text style={styles.costText}>{SPIN_COST}</Text>
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
        maxWidth: 380,
        backgroundColor: '#1a1a1a',
        borderRadius: 32,
        padding: 24,
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
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#ef4444',
        letterSpacing: 4,
        textShadowColor: 'rgba(239, 68, 68, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    machineFrame: {
        backgroundColor: '#2a2a2a',
        borderRadius: 16,
        padding: 16,
        borderWidth: 4,
        borderColor: '#444',
        position: 'relative',
    },
    winLine: {
        position: 'absolute',
        left: 8,
        right: 8,
        top: '50%',
        height: 3,
        backgroundColor: '#ef4444',
        zIndex: 10,
        opacity: 0.6,
    },
    reelsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    reelContainer: {
        width: SLOT_WIDTH,
        height: SLOT_HEIGHT * VISIBLE_ROWS,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#111',
        borderWidth: 2,
        borderColor: '#555',
    },
    reelMask: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    reelStrip: {
        alignItems: 'center',
    },
    symbolWrapper: {
        width: SLOT_WIDTH,
        height: SYMBOL_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    symbolContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    sevenText: {
        fontWeight: '900',
        color: '#ef4444',
        textShadowColor: 'rgba(239, 68, 68, 0.8)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    resultContainer: {
        marginTop: 16,
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 12,
        width: '100%',
    },
    winText: {
        fontSize: 20,
        fontWeight: '900',
        color: '#4ade80',
        marginBottom: 8,
    },
    winAmount: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    winValue: {
        fontSize: 28,
        fontWeight: '900',
        color: '#fbbf24',
    },
    loseText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#888',
    },
    paytable: {
        marginTop: 16,
        alignItems: 'center',
        width: '100%',
    },
    paytableTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 8,
        letterSpacing: 2,
    },
    paytableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    paytableText: {
        fontSize: 11,
        color: '#888',
    },
    spinButton: {
        backgroundColor: '#ef4444',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 50,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 5,
        gap: 10,
    },
    spinButtonDisabled: {
        backgroundColor: '#555',
        shadowOpacity: 0,
    },
    spinButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: 2,
    },
    costBadge: {
        backgroundColor: '#064e3b',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#22c55e',
        gap: 4,
    },
    costText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});
