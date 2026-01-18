import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useGame } from '../gameState';
import { getAllUpgrades, calculateUpgradeCost, calculateUpgradeEffect, Upgrade } from '../data/upgrades';
import { CoinIcon, getIconByName } from './Icons';

interface UpgradeShopProps {
    onClose: () => void;
}

export const UpgradeShop: React.FC<UpgradeShopProps> = ({ onClose }) => {
    const { state, buyUpgrade } = useGame();
    const [activeTab, setActiveTab] = React.useState<'active' | 'idle' | 'bonus'>('active');
    const upgrades = getAllUpgrades();

    const handleBuy = (upgradeId: string) => {
        buyUpgrade(upgradeId);
    };

    const getFilteredUpgrades = () => {
        return upgrades.filter(u => {
            if (activeTab === 'active') return ['tapPower', 'growthSpeed'].includes(u.id);
            if (activeTab === 'idle') return ['autoEnergy', 'autoGrowth', 'autoCoin'].includes(u.id);
            if (activeTab === 'bonus') return ['coinBonus'].includes(u.id);
            return false;
        });
    };

    const filteredUpgrades = getFilteredUpgrades();

    return (
        <View style={styles.overlay}>
            <View style={styles.modal}>
                <View style={styles.header}>
                    <Text style={styles.title}>🛒 Upgrade Shop</Text>
                    {state.tutorialStep !== 3 && (
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                <Text style={styles.closeBtnText}>✕</Text>
                            </TouchableOpacity>
                            {state.tutorialStep === 4 && (
                                <View style={styles.tutorialTooltip}>
                                    <View style={styles.arrowUp} />
                                    <Text style={styles.tooltipText}>Close the Shop!</Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {/* Coins display */}
                <View style={styles.balanceRow}>
                    <CoinIcon size={22} />
                    <Text style={styles.balanceValue}>{Math.floor(state.coins)}</Text>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    {(() => {
                        const isTabLocked = [3, 4].includes(state.tutorialStep);
                        return (
                            <>
                                <TouchableOpacity
                                    style={[styles.tabButton, activeTab === 'active' && styles.tabButtonActive, isTabLocked && { opacity: 0.5 }]}
                                    onPress={() => !isTabLocked && setActiveTab('active')}
                                    disabled={isTabLocked}
                                >
                                    <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>Active</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.tabButton, activeTab === 'idle' && styles.tabButtonActive, isTabLocked && { opacity: 0.5 }]}
                                    onPress={() => !isTabLocked && setActiveTab('idle')}
                                    disabled={isTabLocked}
                                >
                                    <Text style={[styles.tabText, activeTab === 'idle' && styles.tabTextActive]}>Idle</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.tabButton, activeTab === 'bonus' && styles.tabButtonActive, isTabLocked && { opacity: 0.5 }]}
                                    onPress={() => !isTabLocked && setActiveTab('bonus')}
                                    disabled={isTabLocked}
                                >
                                    <Text style={[styles.tabText, activeTab === 'bonus' && styles.tabTextActive]}>Bonus</Text>
                                </TouchableOpacity>
                            </>
                        );
                    })()}
                </View>

                <ScrollView style={styles.list}>
                    {filteredUpgrades.map(upgrade => {
                        const currentLevel = state.upgradeLevels[upgrade.id] || 0;
                        const isMaxed = currentLevel >= upgrade.maxLevel;
                        const cost = calculateUpgradeCost(upgrade, currentLevel);
                        const canAfford = state.coins >= cost;
                        const currentEffect = calculateUpgradeEffect(upgrade, currentLevel);
                        const nextEffect = calculateUpgradeEffect(upgrade, currentLevel + 1);

                        const isLockedStep = [3, 4].includes(state.tutorialStep);
                        const isTapPower = upgrade.id === 'tapPower';
                        const isDisabledByTutorial = isLockedStep && !isTapPower;
                        const isFullyLockedByStep4 = state.tutorialStep === 4;

                        return (
                            <View key={upgrade.id} style={[styles.upgradeCard, isDisabledByTutorial && { opacity: 0.5 }]}>
                                <View style={styles.upgradeHeader}>
                                    {getIconByName(upgrade.icon, 28, '#fbbf24')}
                                    <View style={styles.upgradeInfo}>
                                        <Text style={styles.upgradeName}>{upgrade.name}</Text>
                                        <Text style={styles.upgradeDesc}>{upgrade.description}</Text>
                                    </View>
                                    <View style={styles.levelBadge}>
                                        <Text style={styles.levelText}>{currentLevel}/{upgrade.maxLevel}</Text>
                                    </View>
                                </View>

                                {/* Effect preview */}
                                <View style={styles.effectRow}>
                                    <Text style={styles.effectCurrent}>{currentEffect.toFixed(2)}</Text>
                                    {!isMaxed && (
                                        <>
                                            <Text style={styles.effectArrow}>→</Text>
                                            <Text style={styles.effectNext}>{nextEffect.toFixed(2)}</Text>
                                        </>
                                    )}
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.buyButton,
                                        (!canAfford || isDisabledByTutorial || isFullyLockedByStep4) && styles.buyButtonDisabled,
                                        isMaxed && styles.buyButtonMaxed,
                                        (isDisabledByTutorial || isFullyLockedByStep4) && { opacity: 0.5 }
                                    ]}
                                    onPress={() => handleBuy(upgrade.id)}
                                    disabled={!canAfford || isMaxed || isDisabledByTutorial || isFullyLockedByStep4}
                                >
                                    <View style={styles.buyButtonInner}>
                                        {!isMaxed && <CoinIcon size={16} />}
                                        <Text style={styles.buyButtonText}>
                                            {isMaxed ? '✓ MAXED' : `${cost}`}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
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
        width: '90%',
        maxWidth: 450,
        maxHeight: '85%',
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        padding: 18,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
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
    closeBtnText: {
        color: '#fff',
        fontSize: 16,
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#252525',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 14,
    },
    balanceValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fbbf24',
    },
    upgradeItem: {
        backgroundColor: '#1a1a1a',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center', // Align icon vertically
        borderWidth: 1,
        borderColor: '#333',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#2a2a2a',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    list: {
        flex: 1,
    },
    upgradeCard: {
        backgroundColor: '#252525',
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
    },
    upgradeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    upgradeInfo: {
        flex: 1,
    },
    upgradeName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    upgradeDesc: {
        fontSize: 11,
        color: '#888',
        marginTop: 2,
    },
    levelBadge: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    levelText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    effectRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 10,
        marginBottom: 10,
    },
    effectCurrent: {
        fontSize: 14,
        color: '#888',
        fontWeight: 'bold',
    },
    effectArrow: {
        fontSize: 14,
        color: '#4ade80',
    },
    effectNext: {
        fontSize: 14,
        color: '#4ade80',
        fontWeight: 'bold',
    },
    buyButton: {
        backgroundColor: '#22c55e',
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
    },
    buyButtonDisabled: {
        backgroundColor: '#4b5563',
    },
    buyButtonMaxed: {
        backgroundColor: '#3b82f6',
    },
    buyButtonInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    buyButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    tabsContainer: {
        flexDirection: 'row',
        marginBottom: 14,
        paddingHorizontal: 4,
        gap: 8,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: '#333',
        borderRadius: 10,
        alignItems: 'center',
    },
    tabButtonActive: {
        backgroundColor: '#3b82f6',
    },
    tabText: {
        color: '#888',
        fontWeight: 'bold',
        fontSize: 13,
    },
    tabTextActive: {
        color: '#fff',
    },
    tutorialTooltip: {
        position: 'absolute',
        top: 40,
        right: -15,
        width: 140,
        alignItems: 'center',
        zIndex: 200,
    },
    tooltipText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        backgroundColor: 'rgba(0,0,0,0.85)',
        padding: 8,
        borderRadius: 8,
        textAlign: 'center',
    },
    arrowUp: {
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'rgba(0,0,0,0.85)',
    },
});
