import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useGame } from '../gameState';
import { QUESTS, Quest, getAllQuests } from '../data/quests';
import { getTreeSpecies } from '../data/treeSpecies';
import { CoinIcon, EnergyIcon, GemIcon, getIconByName } from './Icons';

interface QuestPanelProps {
    onClose: () => void;
}

export const QuestPanel: React.FC<QuestPanelProps> = ({ onClose }) => {
    const { state, claimQuestReward, getAvailableQuestsList } = useGame();
    const availableQuests = getAvailableQuestsList();

    const getProgress = (quest: Quest): { current: number; target: number; completed: boolean } => {
        const target = quest.objective.target;
        let current = 0;

        switch (quest.objective.type) {
            case 'tap_count':
                current = state.totalTaps;
                break;
            case 'tree_height':
                const hStats = state.treeStats[quest.objective.treeId || state.currentTreeId];
                current = hStats?.height || 0;
                break;
            case 'total_energy':
                current = state.totalEnergyEarned;
                break;
            case 'unlock_species':
                current = state.unlockedTrees.length;
                break;
            case 'tree_level':
                current = Math.max(...Object.values(state.treeStats).map(s => s.level), 0);
                break;
            case 'specific_tree_level':
                const tStats = state.treeStats[quest.objective.treeId || 'oak'];
                current = tStats?.level || 0;
                break;
            case 'roulette_spins':
                current = state.totalSpins || 0;
                break;
            case 'upgrades_purchased':
                current = state.totalUpgradesPurchased || 0;
                break;
            case 'lab_trees_created':
                if (quest.objective.rarity) {
                    current = state.labTreesByRarity?.[quest.objective.rarity] || 0;
                } else {
                    current = state.totalLabTreesCreated || 0;
                }
                break;
        }

        return {
            current: Math.min(current, target),
            target,
            completed: current >= target
        };
    };

    // Sort quests: claimable first, then in progress
    const sortedQuests = [...availableQuests].sort((a, b) => {
        const aProgress = getProgress(a);
        const bProgress = getProgress(b);
        if (aProgress.completed && !bProgress.completed) return -1;
        if (!aProgress.completed && bProgress.completed) return 1;
        return 0;
    });

    const handleClaim = (questId: string) => {
        claimQuestReward(questId);
    };

    // Get tree-specific icon color
    const getTreeColor = (quest: Quest): string => {
        if (quest.objective.treeId) {
            const species = getTreeSpecies(quest.objective.treeId);
            return `hsl(${species.baseColor.hue}, ${species.baseColor.saturation}%, ${species.baseColor.lightness}%)`;
        }
        return '#888';
    };

    return (
        <View style={styles.overlay}>
            <View style={styles.modal}>
                <View style={styles.header}>
                    <Text style={styles.title}>📜 Quests</Text>
                    {state.tutorialStep !== 6 && (
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                <Text style={styles.closeBtnText}>✕</Text>
                            </TouchableOpacity>
                            {state.tutorialStep === 7 && (
                                <View style={styles.tutorialTooltip}>
                                    <View style={styles.arrowUp} />
                                    <Text style={styles.tooltipText}>Close Quests!</Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>

                <Text style={styles.subtitle}>
                    Completed: {state.completedQuests.length}/{Object.keys(QUESTS).length}
                </Text>

                <ScrollView style={styles.list} scrollEnabled={![6, 7].includes(state.tutorialStep)}>
                    {sortedQuests.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyEmoji}>🎉</Text>
                            <Text style={styles.emptyText}>All quests completed!</Text>
                        </View>
                    ) : (
                        sortedQuests.map(quest => {
                            const { current, target, completed } = getProgress(quest);
                            const progressPercent = (current / target) * 100;
                            const treeColor = getTreeColor(quest);

                            return (
                                <View
                                    key={quest.id}
                                    style={[
                                        styles.questCard,
                                        completed && styles.questCardClaimable,
                                        (state.tutorialStep === 6 && quest.id !== 'tutorial_upgrade') && { opacity: 0.4 },
                                        (state.tutorialStep === 7) && { opacity: 0.4 }
                                    ]}
                                >
                                    <View style={styles.questHeader}>
                                        <View style={styles.questIconContainer}>
                                            {getIconByName(quest.icon, 32)}
                                        </View>
                                        <View style={styles.questInfo}>
                                            <Text style={styles.questName}>{quest.name}</Text>
                                            <Text style={styles.questDesc}>{quest.description}</Text>
                                        </View>
                                        {completed && (
                                            <View style={styles.readyBadge}>
                                                <Text style={styles.readyText}>READY!</Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* Progress bar */}
                                    <View style={styles.progressContainer}>
                                        <View style={styles.progressBar}>
                                            <View
                                                style={[
                                                    styles.progressFill,
                                                    { width: `${progressPercent}%` },
                                                    completed && styles.progressComplete
                                                ]}
                                            />
                                        </View>
                                        <Text style={styles.progressText}>
                                            {Math.floor(current)}/{target}
                                        </Text>
                                    </View>

                                    {/* Rewards */}
                                    <View style={styles.rewardsRow}>
                                        <Text style={styles.rewardsLabel}>Rewards:</Text>
                                        {quest.rewards.coins && (
                                            <View style={styles.rewardItemContainer}>
                                                <CoinIcon size={14} />
                                                <Text style={styles.rewardItem}>{quest.rewards.coins}</Text>
                                            </View>
                                        )}
                                        {quest.rewards.energy && (
                                            <View style={styles.rewardItemContainer}>
                                                <EnergyIcon size={14} />
                                                <Text style={styles.rewardItem}>{quest.rewards.energy}</Text>
                                            </View>
                                        )}
                                        {quest.rewards.gems && (
                                            <View style={styles.rewardItemContainer}>
                                                <GemIcon size={14} />
                                                <Text style={styles.rewardItem}>{quest.rewards.gems}</Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* Claim button */}
                                    {(() => {
                                        const isTutorialStep6 = state.tutorialStep === 6;
                                        const isTutorialStep7 = state.tutorialStep === 7;
                                        const isTutorialQuest = quest.id === 'tutorial_upgrade';

                                        // During step 6: only tutorial quest can be claimed
                                        // During step 7: everything is locked (waiting for close)
                                        const isDisabled = !completed ||
                                            (isTutorialStep6 && !isTutorialQuest) ||
                                            isTutorialStep7;

                                        return (
                                            <View style={{ width: '100%' }}>
                                                <TouchableOpacity
                                                    style={[
                                                        styles.claimButton,
                                                        isDisabled && styles.claimButtonDisabled,
                                                        (isTutorialStep6 && !isTutorialQuest) && { opacity: 0.5 },
                                                        isTutorialStep7 && { opacity: 0.5 }
                                                    ]}
                                                    onPress={() => handleClaim(quest.id)}
                                                    disabled={isDisabled}
                                                >
                                                    <Text style={styles.claimButtonText}>
                                                        {completed ? '✓ Claim Reward' : 'In Progress'}
                                                    </Text>
                                                </TouchableOpacity>

                                                {isTutorialStep6 && isTutorialQuest && (
                                                    <View style={styles.itemTooltip}>
                                                        <Text style={styles.tooltipText}>🎁 Claim your reward!</Text>
                                                        <View style={styles.arrowDown} />
                                                    </View>
                                                )}
                                            </View>
                                        );
                                    })()}
                                </View>
                            );
                        })
                    )}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    itemTooltip: {
        position: 'absolute',
        bottom: '100%',
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingBottom: 5,
        zIndex: 200,
    },
    questCard: {
        backgroundColor: '#252525',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
        zIndex: 1, // Base zIndex
    },
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
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        zIndex: 10,
        elevation: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    closeBtn: {
        width: 36, height: 36,
        borderRadius: 18,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeBtnText: {
        color: '#fff',
        fontSize: 18,
    },
    subtitle: {
        color: '#888',
        marginBottom: 15,
    },
    list: {
        flex: 1,
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
    },
    emptyEmoji: {
        fontSize: 48,
    },
    emptyText: {
        color: '#888',
        marginTop: 12,
        fontSize: 16,
    },

    questCardClaimable: {
        borderColor: '#22c55e',
        backgroundColor: '#1a2f1a',
    },
    questHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    questIconContainer: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    questIcon: {
        fontSize: 32,
    },
    questInfo: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    iconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333',
        borderRadius: 8,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    questName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    questDesc: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    readyBadge: {
        backgroundColor: '#22c55e',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    readyText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: '#333',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#3b82f6',
        borderRadius: 4,
    },
    progressComplete: {
        backgroundColor: '#22c55e',
    },
    progressText: {
        color: '#aaa',
        fontSize: 12,
        minWidth: 60,
        textAlign: 'right',
    },
    rewardsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 12,
        alignItems: 'center',
    },
    rewardsLabel: {
        color: '#888',
        fontSize: 12,
    },
    rewardItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    rewardItem: {
        color: '#fbbf24',
        fontSize: 12,
        fontWeight: 'bold',
    },
    claimButton: {
        backgroundColor: '#22c55e',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    claimButtonDisabled: {
        backgroundColor: '#4b5563',
    },
    claimButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
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
    arrowDown: {
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'rgba(0,0,0,0.85)',
    },
});
