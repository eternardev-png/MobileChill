// Prestige System Data

export interface PrestigeUpgrade {
    id: string;
    name: string;
    description: string;
    icon: string;
    baseCost: number;
    costIncrease: number;
    category: 'core' | 'auto' | 'special';
    effect: {
        type: 'tap_bonus' | 'coin_bonus' | 'energy_bonus' | 'growth_bonus' | 'auto_energy_bonus' | 'auto_growth_bonus' | 'max_tree_size' | 'auto_coin_bonus' | 'time_acceleration' | 'cosmetic';
        valuePerLevel: number;
    };
    cosmetic?: {
        type: 'rgb_taps' | 'rgb_tree' | 'glow_intensity' | 'particle_effect';
    };
}

export const PRESTIGE_UPGRADES: Record<string, PrestigeUpgrade> = {
    // Core bonuses
    eternal_power: {
        id: 'eternal_power',
        name: 'Eternal Power',
        description: '+15% tap power per level',
        icon: 'prestige_power',
        baseCost: 5,
        costIncrease: 2,
        category: 'core',
        effect: { type: 'tap_bonus', valuePerLevel: 0.15 },
    },

    golden_touch: {
        id: 'golden_touch',
        name: 'Golden Touch',
        description: '+15% coin gain per level',
        icon: 'prestige_coin',
        baseCost: 8,
        costIncrease: 3,
        category: 'core',
        effect: { type: 'coin_bonus', valuePerLevel: 0.15 },
    },

    nature_blessing: {
        id: 'nature_blessing',
        name: "Nature's Blessing",
        description: '+15% power gain per level',
        icon: 'prestige_energy_big',
        baseCost: 6,
        costIncrease: 2,
        category: 'core',
        effect: { type: 'energy_bonus', valuePerLevel: 0.15 },
    },

    rapid_growth: {
        id: 'rapid_growth',
        name: 'Rapid Growth',
        description: '+15% growth speed per level',
        icon: 'prestige_rapid',
        baseCost: 7,
        costIncrease: 2,
        category: 'core',
        effect: { type: 'growth_bonus', valuePerLevel: 0.15 },
    },

    // Auto bonuses
    eternal_energy: {
        id: 'eternal_energy',
        name: 'Eternal Power',
        description: '+0.15/s permanent auto power',
        icon: 'prestige_auto_energy',
        baseCost: 10,
        costIncrease: 4,
        category: 'auto',
        effect: { type: 'auto_energy_bonus', valuePerLevel: 0.15 },
    },

    eternal_growth: {
        id: 'eternal_growth',
        name: 'Eternal Growth',
        description: '+0.1/s permanent auto height',
        icon: 'prestige_rapid',
        baseCost: 12,
        costIncrease: 5,
        category: 'auto',
        effect: { type: 'auto_growth_bonus', valuePerLevel: 0.1 },
    },

    eternal_wealth: {
        id: 'eternal_wealth',
        name: 'Eternal Wealth',
        description: '+0.25/s permanent auto coins',
        icon: 'prestige_auto_wealth',
        baseCost: 15,
        costIncrease: 5,
        category: 'auto',
        effect: { type: 'auto_coin_bonus', valuePerLevel: 0.25 },
    },

    time_warp: {
        id: 'time_warp',
        name: 'Made in Heaven',
        description: '+15% game speed (auto) per level',
        icon: 'prestige_time',
        baseCost: 20,
        costIncrease: 10,
        category: 'auto',
        effect: { type: 'time_acceleration', valuePerLevel: 0.15 },
    },

    // Max tree size upgrade
    giant_roots: {
        id: 'giant_roots',
        name: 'Giant Roots',
        description: '+1 max tree depth (more branches)',
        icon: 'tree',
        baseCost: 20,
        costIncrease: 10,
        category: 'special',
        effect: { type: 'max_tree_size', valuePerLevel: 1 },
    },

    // Cosmetics
    rgb_taps: {
        id: 'rgb_taps',
        name: 'Rainbow Taps',
        description: 'RGB tap effects +5% tap bonus',
        icon: 'prestige_cosmetic',
        baseCost: 15,
        costIncrease: 0,
        category: 'special',
        effect: { type: 'tap_bonus', valuePerLevel: 0.05 },
        cosmetic: { type: 'rgb_taps' },
    },

    rgb_tree: {
        id: 'rgb_tree',
        name: 'Prismatic Tree',
        description: 'RGB tree texture +10% all',
        icon: 'prestige_cosmetic',
        baseCost: 30,
        costIncrease: 0,
        category: 'special',
        effect: { type: 'coin_bonus', valuePerLevel: 0.1 },
        cosmetic: { type: 'rgb_tree' },
    },

    mega_glow: {
        id: 'mega_glow',
        name: 'Mega Glow',
        description: 'Intense glow +5% power',
        icon: 'prestige_cosmetic',
        baseCost: 12,
        costIncrease: 5,
        category: 'special',
        effect: { type: 'energy_bonus', valuePerLevel: 0.05 },
        cosmetic: { type: 'glow_intensity' },
    },

    // Starting Resources
    initial_coins: {
        id: 'initial_coins',
        name: 'Head Start: Coins',
        description: '+500 Starting Coins per level',
        icon: 'prestige_initial_coin',
        baseCost: 10,
        costIncrease: 5,
        category: 'core',
        effect: { type: 'coin_bonus', valuePerLevel: 500 }, // valuePerLevel misused here but handled in gameState
    },

    initial_gems: {
        id: 'initial_gems',
        name: 'Head Start: Gems',
        description: '+15 Starting Gems per level',
        icon: 'prestige_initial_gem',
        baseCost: 15,
        costIncrease: 10,
        category: 'core',
        effect: { type: 'coin_bonus', valuePerLevel: 15 }, // valuePerLevel misused here but handled in gameState
    },
};

export const calculatePrestigeCost = (upgrade: PrestigeUpgrade, currentLevel: number): number => {
    return upgrade.baseCost + (upgrade.costIncrease * currentLevel);
};

export const PRESTIGE_MIN_ENERGY = 5000;

export const calculatePrestigeShards = (totalEnergyEarned: number): number => {
    if (totalEnergyEarned < PRESTIGE_MIN_ENERGY) return 0;
    // New Formula: (Energy / 500) ^ 0.6
    // More generous than sqrt (0.5) and lower divisor (500 vs 1000)
    return Math.floor(Math.pow(totalEnergyEarned / 500, 0.6));
};

export const canPrestige = (totalEnergyEarned: number): boolean => {
    return totalEnergyEarned >= PRESTIGE_MIN_ENERGY;
};

export const getAllPrestigeUpgrades = (): PrestigeUpgrade[] => Object.values(PRESTIGE_UPGRADES);

export const calculatePrestigeBonus = (
    prestigeLevels: Record<string, number>,
    bonusType: 'tap_bonus' | 'coin_bonus' | 'energy_bonus' | 'growth_bonus' | 'auto_energy_bonus' | 'auto_growth_bonus' | 'max_tree_size' | 'auto_coin_bonus' | 'time_acceleration'
): number => {
    let totalBonus = 0;
    for (const [id, level] of Object.entries(prestigeLevels)) {
        const upgrade = PRESTIGE_UPGRADES[id];
        if (upgrade && upgrade.effect.type === bonusType) {
            totalBonus += upgrade.effect.valuePerLevel * level;
        }
    }
    return totalBonus;
};
