import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Line, Defs, RadialGradient, Stop, Circle, G } from 'react-native-svg';
import { useGame } from '../gameState';
import { TreeSpecies } from '../data/treeSpecies';
import { EnergyIcon, CoinIcon, SeedIcon, GrowthRateIcon } from './Icons';

interface CollectionScreenProps {
    onClose: () => void;
}

const getTreeColor = (species: TreeSpecies, alpha: number = 1): string => {
    const { hue, saturation, lightness } = species.baseColor;
    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
};

const getTreeGlow = (species: TreeSpecies, alpha: number = 0.3): string => {
    const { hue, saturation, lightness } = species.baseColor;
    return `hsla(${hue}, ${saturation}%, ${lightness + 10}%, ${alpha})`;
};

const MiniTree: React.FC<{ species: TreeSpecies; level: number; height: number; isLocked: boolean }> = ({ species, level, height, isLocked }) => {
    const size = 80;
    const centerX = size / 2;
    const startY = size - 8;
    const baseLength = 20 + (level * 1.5);
    const branchAngle = (species.branchAngleRange[0] + species.branchAngleRange[1]) / 2;
    const depth = Math.min(3 + Math.floor(level / 4), 6);
    const { hue, saturation, lightness } = species.baseColor;

    const glowColor = `hsla(${hue}, ${saturation}%, ${lightness + 20}%, 0.6)`;

    const generateBranches = (x1: number, y1: number, angle: number, length: number, d: number): JSX.Element[] => {
        if (d > depth || length < 2) return [];
        const x2 = x1 + length * Math.sin((angle * Math.PI) / 180);
        const y2 = y1 - length * Math.cos((angle * Math.PI) / 180);
        const strokeColor = isLocked ? '#444' : `hsl(${hue - d * 12}, ${saturation}%, ${lightness - d * 3}%)`;

        // Use species parameters (fallback to defaults if missing in older species data)
        const branchCount = species.branchCount || 2;
        const lengthMult = species.branchLengthMultiplier || 0.7;
        const asymmetryFactor = species.asymmetryFactor || 0.1;

        // Deterministic randomization
        const seed = Math.sin(x2 * 0.01 + y2 * 0.01 + d * 10);

        const branches: JSX.Element[] = [
            <Line key={`${x1.toFixed(0)}-${y1.toFixed(0)}-${angle}-${d}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth={Math.max(1, depth - d + 1) * 0.7} strokeLinecap="round" />,
        ];

        const avgAngle = (species.branchAngleRange[0] + species.branchAngleRange[1]) / 2;
        const newLen = length * lengthMult;

        if (branchCount === 2) {
            const asymmetry = asymmetryFactor * seed * 20;
            branches.push(...generateBranches(x2, y2, angle - avgAngle + asymmetry, newLen, d + 1));
            branches.push(...generateBranches(x2, y2, angle + avgAngle - asymmetry, newLen, d + 1));
        } else if (branchCount === 3) {
            const asymmetry = asymmetryFactor * seed * 15;
            branches.push(...generateBranches(x2, y2, angle - avgAngle + asymmetry, newLen, d + 1));
            branches.push(...generateBranches(x2, y2, angle + asymmetry, newLen * 0.9, d + 1));
            branches.push(...generateBranches(x2, y2, angle + avgAngle - asymmetry, newLen, d + 1));
        } else if (branchCount === 4) {
            const asymmetry = asymmetryFactor * seed * 25;
            branches.push(...generateBranches(x2, y2, angle - avgAngle * 1.2 + asymmetry, newLen, d + 1));
            branches.push(...generateBranches(x2, y2, angle - avgAngle * 0.5 + asymmetry, newLen * 0.85, d + 1));
            branches.push(...generateBranches(x2, y2, angle + avgAngle * 0.5 - asymmetry, newLen * 0.85, d + 1));
            branches.push(...generateBranches(x2, y2, angle + avgAngle * 1.2 - asymmetry, newLen, d + 1));
        }

        return branches;
    };

    return (
        <Svg width={size} height={size}>
            {!isLocked && (
                <>
                    <Defs>
                        <RadialGradient id={`glow-${species.id}`} cx="50%" cy="80%" rx="50%" ry="50%">
                            <Stop offset="0%" stopColor={glowColor} />
                            <Stop offset="100%" stopColor="transparent" />
                        </RadialGradient>
                    </Defs>
                    <Circle cx={centerX} cy={startY - baseLength} r={30} fill={`url(#glow-${species.id})`} opacity={0.7} />
                </>
            )}
            <G>{generateBranches(centerX, startY, 0, baseLength, 0)}</G>
        </Svg>
    );
};

// Rarity infos
const getRarityInfo = (rarity: string): { label: string; stars: string; color: string } => {
    switch (rarity) {
        case 'common': return { label: 'Common', stars: '★', color: '#e2e8f0' };
        case 'rare': return { label: 'Rare', stars: '★★', color: '#60a5fa' };
        case 'epic': return { label: 'Epic', stars: '★★★', color: '#c084fc' };
        case 'legendary': return { label: 'Legendary', stars: '★★★★', color: '#fbbf24' };
        default: return { label: 'Common', stars: '★', color: '#e2e8f0' };
    }
};

export const CollectionScreen: React.FC<CollectionScreenProps> = ({ onClose }) => {
    const { state, switchTree, unlockTree, allSpecies } = useGame();

    const handleTreePress = (species: TreeSpecies) => {
        if (state.unlockedTrees.includes(species.id)) {
            switchTree(species.id);
            onClose();
        } else if (state.seeds >= species.unlockCost) {
            unlockTree(species.id);
        }
    };

    return (
        <View style={styles.overlay}>
            <View style={styles.modal}>
                <View style={styles.header}>
                    <Text style={styles.title}>Tree Collection</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Text style={styles.closeBtnText}>✕</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.subtitleRow}>
                    <Text style={styles.subtitle}>Collected: {state.unlockedTrees.length}/{allSpecies.length}</Text>
                    <View style={styles.seedsDisplay}>
                        <SeedIcon size={16} />
                        <Text style={styles.seedsValue}>{state.seeds}</Text>
                    </View>
                </View>

                <ScrollView style={styles.grid} contentContainerStyle={styles.gridContent}>
                    {allSpecies.map(species => {
                        const isUnlocked = state.unlockedTrees.includes(species.id);
                        const isSelected = state.currentTreeId === species.id;
                        const canAfford = state.seeds >= species.unlockCost;
                        const stats = state.treeStats[species.id];
                        const level = stats?.level || 1;
                        const height = stats?.height || 50;
                        const rarityInfo = getRarityInfo(species.rarity);

                        const treeColor = getTreeColor(species);
                        const treeGlow = getTreeGlow(species);
                        const showCoinBonus = species.coinMultiplier > 1;

                        const cardBorderColor = isUnlocked ? treeColor : '#444';

                        return (
                            <TouchableOpacity
                                key={species.id}
                                style={[styles.card, { borderColor: cardBorderColor }]}
                                onPress={() => handleTreePress(species)}
                                disabled={!isUnlocked && !canAfford}
                            >
                                {/* Tree Glow Background */}
                                {isUnlocked && <View style={[styles.glowBg, { backgroundColor: treeGlow }]} />}

                                {/* Rarity Corner Box - Solid Dark Background, Colored Stars */}
                                <View style={[styles.rarityCorner, {
                                    borderColor: rarityInfo.color,
                                    backgroundColor: '#151515' // Solid dark background as requested implies hiding what's behind
                                }]}>
                                    <View style={styles.rarityBadge}>
                                        <Text style={[styles.rarityStars, { color: rarityInfo.color }]}>{rarityInfo.stars}</Text>
                                    </View>
                                </View>

                                {/* Tree Preview Frame */}
                                <View style={[styles.treeFrame, { borderColor: isUnlocked ? treeColor : '#333' }]}>
                                    <MiniTree species={species} level={level} height={height} isLocked={!isUnlocked} />
                                    {!isUnlocked && (
                                        <View style={styles.lockOverlay}>
                                            <Text style={styles.lockIcon}>🔒</Text>
                                        </View>
                                    )}
                                </View>

                                <Text style={styles.cardName}>{species.name}</Text>
                                <Text style={[styles.rarityLabel, { color: rarityInfo.color }]}>{rarityInfo.label}</Text>

                                {isUnlocked ? (
                                    <View style={styles.levelContainer}>
                                        <Text style={[styles.cardLevel, { color: treeColor }]}>Lv.{level}</Text>
                                        {isSelected && <Text style={styles.selectedBadge}>ACTIVE</Text>}
                                    </View>
                                ) : (
                                    <View style={styles.costContainer}>
                                        <SeedIcon size={14} />
                                        <Text style={[styles.costText, !canAfford && styles.costTextRed]}>{species.unlockCost}</Text>
                                    </View>
                                )}

                                <View style={styles.statsRow}>
                                    <View style={styles.statItem}>
                                        <EnergyIcon size={12} />
                                        <Text style={styles.statText}>{species.energyPerTap}</Text>
                                    </View>
                                    <View style={styles.statItem}>
                                        <GrowthRateIcon size={12} color="#4ade80" />
                                        <Text style={styles.statText}>{species.growthRate}x</Text>
                                    </View>
                                    {showCoinBonus && (
                                        <View style={styles.statItem}>
                                            <CoinIcon size={12} />
                                            <Text style={[styles.statText, styles.coinText]}>{species.coinMultiplier}x</Text>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    modal: {
        width: '94%',
        maxWidth: 520,
        maxHeight: '90%',
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    closeBtn: {
        width: 34, height: 34,
        borderRadius: 17,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeBtnText: { color: '#fff', fontSize: 16 },
    subtitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    subtitle: { color: '#888', fontSize: 13 },
    seedsDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#252525',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    seedsValue: { color: '#4ade80', fontSize: 14, fontWeight: 'bold' },
    grid: { flex: 1 },
    gridContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
    },
    card: {
        width: '48%',
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 2,
        position: 'relative',
        overflow: 'hidden',
    },
    glowBg: {
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 100,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
    },
    rarityCorner: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 44,
        height: 44,
        borderBottomLeftRadius: 12,
        borderTopRightRadius: 14,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        // Solid background set in inline styles
    },
    rarityBadge: {
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
    },
    rarityStars: {
        fontSize: 11,
        fontWeight: 'bold'
        // Color set in inline styles
    },
    treeFrame: {
        width: 88,
        height: 88,
        borderRadius: 12,
        borderWidth: 2,
        backgroundColor: '#0f0f0f',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
        marginBottom: 4,
        overflow: 'hidden',
    },
    lockOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lockIcon: { fontSize: 24 },
    cardName: { fontSize: 12, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
    rarityLabel: { fontSize: 10, fontWeight: 'bold', marginTop: 1 },
    levelContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
    cardLevel: { fontSize: 12, fontWeight: 'bold' },
    selectedBadge: {
        fontSize: 8,
        color: '#22c55e',
        fontWeight: 'bold',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 4,
    },
    costContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
    costText: { fontSize: 12, color: '#4ade80', fontWeight: 'bold' },
    costTextRed: { color: '#ef4444' },
    statsRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    statText: { fontSize: 10, color: '#888' },
    coinText: { color: '#fbbf24' },
});
