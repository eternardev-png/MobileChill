export interface TreeSpecies {
  id: string;
  name: string;
  emoji: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';

  // Visual properties
  baseColor: { hue: number; saturation: number; lightness: number };
  gradientStart?: { hue: number; saturation: number; lightness: number };
  gradientEnd?: { hue: number; saturation: number; lightness: number };
  branchAngleRange: [number, number];

  // Unique branching patterns
  branchCount: number; // Number of sub-branches (2 = binary, 3 = ternary)
  branchLengthMultiplier: number; // How much shorter each level gets
  asymmetryFactor: number; // 0 = symmetric, 1 = highly asymmetric
  maxDepthBonus: number; // Extra depth for higher levels

  // Experimental (Structural DNA 2.0)
  spreadAngle?: number; // Base angle between branches (e.g. 15-50)
  decay?: number; // Length reduction per level (0.5 - 0.9)
  curvature?: number; // Bending factor per level (degrees)
  gravity?: number; // Downward pull per level
  foliageDensity?: number; // Visual density factor

  // Gameplay properties
  growthRate: number;
  energyPerTap: number;
  coinMultiplier: number;
  timeMultiplier?: number; // 1.0 = normal (1s), 2.0 = fast (0.5s), 0.5 = slow (2s)

  // Unlock requirements
  unlockCost: number;
  unlockQuest?: string;
}

export const TREE_SPECIES: Record<string, TreeSpecies> = {
  // 1. Oak - starter
  oak: {
    id: 'oak',
    name: 'Oak Tree',
    emoji: '🌳',
    description: 'A sturdy classic tree. Balanced in all stats.',
    rarity: 'common',
    baseColor: { hue: 120, saturation: 60, lightness: 35 },
    gradientStart: { hue: 130, saturation: 70, lightness: 20 }, // Deep Dark Green
    gradientEnd: { hue: 90, saturation: 90, lightness: 65 },    // Bright Lime Green (Big difference)
    branchAngleRange: [25, 35],
    branchCount: 2,
    branchLengthMultiplier: 0.7,
    asymmetryFactor: 0.1,
    maxDepthBonus: 0,
    growthRate: 1.0,
    energyPerTap: 1.0,
    coinMultiplier: 1.0,
    unlockCost: 0,
  },

  // 2. Pine
  pine: {
    id: 'pine',
    name: 'Pine Tree',
    emoji: '🌲',
    description: 'Grows faster but produces less energy.',
    rarity: 'common',
    baseColor: { hue: 145, saturation: 55, lightness: 30 },
    gradientStart: { hue: 100, saturation: 70, lightness: 20 }, // Dark Lime
    gradientEnd: { hue: 140, saturation: 90, lightness: 55 },   // Bright Pine Green
    branchAngleRange: [15, 25],
    branchCount: 3,
    branchLengthMultiplier: 0.75,
    asymmetryFactor: 0.05,
    maxDepthBonus: 1,
    growthRate: 1.3,
    energyPerTap: 0.8,
    coinMultiplier: 1.0,
    unlockCost: 10,
  },

  // 3. Maple (moved up)
  maple: {
    id: 'maple',
    name: 'Maple Tree',
    emoji: '🍁',
    description: 'Fast growing with good energy balance.',
    rarity: 'rare',
    baseColor: { hue: 30, saturation: 90, lightness: 50 },
    gradientStart: { hue: 0, saturation: 90, lightness: 30 },   // Deep Red
    gradientEnd: { hue: 45, saturation: 100, lightness: 65 },   // Light Orange/Yellow
    branchAngleRange: [20, 30],
    branchCount: 2,
    branchLengthMultiplier: 0.65,
    asymmetryFactor: 0.15,
    maxDepthBonus: 1,
    growthRate: 1.5,
    energyPerTap: 1.8,
    coinMultiplier: 1.0,
    unlockCost: 25,
    unlockQuest: 'first_unlock',
  },

  // 4. Cherry (moved down)
  cherry: {
    id: 'cherry',
    name: 'Cherry Blossom',
    emoji: '🌸',
    description: 'Beautiful and energy-rich, but grows slowly.',
    rarity: 'rare',
    baseColor: { hue: 330, saturation: 80, lightness: 60 },
    gradientStart: { hue: 330, saturation: 80, lightness: 50 }, // Standard Pink
    gradientEnd: { hue: 350, saturation: 90, lightness: 85 },   // Light Red-Pink (Not Purple)
    branchAngleRange: [25, 35],
    branchCount: 3,
    branchLengthMultiplier: 0.6,
    asymmetryFactor: 0.25,
    maxDepthBonus: 2,
    growthRate: 0.8,
    energyPerTap: 2.5,
    coinMultiplier: 1.0,
    unlockCost: 35,
    unlockQuest: 'collector',
  },

  // 5. Money Tree
  money: {
    id: 'money',
    name: 'Money Tree',
    emoji: '💰',
    description: 'Generates 1.5x coins but grows slowly.',
    rarity: 'epic',
    baseColor: { hue: 50, saturation: 100, lightness: 50 },
    gradientStart: { hue: 0, saturation: 80, lightness: 30 },   // Red base
    gradientEnd: { hue: 50, saturation: 100, lightness: 60 },   // Golden Yellow tips
    branchAngleRange: [30, 40],
    branchCount: 2,
    branchLengthMultiplier: 0.72,
    asymmetryFactor: 0.2,
    maxDepthBonus: 0,
    growthRate: 0.5,
    energyPerTap: 0.5,
    coinMultiplier: 1.5,
    unlockCost: 50,
    unlockQuest: 'master_growth',
  },

  // 6. Baobab
  baobab: {
    id: 'baobab',
    name: 'Baobab Tree',
    emoji: '🌴',
    description: 'Ancient and powerful. Maximum energy per tap.',
    rarity: 'legendary',
    baseColor: { hue: 35, saturation: 50, lightness: 45 },
    gradientStart: { hue: 40, saturation: 90, lightness: 35 },  // Orange/Golden Trunk
    gradientEnd: { hue: 0, saturation: 100, lightness: 60 },    // bright RED top
    branchAngleRange: [35, 50],
    branchCount: 4,
    branchLengthMultiplier: 0.55,
    asymmetryFactor: 0.35,
    maxDepthBonus: 3,
    growthRate: 0.6,
    energyPerTap: 4.0,
    coinMultiplier: 1.0,
    unlockCost: 100,
    unlockQuest: 'tree_master',
  },
};

export const getTreeSpecies = (id: string): TreeSpecies => {
  return TREE_SPECIES[id] || TREE_SPECIES.oak;
};

export const getAllSpecies = (): TreeSpecies[] => {
  // Return in specific order
  return [
    TREE_SPECIES.oak,
    TREE_SPECIES.pine,
    TREE_SPECIES.maple,
    TREE_SPECIES.cherry,
    TREE_SPECIES.money,
    TREE_SPECIES.baobab,
  ];
};
