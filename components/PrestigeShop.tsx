import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Circle, Path, Polygon, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';
import { useGame } from '../gameState';
import { PRESTIGE_UPGRADES, PRESTIGE_MIN_ENERGY, getAllPrestigeUpgrades, calculatePrestigeCost } from '../data/prestige';
import {
    PrestigeTapIcon,
    PrestigeCoinIcon,
    PrestigeEnergyIcon,
    PrestigeGrowthIcon,
    PrestigeTreeIcon,
    PrestigeRainbowIcon,
    PrestigeSparkleIcon,
    PrestigeGlowIcon,
} from './Icons';

interface PrestigeShopProps {
    onClose: () => void;
}

// Icon mapping helper
const getPrestigeIcon = (iconType: string, size: number = 28) => {
    switch (iconType) {
        case 'tap': return <PrestigeTapIcon size={size} />;
        case 'coin': return <PrestigeCoinIcon size={size} />;
        case 'energy': return <PrestigeEnergyIcon size={size} />;
        case 'grow': return <PrestigeGrowthIcon size={size} />;
        case 'tree': return <PrestigeTreeIcon size={size} />;
        case 'rainbow': return <PrestigeRainbowIcon size={size} />;
        case 'sparkle': return <PrestigeSparkleIcon size={size} />;
        case 'glow': return <PrestigeGlowIcon size={size} />;
        default: return <Text style={{ fontSize: size }}>❓</Text>;
    }
};

// Custom SVG Icons for Prestige UI
const PrestigeHeaderIcon = ({ size = 24 }: { size?: number }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            <LinearGradient id="prestigeHeaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#e879f9" />
                <Stop offset="100%" stopColor="#a855f7" />
            </LinearGradient>
        </Defs>
        <Polygon points="12,3 21,10 12,21 3,10" fill="url(#prestigeHeaderGrad)" />
        <Polygon points="12,3 16,10 12,13 8,10" fill="#fff" opacity={0.3} />
    </Svg>
);

const ResetIcon = ({ size = 20 }: { size?: number }) => (
    <Svg width={size} height={size} viewBox="0 0 20 20">
        <Path d="M15 6 A6 6 0 1 1 10 4" fill="none" stroke="#60a5fa" strokeWidth="2" />
        <Polygon points="15,3 17,6 15,6" fill="#60a5fa" />
        <Circle cx="10" cy="10" r="2" fill="#60a5fa" />
    </Svg>
);

const ShopIconSVG = ({ size = 20 }: { size?: number }) => (
    <Svg width={size} height={size} viewBox="0 0 20 20">
        <Path d="M3 4 L5 4 L7 14 L16 14 L18 6 L6 6" fill="none" stroke="#a855f7" strokeWidth="1.5" />
        <Circle cx="8" cy="17" r="1.5" fill="#a855f7" />
        <Circle cx="14" cy="17" r="1.5" fill="#a855f7" />
    </Svg>
);

export const PrestigeShop: React.FC<PrestigeShopProps> = ({ onClose }) => {
    const {
        state,
        performPrestige,
        buyPrestigeUpgrade,
        getPrestigeShardPreview,
        canPerformPrestige,
        advanceTutorial
    } = useGame();

    const [showConfirm, setShowConfirm] = useState(false);
    const upgrades = getAllPrestigeUpgrades();
    const shardPreview = getPrestigeShardPreview();
    const canPrestigeNow = canPerformPrestige();

    const handlePrestige = () => {
        if (canPrestigeNow) {
            setShowConfirm(true);
            if (state.tutorialStep === 9) advanceTutorial(10); // Step 9 (Reset) -> 10 (Confirm)
        }
    };

    const confirmPrestige = () => {
        performPrestige();
        setShowConfirm(false);
    };

    return (
        <View style={styles.overlay}>
            <View style={styles.modal}>
                <View style={styles.header}>
                    <View style={styles.titleRow}>
                        <PrestigeHeaderIcon size={26} />
                        <Text style={styles.title}>Prestige</Text>
                    </View>
                    {![8, 9, 10, 11].includes(state.tutorialStep) && (
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Text style={styles.closeBtnText}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Shards display with gradient */}
                <View style={styles.shardsDisplay}>
                    <Svg width="100%" height="100%" viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
                        <Defs>
                            <RadialGradient id="shardBg" cx="50%" cy="50%">
                                <Stop offset="0%" stopColor="#7e22ce" stopOpacity="0.4" />
                                <Stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.1" />
                            </RadialGradient>
                        </Defs>
                        <Circle cx="50" cy="50" r="50" fill="url(#shardBg)" />
                    </Svg>
                    <View style={styles.shardsContent}>
                        <Svg width="36" height="36" viewBox="0 0 20 20">
                            <Defs>
                                <LinearGradient id="shardDisplayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <Stop offset="0%" stopColor="#e879f9" />
                                    <Stop offset="50%" stopColor="#a855f7" />
                                    <Stop offset="100%" stopColor="#7e22ce" />
                                </LinearGradient>
                            </Defs>
                            <Polygon points="10,2 18,8 10,18 2,8" fill="url(#shardDisplayGrad)" />
                            <Polygon points="10,2 12,6 10,8 8,6" fill="#fff" opacity={0.6} />
                        </Svg>
                        <Text style={styles.shardsValue}>{state.prestige.shards}</Text>
                        <Text style={styles.shardsLabel}>Purple Shards</Text>
                    </View>
                </View>

                <View style={styles.prestigeInfo}>
                    <Text style={styles.prestigeCount}>Prestiges: {state.prestige.prestigeCount}</Text>
                    <Text style={styles.prestigeTotal}>Total: {state.prestige.totalShards} 💎</Text>
                </View>

                {/* Prestige button */}
                <View style={styles.prestigeSection}>
                    <View style={styles.sectionHeader}>
                        <ResetIcon size={18} />
                        <Text style={styles.sectionTitle}>Reset for Shards</Text>
                    </View>
                    <Text style={styles.thresholdText}>Need {PRESTIGE_MIN_ENERGY.toLocaleString()}+ energy</Text>
                    <Text style={styles.currentEnergy}>
                        Current: {Math.floor(state.totalEnergyEarned).toLocaleString()} ⚡
                    </Text>

                    <TouchableOpacity
                        style={[styles.prestigeButton, !canPrestigeNow && styles.prestigeButtonDisabled]}
                        onPress={handlePrestige}
                        disabled={!canPrestigeNow}
                    >
                        <Text style={styles.prestigeButtonText}>
                            {canPrestigeNow ? `Prestige +${shardPreview} 💎` : 'Not enough energy'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Upgrades shop */}
                <View style={styles.sectionHeader}>
                    <ShopIconSVG size={18} />
                    <Text style={styles.sectionTitle}>Prestige Shop</Text>
                </View>
                <ScrollView style={styles.list} scrollEnabled={![8, 9, 10, 11].includes(state.tutorialStep)}>
                    {upgrades.map(upgrade => {
                        const currentLevel = state.prestige.upgradeLevels[upgrade.id] || 0;
                        const isMaxed = currentLevel >= upgrade.maxLevel;
                        const cost = calculatePrestigeCost(upgrade, currentLevel);
                        const canAfford = state.prestige.shards >= cost;

                        return (
                            <View key={upgrade.id} style={styles.upgradeCard}>
                                <View style={styles.upgradeHeader}>
                                    <View style={styles.upgradeIconContainer}>
                                        {getPrestigeIcon(upgrade.icon, 28)}
                                    </View>
                                    <View style={styles.upgradeInfo}>
                                        <Text style={styles.upgradeName}>{upgrade.name}</Text>
                                        <Text style={styles.upgradeDesc}>{upgrade.description}</Text>
                                    </View>
                                    {upgrade.maxLevel > 1 && (
                                        <View style={styles.levelBadge}>
                                            <Text style={styles.levelText}>{currentLevel}/{upgrade.maxLevel}</Text>
                                        </View>
                                    )}
                                </View>

                                {upgrade.cosmetic && (
                                    <View style={styles.cosmeticBadge}>
                                        <Text style={styles.cosmeticText}>✨ Cosmetic</Text>
                                    </View>
                                )}

                                <TouchableOpacity
                                    style={[
                                        styles.buyButton,
                                        !canAfford && styles.buyButtonDisabled,
                                        isMaxed && styles.buyButtonMaxed,
                                    ]}
                                    onPress={() => buyPrestigeUpgrade(upgrade.id)}
                                    disabled={!canAfford || isMaxed}
                                >
                                    <Text style={styles.buyButtonText}>
                                        {isMaxed ? (currentLevel > 0 ? '✓ Owned' : 'MAXED') : `💎 ${cost}`}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </ScrollView>

                {/* Confirmation modal */}
                {showConfirm && (
                    <View style={styles.confirmOverlay}>
                        <View style={styles.confirmModal}>
                            <Text style={styles.confirmTitle}>⚠️ Confirm Prestige</Text>
                            <Text style={styles.confirmText}>
                                Reset ALL progress for:{'\n'}
                                <Text style={styles.shardHighlight}>{shardPreview} 💎 Shards</Text>
                            </Text>
                            <View style={styles.confirmButtons}>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowConfirm(false)}>
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.confirmButton} onPress={confirmPrestige}>
                                    <Text style={styles.confirmButtonText}>Prestige!</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
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
        width: '90%',
        maxWidth: 480,
        maxHeight: '88%',
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        padding: 18,
        borderWidth: 1.5,
        borderColor: '#a855f7',
        shadowColor: '#a855f7',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    title: {
        fontSize: 24,
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
    closeBtnText: {
        color: '#fff',
        fontSize: 16,
    },
    shardsDisplay: {
        height: 100,
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#7e22ce',
    },
    shardsContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    shardsValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#e879f9',
        marginTop: 4,
        textShadowColor: '#7e22ce',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    shardsLabel: {
        color: '#c084fc',
        fontSize: 11,
        fontWeight: '600',
    },
    prestigeInfo: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
    },
    prestigeCount: { color: '#888', fontSize: 11 },
    prestigeTotal: { color: '#888', fontSize: 11 },
    prestigeSection: {
        backgroundColor: '#252525',
        padding: 14,
        borderRadius: 14,
        marginBottom: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fff',
    },
    thresholdText: { color: '#f59e0b', fontSize: 11 },
    currentEnergy: {
        color: '#4ade80',
        fontSize: 13,
        fontWeight: 'bold',
        marginVertical: 6,
    },
    prestigeButton: {
        backgroundColor: '#a855f7',
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 12,
        shadowColor: '#a855f7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    prestigeButtonDisabled: {
        backgroundColor: '#4b5563',
        shadowOpacity: 0,
    },
    prestigeButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    list: { flex: 1 },
    upgradeCard: {
        backgroundColor: '#252525',
        borderRadius: 14,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#333',
    },
    upgradeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    upgradeIconContainer: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    upgradeIcon: { fontSize: 26 },
    upgradeInfo: { flex: 1 },
    upgradeName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    upgradeDesc: {
        fontSize: 11,
        color: '#888',
        marginTop: 1,
    },
    levelBadge: {
        backgroundColor: '#a855f7',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    levelText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    cosmeticBadge: {
        backgroundColor: 'rgba(168, 85, 247, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginTop: 6,
        borderWidth: 1,
        borderColor: '#a855f7',
    },
    cosmeticText: {
        color: '#e879f9',
        fontSize: 9,
        fontWeight: 'bold',
    },
    buyButton: {
        backgroundColor: '#a855f7',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#a855f7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    buyButtonDisabled: {
        backgroundColor: '#4b5563',
        shadowOpacity: 0,
    },
    buyButtonMaxed: {
        backgroundColor: '#22c55e',
        shadowColor: '#22c55e',
    },
    buyButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
    },
    confirmOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    confirmModal: {
        backgroundColor: '#222',
        padding: 24,
        borderRadius: 16,
        width: '82%',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#f59e0b',
    },
    confirmTitle: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
    },
    confirmText: {
        color: '#aaa',
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 18,
        lineHeight: 20,
    },
    shardHighlight: {
        color: '#e879f9',
        fontWeight: 'bold',
        fontSize: 17,
    },
    confirmButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        backgroundColor: '#4b5563',
        paddingVertical: 11,
        paddingHorizontal: 22,
        borderRadius: 10,
    },
    cancelButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
    confirmButton: {
        backgroundColor: '#a855f7',
        paddingVertical: 11,
        paddingHorizontal: 22,
        borderRadius: 10,
        shadowColor: '#a855f7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
    },
    confirmButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});
