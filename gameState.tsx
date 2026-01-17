import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { TREE_SPECIES, getTreeSpecies, getAllSpecies, TreeSpecies } from './data/treeSpecies';
import { UPGRADES, calculateUpgradeCost, calculateUpgradeEffect } from './data/upgrades';
import { QUESTS, getAvailableQuests, Quest } from './data/quests';
import { PRESTIGE_UPGRADES, calculatePrestigeShards, canPrestige, calculatePrestigeBonus, PRESTIGE_MIN_ENERGY, calculatePrestigeCost } from './data/prestige';

// Types
export interface TreeStats {
    level: number;
    xp: number;
    totalEnergy: number;
    height: number;
}

export interface PrestigeState {
    shards: number;
    totalShards: number;
    prestigeCount: number;
    upgradeLevels: Record<string, number>;
}

export interface GameState {
    energy: number;
    coins: number;
    seeds: number;
    grow: number; // New resource for roulette
    currentTreeId: string;
    totalTaps: number;
    totalEnergyEarned: number;
    totalSpins: number; // New metric
    totalUpgradesPurchased: number; // New metric
    totalLabTreesCreated: number; // New metric
    unlockedTrees: string[];
    treeStats: Record<string, TreeStats>;
    upgradeLevels: Record<string, number>;
    completedQuests: string[];
    lastSaveTime: number;
    prestige: PrestigeState;
    customTrees: Record<string, TreeSpecies>;
}

const defaultTreeStats: TreeStats = { level: 1, xp: 0, totalEnergy: 0, height: 50 };
const defaultPrestige: PrestigeState = { shards: 0, totalShards: 0, prestigeCount: 0, upgradeLevels: {} };

const initialState: GameState = {
    energy: 0,
    coins: 50,
    seeds: 0,
    grow: 0,
    currentTreeId: 'oak',
    totalTaps: 0,
    totalEnergyEarned: 0,
    totalSpins: 0,
    totalUpgradesPurchased: 0,
    totalLabTreesCreated: 0,
    unlockedTrees: ['oak'],
    treeStats: { oak: { ...defaultTreeStats } },
    upgradeLevels: { tapPower: 0, growthSpeed: 0, autoEnergy: 0, autoGrowth: 0, coinBonus: 0 },
    completedQuests: [],
    lastSaveTime: Date.now(),
    prestige: { ...defaultPrestige },
    customTrees: {},
};

interface GameContextType {
    state: GameState;
    currentSpecies: TreeSpecies;
    allSpecies: TreeSpecies[];
    createCustomTree: (params: Omit<TreeSpecies, 'id' | 'unlockCost'>, cost: number) => void;
    tap: () => void;
    switchTree: (treeId: string) => void;
    unlockTree: (treeId: string) => boolean;
    buyUpgrade: (upgradeId: string) => boolean;
    claimQuestReward: (questId: string) => boolean;
    performPrestige: () => boolean;
    buyPrestigeUpgrade: (upgradeId: string) => boolean;
    spendSeeds: (amount: number) => boolean;
    awardRoulettePrize: (prizeType: string, prizeValue: number) => void;
    getPrestigeShardPreview: () => number;
    canPerformPrestige: () => boolean;
    getEffectiveTapPower: () => number;
    getEffectiveGrowthSpeed: () => number;
    getAutoEnergyRate: () => number;
    getAutoGrowthRate: () => number;
    getCoinMultiplier: () => number;
    getMaxTreeDepth: () => number;
    getAvailableQuestsList: () => Quest[];
    getClaimableQuestsCount: () => number;
    getPrestigeTapBonus: () => number;
    getPrestigeCoinBonus: () => number;
    getPrestigeEnergyBonus: () => number;
    getPrestigeGrowthBonus: () => number;
    hasCosmetic: (type: string) => boolean;
    currentTreeHeight: number;
    saveGame: () => void;
    loadGame: () => void;
    resetGame: () => void;
    addResources: (money: number, energy: number) => void;
}

const GameContext = createContext<GameContextType | null>(null);
const STORAGE_KEY = 'mobilechill_save';

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<GameState>(initialState);
    const autoEnergyRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const autoGrowthRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Calculate allSpecies and currentSpecies at the top level
    const allSpecies = useMemo(() => [...getAllSpecies(), ...Object.values(state.customTrees || {})], [state.customTrees]);
    const currentSpecies = useMemo(() => allSpecies.find(s => s.id === state.currentTreeId) || allSpecies[0], [allSpecies, state.currentTreeId]);
    const currentStats = state.treeStats[state.currentTreeId] || defaultTreeStats;
    const xpForLevel = (level: number) => Math.floor(50 * Math.pow(1.5, level - 1));

    // Load
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (!parsed.prestige) parsed.prestige = { ...defaultPrestige };
                if (parsed.grow === undefined) parsed.grow = 0;

                // MIGRATION / SYNC: Always recalculate derived stats to ensure accuracy
                if (parsed.customTrees) {
                    const realLabCount = Object.keys(parsed.customTrees).length;
                    // Keep the larger value just in case (e.g. if we add deletion later), but for now sync to reality
                    parsed.totalLabTreesCreated = Math.max(parsed.totalLabTreesCreated || 0, realLabCount);
                }

                if (parsed.upgradeLevels) {
                    const realUpgradeCount = Object.values(parsed.upgradeLevels).reduce((a: any, b: any) => a + b, 0);
                    parsed.totalUpgradesPurchased = Math.max(parsed.totalUpgradesPurchased || 0, realUpgradeCount);
                }

                // FIX: Register Dynamic Quests for Retroactive/Loaded Trees
                if (parsed.customTrees) {
                    Object.values(parsed.customTrees as Record<string, TreeSpecies>).forEach(tree => {
                        const q5 = {
                            id: `${tree.id}_level_5`,
                            name: `${tree.name} Rookie`,
                            description: `Level ${tree.name} to 5`,
                            icon: tree.name.includes('Money') ? '💰' : '🧬',
                            objective: { type: 'specific_tree_level', target: 5, treeId: tree.id },
                            rewards: { coins: 100 * (tree.branchCount || 2), seeds: 10 },
                        };
                        const q10 = {
                            id: `${tree.id}_level_10`,
                            name: `${tree.name} Expert`,
                            description: `Level ${tree.name} to 10`,
                            icon: '⭐',
                            objective: { type: 'specific_tree_level', target: 10, treeId: tree.id },
                            rewards: { coins: 300 * (tree.branchCount || 2), seeds: 30 },
                            prerequisite: `${tree.id}_level_5`,
                        };
                        // @ts-ignore
                        QUESTS[q5.id] = q5;
                        // @ts-ignore
                        QUESTS[q10.id] = q10;
                    });
                }

                setState({ ...initialState, ...parsed });
            }
        } catch (e) { console.log('No save'); }
    }, []);

    // Auto-save
    useEffect(() => {
        const interval = setInterval(() => {
            setState(prev => {
                const toSave = { ...prev, lastSaveTime: Date.now() };
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)); } catch (e) { }
                return toSave;
            });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // Prestige bonuses
    const getPrestigeTapBonus = useCallback(() => calculatePrestigeBonus(state.prestige.upgradeLevels, 'tap_bonus'), [state.prestige.upgradeLevels]);
    const getPrestigeCoinBonus = useCallback(() => calculatePrestigeBonus(state.prestige.upgradeLevels, 'coin_bonus'), [state.prestige.upgradeLevels]);
    const getPrestigeEnergyBonus = useCallback(() => calculatePrestigeBonus(state.prestige.upgradeLevels, 'energy_bonus'), [state.prestige.upgradeLevels]);
    const getPrestigeGrowthBonus = useCallback(() => calculatePrestigeBonus(state.prestige.upgradeLevels, 'growth_bonus'), [state.prestige.upgradeLevels]);
    const getPrestigeAutoEnergyBonus = useCallback(() => calculatePrestigeBonus(state.prestige.upgradeLevels, 'auto_energy_bonus'), [state.prestige.upgradeLevels]);
    const getPrestigeAutoGrowthBonus = useCallback(() => calculatePrestigeBonus(state.prestige.upgradeLevels, 'auto_growth_bonus'), [state.prestige.upgradeLevels]);

    const getMaxTreeDepth = useCallback(() => {
        const base = 9;
        const bonus = calculatePrestigeBonus(state.prestige.upgradeLevels, 'max_tree_size');
        return base + Math.floor(bonus);
    }, [state.prestige.upgradeLevels]);

    const hasCosmetic = useCallback((type: string): boolean => {
        for (const [id, level] of Object.entries(state.prestige.upgradeLevels)) {
            if (level > 0 && PRESTIGE_UPGRADES[id]?.cosmetic?.type === type) return true;
        }
        return false;
    }, [state.prestige.upgradeLevels]);

    // Upgrade getters
    const getEffectiveTapPower = useCallback(() => {
        const base = calculateUpgradeEffect(UPGRADES.tapPower, state.upgradeLevels.tapPower || 0);
        return base * (1 + getPrestigeTapBonus());
    }, [state.upgradeLevels.tapPower, getPrestigeTapBonus]);

    const getEffectiveGrowthSpeed = useCallback(() => {
        const base = calculateUpgradeEffect(UPGRADES.growthSpeed, state.upgradeLevels.growthSpeed || 0);
        return base * (1 + getPrestigeGrowthBonus());
    }, [state.upgradeLevels.growthSpeed, getPrestigeGrowthBonus]);

    const getAutoEnergyRate = useCallback(() => {
        const base = calculateUpgradeEffect(UPGRADES.autoEnergy, state.upgradeLevels.autoEnergy || 0);
        return base + getPrestigeAutoEnergyBonus();
    }, [state.upgradeLevels.autoEnergy, getPrestigeAutoEnergyBonus]);

    const getAutoGrowthRate = useCallback(() => {
        const base = calculateUpgradeEffect(UPGRADES.autoGrowth, state.upgradeLevels.autoGrowth || 0);
        return base + getPrestigeAutoGrowthBonus();
    }, [state.upgradeLevels.autoGrowth, getPrestigeAutoGrowthBonus]);

    const getCoinMultiplier = useCallback(() => {
        const base = calculateUpgradeEffect(UPGRADES.coinBonus, state.upgradeLevels.coinBonus || 0);
        return base * (1 + getPrestigeCoinBonus());
    }, [state.upgradeLevels.coinBonus, getPrestigeCoinBonus]);

    // Auto mechanics
    const getPrestigeAutoCoinBonus = useCallback(() => calculatePrestigeBonus(state.prestige.upgradeLevels, 'auto_coin_bonus'), [state.prestige.upgradeLevels]);

    const getAutoCoinRate = useCallback(() => {
        const base = calculateUpgradeEffect(UPGRADES.autoCoin, state.upgradeLevels.autoCoin || 0);
        return base + getPrestigeAutoCoinBonus();
    }, [state.upgradeLevels.autoCoin, getPrestigeAutoCoinBonus]);

    const autoCoinRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Auto-Energy
    useEffect(() => {
        if (autoEnergyRef.current) clearInterval(autoEnergyRef.current);
        const rate = getAutoEnergyRate();
        if (rate > 0) {
            autoEnergyRef.current = setInterval(() => {
                setState(prev => {
                    const energyBonus = 1 + getPrestigeEnergyBonus();
                    const gain = rate * currentSpecies.energyPerTap * energyBonus;
                    return { ...prev, energy: prev.energy + gain, totalEnergyEarned: prev.totalEnergyEarned + gain };
                });
            }, 1000 / (currentSpecies.timeMultiplier || 1.0));
        }
        return () => { if (autoEnergyRef.current) clearInterval(autoEnergyRef.current); };
    }, [state.upgradeLevels.autoEnergy, state.prestige.upgradeLevels, currentSpecies.timeMultiplier]);

    // Auto-Coins
    useEffect(() => {
        if (autoCoinRef.current) clearInterval(autoCoinRef.current);
        const rate = getAutoCoinRate();
        if (rate > 0) {
            autoCoinRef.current = setInterval(() => {
                setState(prev => {
                    // Apply Coin Multipliers to Auto-Coins too? usually yes for idle games
                    // But for balance, let's stick to raw rate + bonuses first, maybe multiply by global coin mult later
                    // Let's multiply by Coin Multiplier to make it relevant
                    const coinMult = getCoinMultiplier();
                    const gain = rate * coinMult;
                    return { ...prev, coins: prev.coins + gain };
                });
            }, 1000); // 1 tick per second fixed for coins usually
        }
        return () => { if (autoCoinRef.current) clearInterval(autoCoinRef.current); };
    }, [state.upgradeLevels.autoCoin, state.prestige.upgradeLevels, getCoinMultiplier]);

    // Auto-growth
    useEffect(() => {
        if (autoGrowthRef.current) clearInterval(autoGrowthRef.current);
        const rate = getAutoGrowthRate();
        if (rate > 0) {
            autoGrowthRef.current = setInterval(() => {
                setState(prev => {
                    const oldStats = prev.treeStats[prev.currentTreeId] || defaultTreeStats;
                    return {
                        ...prev,
                        treeStats: { ...prev.treeStats, [prev.currentTreeId]: { ...oldStats, height: oldStats.height + rate } },
                    };
                });
            }, 1000 / (currentSpecies.timeMultiplier || 1.0));
        }
        return () => { if (autoGrowthRef.current) clearInterval(autoGrowthRef.current); };
    }, [state.upgradeLevels.autoGrowth, state.prestige.upgradeLevels, currentSpecies.timeMultiplier]);

    // TAP
    const tap = useCallback(() => {
        setState(prev => {
            const species = TREE_SPECIES[prev.currentTreeId] || prev.customTrees?.[prev.currentTreeId] || TREE_SPECIES.oak;
            const tapPower = getEffectiveTapPower();
            const growthSpeed = getEffectiveGrowthSpeed();
            const coinMult = getCoinMultiplier();
            const energyBonus = 1 + getPrestigeEnergyBonus();

            const energyGain = tapPower * species.energyPerTap * energyBonus;
            const heightGain = 0.5 * growthSpeed * species.growthRate;

            const oldStats = prev.treeStats[prev.currentTreeId] || { ...defaultTreeStats };
            const levelBonus = oldStats.level * 0.025;
            const coinsPerTap = (0.1 + levelBonus) * coinMult * species.coinMultiplier;

            let newXp = oldStats.xp + 1;
            let newLevel = oldStats.level;
            let coinReward = coinsPerTap;
            // Removed growReward calculation as we don't want to flood seeds on every tap level up yet?
            // Or maybe small amount? 
            // "Leave only the one spent for buying new trees" -> Seeds.
            // If I give seeds every level up, it might be too easy. But previously we gave 'grow' every level.
            // Let's strictly follow "Remove extra currency" and rely on Quests for Seeds for now, 
            // OR if user wants consistent income, maybe 1 seed per level?
            // Let's saferty keep it hard (Quests) to avoid breaking economy.

            while (newXp >= xpForLevel(newLevel) && newLevel < 20) {
                newXp -= xpForLevel(newLevel);
                newLevel++;
                coinReward += newLevel * 10 * coinMult * species.coinMultiplier;
            }

            return {
                ...prev,
                energy: prev.energy + energyGain,
                coins: prev.coins + coinReward,
                totalTaps: prev.totalTaps + 1,
                totalEnergyEarned: prev.totalEnergyEarned + energyGain,
                treeStats: {
                    ...prev.treeStats,
                    [prev.currentTreeId]: { ...oldStats, xp: newXp, level: newLevel, totalEnergy: oldStats.totalEnergy + energyGain, height: oldStats.height + heightGain },
                },
            };
        });
    }, [getEffectiveTapPower, getEffectiveGrowthSpeed, getCoinMultiplier, getPrestigeEnergyBonus]);

    const switchTree = useCallback((treeId: string) => {
        if (state.unlockedTrees.includes(treeId)) setState(prev => ({ ...prev, currentTreeId: treeId }));
    }, [state.unlockedTrees]);

    const unlockTree = useCallback((treeId: string): boolean => {
        const species = TREE_SPECIES[treeId];
        if (!species || state.unlockedTrees.includes(treeId) || state.seeds < species.unlockCost) return false;
        setState(prev => ({
            ...prev,
            seeds: prev.seeds - species.unlockCost,
            // Removed grow reward
            unlockedTrees: [...prev.unlockedTrees, treeId],
            treeStats: { ...prev.treeStats, [treeId]: { ...defaultTreeStats } },
        }));
        return true;
    }, [state.seeds, state.unlockedTrees]);

    const buyUpgrade = useCallback((upgradeId: string): boolean => {
        const upgrade = UPGRADES[upgradeId];
        if (!upgrade) return false;
        const level = state.upgradeLevels[upgradeId] || 0;
        const cost = calculateUpgradeCost(upgrade, level);
        if (state.coins < cost || level >= upgrade.maxLevel) return false;
        setState(prev => ({ ...prev, coins: prev.coins - cost, upgradeLevels: { ...prev.upgradeLevels, [upgradeId]: level + 1 } }));
        return true;
    }, [state.coins, state.upgradeLevels]);

    const claimQuestReward = useCallback((questId: string): boolean => {
        const quest = QUESTS[questId];
        if (!quest || state.completedQuests.includes(questId)) return false;
        let completed = false;
        switch (quest.objective.type) {
            case 'tap_count': completed = state.totalTaps >= quest.objective.target; break;
            case 'tree_height': const h = state.treeStats[quest.objective.treeId || state.currentTreeId]; completed = h && h.height >= quest.objective.target; break;
            case 'total_energy': completed = state.totalEnergyEarned >= quest.objective.target; break;
            case 'unlock_species': completed = state.unlockedTrees.length >= quest.objective.target; break;
            case 'tree_level': completed = Object.values(state.treeStats).some(s => s.level >= quest.objective.target); break;
            case 'specific_tree_level': const t = state.treeStats[quest.objective.treeId || 'oak']; completed = t && t.level >= quest.objective.target; break;
        }
        if (!completed) return false;
        setState(prev => ({
            ...prev,
            coins: prev.coins + (quest.rewards.coins || 0),
            seeds: prev.seeds + (quest.rewards.seeds || 0),
            grow: prev.grow + 5, // Earn grow for completing quests
            completedQuests: [...prev.completedQuests, questId],
        }));
        return true;
    }, [state]);

    // Roulette
    const spinRoulette = useCallback((cost: number, prizeType: string, prizeValue: number) => {
        setState(prev => {
            let newState = { ...prev, grow: prev.grow - cost };
            switch (prizeType) {
                case 'shard': newState.prestige = { ...newState.prestige, shards: newState.prestige.shards + prizeValue }; break;
                case 'coins': newState.coins += prizeValue; break;
                case 'energy': newState.energy += prizeValue; newState.totalEnergyEarned += prizeValue; break;
                case 'grow_mult': newState.grow += prizeValue; break;
            }
            return newState;
        });
    }, []);

    // Prestige
    const getPrestigeShardPreview = useCallback(() => calculatePrestigeShards(state.totalEnergyEarned), [state.totalEnergyEarned]);
    const canPerformPrestige = useCallback(() => canPrestige(state.totalEnergyEarned), [state.totalEnergyEarned]);

    const performPrestige = useCallback((): boolean => {
        if (!canPrestige(state.totalEnergyEarned)) return false;
        const shards = calculatePrestigeShards(state.totalEnergyEarned);
        setState(prev => ({
            ...initialState,
            prestige: { ...prev.prestige, shards: prev.prestige.shards + shards, totalShards: prev.prestige.totalShards + shards, prestigeCount: prev.prestige.prestigeCount + 1 },
            lastSaveTime: Date.now(),
        }));
        return true;
    }, [state.totalEnergyEarned]);

    const buyPrestigeUpgrade = useCallback((upgradeId: string): boolean => {
        const upgrade = PRESTIGE_UPGRADES[upgradeId];
        if (!upgrade) return false;
        const level = state.prestige.upgradeLevels[upgradeId] || 0;
        const cost = calculatePrestigeCost(upgrade, level);
        if (state.prestige.shards < cost || level >= upgrade.maxLevel) return false;
        setState(prev => ({
            ...prev,
            prestige: { ...prev.prestige, shards: prev.prestige.shards - cost, upgradeLevels: { ...prev.prestige.upgradeLevels, [upgradeId]: level + 1 } },
        }));
        return true;
    }, [state.prestige]);

    const getAvailableQuestsList = useCallback(() => getAvailableQuests(state.completedQuests), [state.completedQuests]);

    const getClaimableQuestsCount = useCallback(() => {
        let count = 0;
        for (const quest of getAvailableQuests(state.completedQuests)) {
            let done = false;
            switch (quest.objective.type) {
                case 'tap_count': done = state.totalTaps >= quest.objective.target; break;
                case 'tree_height': const h = state.treeStats[quest.objective.treeId || state.currentTreeId]; done = h && h.height >= quest.objective.target; break;
                case 'total_energy': done = state.totalEnergyEarned >= quest.objective.target; break;
                case 'unlock_species': done = state.unlockedTrees.length >= quest.objective.target; break;
                case 'tree_level': done = Object.values(state.treeStats).some(s => s.level >= quest.objective.target); break;
                case 'specific_tree_level': const t = state.treeStats[quest.objective.treeId || 'oak']; done = t && t.level >= quest.objective.target; break;
            }
            if (done) count++;
        }
        return count;
    }, [state]);

    // Save/Load/Reset functions
    const saveGame = useCallback(() => {
        try {
            const toSave = { ...state, lastSaveTime: Date.now() };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        } catch (e) {
            console.error('Failed to save game', e);
        }
    }, [state]);

    const loadGame = useCallback(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (!parsed.prestige) parsed.prestige = { ...defaultPrestige };
                if (parsed.grow === undefined) parsed.grow = 0;
                setState({ ...initialState, ...parsed });
            }
        } catch (e) {
            console.error('Failed to load game', e);
        }
    }, []);

    const resetGame = useCallback(() => {
        setState(initialState);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.error('Failed to reset game', e);
        }
    }, []);

    const addResources = useCallback((money: number, energy: number) => {
        setState(prev => ({
            ...prev,
            coins: prev.coins + money,
            energy: prev.energy + energy,
            totalEnergyEarned: prev.totalEnergyEarned + energy,
        }));
    }, []);

    const spendSeeds = useCallback((amount: number): boolean => {
        if (state.seeds < amount) return false;
        setState(prev => ({ ...prev, seeds: prev.seeds - amount }));
        return true;
    }, [state.seeds]);

    // Tree Lab: Create Custom Tree
    const createCustomTree = useCallback((params: Omit<TreeSpecies, 'id' | 'unlockCost'>, cost: number) => {
        const newId = `custom_${Date.now()}`;
        const finalTree: TreeSpecies = {
            id: newId,
            ...params,
            unlockCost: 0,
        };

        setState(prev => {
            // DYNAMIC QUEST GENERATION
            // Create quests for the new custom tree
            const treeName = finalTree.name;
            const newQuests: Quest[] = [];

            // Level 5 Quest
            newQuests.push({
                id: `${newId}_level_5`,
                name: `${treeName} Rookie`,
                description: `Level ${treeName} to 5`,
                icon: treeName.includes('Money') ? '💰' : '🧬',
                objective: { type: 'specific_tree_level', target: 5, treeId: newId },
                rewards: { coins: 100 * (finalTree.branchCount || 2), seeds: 10 },
            });

            // Level 10 Quest
            newQuests.push({
                id: `${newId}_level_10`,
                name: `${treeName} Expert`,
                description: `Level ${treeName} to 10`,
                icon: '⭐',
                objective: { type: 'specific_tree_level', target: 10, treeId: newId },
                rewards: { coins: 300 * (finalTree.branchCount || 2), seeds: 30 },
                prerequisite: `${newId}_level_5`,
            });

            // Temporarily Inject Quests into Global QUESTS Object (Hack but works for runtime)
            // Ideally, quests should be state-driven, but current architecture is static constant.
            // We'll update the QUESTS object directly.
            newQuests.forEach(q => {
                // @ts-ignore
                QUESTS[q.id] = q;
            });

            return {
                ...prev,
                seeds: prev.seeds - cost,
                customTrees: { ...prev.customTrees, [newId]: finalTree },
                unlockedTrees: [...prev.unlockedTrees, newId],
                currentTreeId: newId,
                treeStats: { ...prev.treeStats, [newId]: { level: 1, xp: 0, totalEnergy: 0, height: 50 } },
                totalLabTreesCreated: (prev.totalLabTreesCreated || 0) + 1
            };
        });
    }, []);

    // Moved allSpecies/currentSpecies definition to top of component to resolve scope issues
    // const allSpecies = ... 
    // const currentSpecies = ...

    const awardRoulettePrize = useCallback((prizeType: string, prizeValue: number) => {
        setState(prev => {
            let newState = { ...prev, totalSpins: (prev.totalSpins || 0) + 1 };

            if (prizeType === 'coins') {
                newState.coins += prizeValue;
            } else if (prizeType === 'seeds') {
                newState.seeds += prizeValue;
            } else if (prizeType === 'grow') {
                newState.grow += prizeValue;
            }

            // Auto-save on significant events
            saveGame();
            return newState;
        });
    }, [saveGame]);

    const value: GameContextType = {
        state, currentSpecies, allSpecies, tap, switchTree, unlockTree, buyUpgrade, claimQuestReward,
        performPrestige, buyPrestigeUpgrade,
        spendSeeds, awardRoulettePrize, createCustomTree,
        getPrestigeShardPreview, canPerformPrestige,
        getEffectiveTapPower, getEffectiveGrowthSpeed, getAutoEnergyRate, getAutoGrowthRate, getCoinMultiplier, getMaxTreeDepth,
        getAvailableQuestsList, getClaimableQuestsCount,
        getPrestigeTapBonus, getPrestigeCoinBonus, getPrestigeEnergyBonus, getPrestigeGrowthBonus, hasCosmetic,
        currentTreeHeight: currentStats.height,
        saveGame, loadGame, resetGame, addResources,
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextType => {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGame must be used within GameProvider');
    return context;
};
