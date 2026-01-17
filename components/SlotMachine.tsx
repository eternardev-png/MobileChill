import { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import Svg, { Rect, G, Text as SvgText, Defs, LinearGradient, Stop, ClipPath, Circle, RadialGradient } from 'react-native-svg';
import { useGame } from '../gameState';
import { GemIcon, CoinIcon, EnergyIcon, DiamondIcon, CasinoIcon } from './Icons';

const { width } = Dimensions.get('window');
const SLOT_WIDTH = Math.min(width * 0.25, 80);
const SLOT_HEIGHT = SLOT_WIDTH; // Make slots square or match intended aspect ratio
const SYMBOL_SIZE = SLOT_HEIGHT; // Ensure symbol wrapper matches slot height exactly
const VISIBLE_ROWS = 5;

interface SlotMachineProps {
    onClose: () => void;
}

// Slot symbols with their properties
const SYMBOLS = [
    { id: 'coin', color: '#fbbf24', icon: 'coin', multiplier: 1 },
    { id: 'energy', color: '#3b82f6', icon: 'energy', multiplier: 1 },
    { id: 'gem', color: '#22c55e', icon: 'gem', multiplier: 1 }, // Kept for logic, multiplier unused for fixed rewards
    { id: 'diamond', color: '#a855f7', icon: 'diamond', multiplier: 1 },
    { id: 'seven', color: '#ef4444', icon: '7', multiplier: 1 },
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
const generateReel = (length: number = 50) => {
    return Array.from({ length }, () => getRandomSymbol());
};

export const SlotMachine: React.FC<SlotMachineProps> = ({ onClose }) => {
    const { state, spendGems, awardRoulettePrize } = useGame();

    // Animation values for 3 reels
    const reel1Anim = useRef(new Animated.Value(0)).current;
    const reel2Anim = useRef(new Animated.Value(0)).current;
    const reel3Anim = useRef(new Animated.Value(0)).current;

    // Animation for red lights
    const lightsAnim = useRef(new Animated.Value(0)).current;

    const [spinning, setSpinning] = useState(false);
    const [reels, setReels] = useState([generateReel(), generateReel(), generateReel()]);
    const [result, setResult] = useState<{ symbols: typeof SYMBOLS[0][], win: number, winType: 'coins' | 'energy' | 'gems' | 'shard' } | null>(null);

    // Pulse lights when spinning
    useEffect(() => {
        if (spinning) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(lightsAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
                    Animated.timing(lightsAnim, { toValue: 0, duration: 300, useNativeDriver: true })
                ])
            ).start();
        } else {
            lightsAnim.setValue(0);
        }
    }, [spinning]);

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

        // Final symbols (middle row of each reel) - TARGET INDEX 30
        const finalSymbols = [
            newReels[0][30],
            newReels[1][30],
            newReels[2][30],
        ];

        // Reset animations
        reel1Anim.setValue(0);
        reel2Anim.setValue(0);
        reel3Anim.setValue(0);

        // Staggered spin animations - LONGER & STRONGER
        const spinDuration = 3500; // Increased duration
        const stagger = 300;

        Animated.sequence([
            Animated.parallel([
                Animated.timing(reel1Anim, {
                    toValue: 1,
                    duration: spinDuration,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Strong ease-out
                    useNativeDriver: true,
                }),
                Animated.timing(reel2Anim, {
                    toValue: 1,
                    duration: spinDuration + stagger,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                    useNativeDriver: true,
                }),
                Animated.timing(reel3Anim, {
                    toValue: 1,
                    duration: spinDuration + stagger * 2,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
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
            let winType: 'coins' | 'energy' | 'gems' | 'shard' = 'coins';

            // Determine winning symbol for type
            let matchSymbol = finalSymbols[0];
            if (twoSame && !allSame) {
                matchSymbol = finalSymbols[0].id === finalSymbols[1].id ? finalSymbols[0] :
                    finalSymbols[1].id === finalSymbols[2].id ? finalSymbols[1] : finalSymbols[0];
            }

            // Map symbol to reward type & logic
            if (matchSymbol.id === 'coin') winType = 'coins';
            else if (matchSymbol.id === 'energy') winType = 'energy';
            else if (matchSymbol.id === 'gem') winType = 'gems';
            else if (matchSymbol.id === 'diamond') winType = 'shard';
            else if (matchSymbol.id === 'seven') winType = 'gems'; // Updated: Seven awards Gems

            if (allSame) {
                if (matchSymbol.id === 'coin') winAmount = 120;
                else if (matchSymbol.id === 'energy') winAmount = 2500;
                else if (matchSymbol.id === 'seven') winAmount = 100; // Jackpot Gems
                else if (matchSymbol.id === 'diamond') winAmount = 3; // Shards
                else if (matchSymbol.id === 'gem') winAmount = 25; // 5x5 Gems
            } else if (twoSame) {
                if (matchSymbol.id === 'coin') winAmount = 75;
                else if (matchSymbol.id === 'energy') winAmount = 1000;
                else if (matchSymbol.id === 'seven') winAmount = 50; // Gems
                else if (matchSymbol.id === 'diamond') winAmount = 1; // Shard
                else if (matchSymbol.id === 'gem') winAmount = 10; // 5x2 Gems
            }

            if (winAmount > 0) {
                // Map to awardRoulettePrize types
                // Note regarding 'gems': The original code mapped 'gem' to 'grow_mult'. 
                // We should probably check if the user intended 'gems' (premium currency) or 'grow' (seeds).
                // Given the context of 'Seven' becoming a jackpot, 'gems' (premium) is the most likely intent.
                // Assuming 'gems' string works with awardRoulettePrize if added there, or we check gameState.
                // Previous code: let awardType = winType === 'gems' ? 'grow_mult' : winType;

                // If the symbol is 'gem' (Green Gem Icon), users might expect 'Gems' or 'Grow'.
                // If the symbol is 'seven' (Red 7), new logic says 50/100 Gems.

                let awardType = winType;
                // Special handling if 'gem' symbol was previously 'grow_mult', let's stick to 'gems' for now as that's safe, 
                // but if 'gem' symbol meant strictly seeds, we might need to revert that specific one. 
                // However, user asked for "7 => 50 100 gems". 
                // I will use 'gems' as the award string.

                awardRoulettePrize(awardType, winAmount);
            }

            setResult({ symbols: finalSymbols, win: winAmount, winType });
            setSpinning(false);
        });
    };
    const renderSymbol = (symbol: typeof SYMBOLS[0], size: number = SYMBOL_SIZE) => {
        const iconSize = size * 0.65; // Slightly reduced from 0.8 to fit better in square
        if (symbol.icon === '7') {
            return (
                <View style={[styles.symbolContainer, { width: size, height: size }]}>
                    <Text style={[styles.sevenText, { fontSize: size * 0.6 }]}>7</Text>
                </View>
            );
        }

        return (
            <View style={[styles.symbolContainer, { width: size, height: size }]}>
                {symbol.icon === 'coin' && <CoinIcon size={iconSize} />}
                {symbol.icon === 'energy' && <EnergyIcon size={iconSize} />}
                {symbol.icon === 'gem' && <GemIcon size={iconSize} />}
                {symbol.icon === 'diamond' && <DiamondIcon size={iconSize} />}
            </View>
        );
    };

    const renderReel = (reelData: typeof SYMBOLS[0][], animValue: Animated.Value, index: number) => {
        const translateY = animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -SYMBOL_SIZE * 28], // Scroll distance (Target index 30 at Row 2 [Middle of 5])
        });

        return (
            <View key={index} style={styles.reelContainer}>
                <View style={styles.reelMask}>
                    <Animated.View style={[styles.reelStrip, { transform: [{ translateY }] }]}>
                        {reelData.slice(0, 40).map((symbol, i) => (
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
                    {/* Top-left Icon as requested */}
                    <View style={styles.headerIconContainer}>
                        <CasinoIcon size={24} color="#ef4444" />
                    </View>
                    <Text style={styles.title}>SLOTS</Text>
                </View>

                {/* Slot Machine Frame */}
                <View style={styles.machineFrame}>
                    {/* Perimeter Lights */}
                    <View style={styles.lightsTop}>
                        {[...Array(6)].map((_, i) => (
                            <Animated.View key={`t${i}`} style={[styles.lightSmall, { opacity: lightsAnim }]} />
                        ))}
                    </View>

                    <View style={styles.lightsBottom}>
                        {[...Array(6)].map((_, i) => (
                            <Animated.View key={`b${i}`} style={[styles.lightSmall, { opacity: lightsAnim }]} />
                        ))}
                    </View>

                    <View style={styles.lightsLeft}>
                        {[...Array(7)].map((_, i) => (
                            <Animated.View key={`l${i}`} style={[styles.lightSide, { opacity: lightsAnim }]} />
                        ))}
                    </View>
                    <View style={styles.lightsRight}>
                        {[...Array(7)].map((_, i) => (
                            <Animated.View key={`r${i}`} style={[styles.lightSide, { opacity: lightsAnim }]} />
                        ))}
                    </View>


                    {/* Win Line Indicator */}
                    <View style={styles.winLine} />

                    {/* Reels */}
                    <View style={styles.reelsContainer}>
                        {renderReel(reels[0], reel1Anim, 0)}
                        {renderReel(reels[1], reel2Anim, 1)}
                        {renderReel(reels[2], reel3Anim, 2)}
                    </View>
                </View>

                {/* Result or Paytable Display - Swapped to maintain layout stability */}
                {result ? (
                    <View style={styles.resultContainer}>
                        {result.win > 0 ? (
                            <>
                                <Text style={styles.winText}>YOU WON!</Text>
                                <View style={styles.winAmount}>
                                    {result.winType === 'coins' && <CoinIcon size={28} />}
                                    {result.winType === 'energy' && <EnergyIcon size={28} />}
                                    {result.winType === 'gems' && <GemIcon size={28} />}
                                    {result.winType === 'shard' && <DiamondIcon size={28} />}
                                    <Text style={styles.winValue}>{result.win}</Text>
                                </View>
                            </>
                        ) : (
                            <Text style={styles.loseText}>Try Again!</Text>
                        )}
                    </View>
                ) : (
                    <View style={styles.paytable}>
                        <Text style={styles.paytableTitle}>PAYOUTS</Text>
                        <View style={styles.paytableRow}>
                            <Text style={styles.paytableText}>Match 3 for Big Prizes!</Text>
                        </View>
                        <View style={styles.paytableRow}>
                            <Text style={styles.paytableText}>777 = 100 Gems Jackpot</Text>
                        </View>
                    </View>
                )}

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
        flexDirection: 'row', // Align icon and title
        justifyContent: 'center',
        width: '100%',
        position: 'relative', // For absolute positioning of icon if needed, or flex layout
    },
    headerIconContainer: {
        position: 'absolute',
        left: 0,
        top: 4,
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
        padding: 24, // Increased padding for lights inside
        borderWidth: 4,
        borderColor: '#444',
        position: 'relative',
        alignItems: 'center',
    },
    // Light Strips
    lightsTop: {
        position: 'absolute',
        top: 6,
        flexDirection: 'row',
        gap: 15,
        zIndex: 5,
    },
    lightsBottom: {
        position: 'absolute',
        bottom: 6,
        flexDirection: 'row',
        gap: 15,
        zIndex: 5,
    },
    lightsLeft: {
        position: 'absolute',
        left: 6,
        top: 20,
        bottom: 20,
        justifyContent: 'space-between',
        zIndex: 5,
    },
    lightsRight: {
        position: 'absolute',
        right: 6,
        top: 20,
        bottom: 20,
        justifyContent: 'space-between',
        zIndex: 5,
    },
    lightSmall: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ef4444',
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 6,
    },
    lightSide: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ef4444',
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 6,
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
