import React, { useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Dimensions, Easing } from 'react-native';
import { useGame } from '../gameState';
import { CoinIcon, EnergyIcon, GemIcon, HeightIcon, TapIcon, AutoIcon, getIconByName } from './Icons';

const { height } = Dimensions.get('window');

// Export bottom controls position so Tree can anchor to it
export const BOTTOM_CONTROLS_HEIGHT = 160; // Height of stats + tap button area
export const TREE_GROUND_POSITION = height - BOTTOM_CONTROLS_HEIGHT; // Tree base position

// Top bar with resources
// Top Bar with resources
export const TopBar: React.FC = () => {
    const {
        state,
        currentSpecies,
        getAutoEnergyRate,
        getAutoCoinRate,
        getEffectiveTapPower,
        getPrestigeEnergyBonus
    } = useGame();

    const currentStats = state.treeStats[state.currentTreeId];

    // Calculate rates
    const autoEnergy = getAutoEnergyRate();
    const autoCoin = getAutoCoinRate();

    // Calculate per-click energy
    const energyBonus = 1 + getPrestigeEnergyBonus();
    const perClick = getEffectiveTapPower() * currentSpecies.energyPerTap * energyBonus;

    return (
        <View style={styles.topSection}>
            <View style={styles.resourceBar}>
                {/* Energy */}
                <View style={styles.resourceItemColumn}>
                    <View style={styles.resourceRowMain}>
                        <EnergyIcon size={20} />
                        <Text style={styles.resourceValue}>{Math.floor(state.energy)}</Text>
                    </View>
                    <View style={styles.ratesRow}>
                        {autoEnergy > 0 && <Text style={styles.rateText}>+{autoEnergy.toFixed(1)}/s</Text>}
                    </View>
                </View>

                {/* Coins */}
                <View style={styles.resourceItemColumn}>
                    <View style={styles.resourceRowMain}>
                        <CoinIcon size={20} />
                        <Text style={styles.resourceValue}>{Math.floor(state.coins)}</Text>
                    </View>
                    {autoCoin > 0 && (
                        <View style={styles.ratesRow}>
                            <Text style={styles.rateText}>+{autoCoin.toFixed(1)}/s</Text>
                        </View>
                    )}
                </View>

                {/* Gems */}
                <View style={styles.resourceItemColumn}>
                    <View style={styles.resourceRowMain}>
                        <GemIcon size={20} />
                        <Text style={styles.resourceValue}>{Math.floor(state.gems)}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.treeInfoRow}>
                <View style={styles.treeInfo}>
                    {getIconByName(currentSpecies.emoji, 24)}
                    <Text style={styles.treeName}>{currentSpecies.name}</Text>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>Lv.{currentStats?.level || 1}</Text>
                    </View>
                </View>

                {currentStats && (
                    <View style={styles.xpBarContainer}>
                        <View
                            style={[
                                styles.xpBarFill,
                                { width: `${Math.min((currentStats.xp / (50 * Math.pow(1.5, currentStats.level - 1))) * 100, 100)}%` }
                            ]}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

// Bottom controls with tap button
export const BottomControls: React.FC = () => {
    const { state, tap, getEffectiveTapPower, getAutoGrowthRate } = useGame();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const autoGrowth = getAutoGrowthRate();
    const currentStats = state.treeStats[state.currentTreeId];

    const handleTap = useCallback(() => {
        tap();

        // Scale animation
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.98, duration: 80, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true })
        ]).start();
    }, [tap, scaleAnim]);

    // Spacebar listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === ' ') {
                handleTap();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleTap]);

    return (
        <View style={styles.bottomSection}>
            {/* Stats bar */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <HeightIcon size={14} color="#fbbf24" />
                    <Text style={styles.statValue}>{Math.floor(currentStats?.height || 50)}</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: '#22c55e' }]}>TAP: {getEffectiveTapPower().toFixed(1)}</Text>
                </View>

                {autoGrowth > 0 && (
                    <>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.autoValue}>
                                +{autoGrowth.toFixed(2)}↑/s
                            </Text>
                        </View>
                    </>
                )}
            </View>

            {/* Redesigned Tap Button */}
            <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%', alignItems: 'center' }}>
                <View style={styles.tapButton}>
                    <View style={styles.splitHitboxContainer}>
                        <TouchableOpacity
                            style={styles.hitboxSide}
                            onPress={handleTap}
                            activeOpacity={0.7}
                        />
                        <View style={styles.hitboxDivider} />
                        <TouchableOpacity
                            style={styles.hitboxSide}
                            onPress={handleTap}
                            activeOpacity={0.7}
                        />
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};

export const GameHUD: React.FC = () => {
    return (
        <View style={styles.hudContainer} pointerEvents="box-none">
            <TopBar />
            <BottomControls />
        </View>
    );
};

const styles = StyleSheet.create({
    hudContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'space-between',
        zIndex: 10,
    },
    bottomSection: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#111',
        paddingTop: 12,
        paddingBottom: 24,
        alignItems: 'center',
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#222',
    },
    tapRipple: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tapRippleCircle: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
    },
    topSection: {
        backgroundColor: '#111',
        paddingTop: 10,
        paddingBottom: 12,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    resourceBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 8,
    },
    resourceItemColumn: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 70,
    },
    resourceRowMain: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    resourceValue: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    ratesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    rateText: {
        color: '#888',
        fontSize: 10,
        fontWeight: '600',
    },
    treeInfoRow: {
        alignItems: 'center',
        gap: 8,
        marginTop: 10,
    },
    treeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    treeName: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
    },
    levelBadge: {
        backgroundColor: '#fbbf24',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    levelText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 12,
    },
    xpBarContainer: {
        height: 6,
        width: '60%',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    xpBarFill: {
        height: '100%',
        backgroundColor: '#fbbf24',
        borderRadius: 3,
    },
    bottomControls: {
        backgroundColor: '#111',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: '#222',
        alignItems: 'center',
        gap: 12,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 12,
        gap: 12,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statValue: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
    },
    statDivider: {
        width: 1,
        height: 20,
        backgroundColor: '#333',
    },
    autoValue: {
        color: '#4ade80',
        fontSize: 12,
        fontWeight: 'bold',
    },
    tapButton: {
        backgroundColor: '#22c55e',
        width: '98%',
        height: 64,
        borderRadius: 16,
        overflow: 'hidden', // Ensure hitboxes stay within rounds
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 10,
    },
    splitHitboxContainer: {
        flexDirection: 'row',
        width: '100%',
        height: '100%',
    },
    hitboxSide: {
        flex: 1,
        height: '100%',
    },
    hitboxDivider: {
        width: 1,
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)', // Very subtle divider
    },
    tapInner: {
        alignItems: 'center',
    },
    tapText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: 2,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    tapMainContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    tapPowerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 5,
    },
    tapPower: {
        color: 'rgba(255,255,255,0.95)',
        fontSize: 13,
        fontWeight: 'bold',
    },
});
