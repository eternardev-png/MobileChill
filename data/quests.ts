export interface Quest {
  id: string;
  name: string;
  description: string;
  icon: string;

  objective: {
    type: 'tap_count'
    | 'tree_height'
    | 'total_energy'
    | 'unlock_species'
    | 'tree_level'
    | 'specific_tree_level'
    | 'roulette_spins'    // NEW
    | 'upgrades_purchased' // NEW
    | 'lab_trees_created'; // NEW
    target: number;
    treeId?: string;
  };

  rewards: {
    coins?: number;
    seeds?: number;
  };

  prerequisite?: string;
}

export const QUESTS: Record<string, Quest> = {
  // === BEGINNER ===
  first_tap: {
    id: 'first_tap',
    name: 'First Steps',
    description: 'Tap the tree 10 times',
    icon: '👆',
    objective: { type: 'tap_count', target: 10 },
    rewards: { coins: 20 },
  },
  getting_started: {
    id: 'getting_started',
    name: 'Getting Started',
    description: 'Tap the tree 50 times',
    icon: '🌱',
    objective: { type: 'tap_count', target: 50 },
    rewards: { coins: 40, seeds: 3 },
    prerequisite: 'first_tap',
  },

  // === ROULETTE QUESTS ===
  lucky_spinner: {
    id: 'lucky_spinner',
    name: 'Feeling Lucky',
    description: 'Spin the roulette 5 times',
    icon: '🎰',
    objective: { type: 'roulette_spins', target: 5 },
    rewards: { coins: 100 },
  },
  gambler: {
    id: 'gambler',
    name: 'High Roller',
    description: 'Spin the roulette 25 times',
    icon: '🎲',
    objective: { type: 'roulette_spins', target: 25 },
    rewards: { coins: 300, seeds: 10 },
    prerequisite: 'lucky_spinner',
  },
  casino_owner: {
    id: 'casino_owner',
    name: 'Casino Tycoon',
    description: 'Spin the roulette 100 times',
    icon: '🎩',
    objective: { type: 'roulette_spins', target: 100 },
    rewards: { coins: 1000, seeds: 50 },
    prerequisite: 'gambler',
  },

  // === UPGRADE QUESTS ===
  improver: {
    id: 'improver',
    name: 'Improver',
    description: 'Buy 5 Upgrades',
    icon: '🔧',
    objective: { type: 'upgrades_purchased', target: 5 },
    rewards: { coins: 50 },
  },
  tech_enthusiast: {
    id: 'tech_enthusiast',
    name: 'Tech Enthusiast',
    description: 'Buy 20 Upgrades',
    icon: '⚙️',
    objective: { type: 'upgrades_purchased', target: 20 },
    rewards: { coins: 200, seeds: 5 },
    prerequisite: 'improver',
  },
  optimization: {
    id: 'optimization',
    name: 'Max Optimization',
    description: 'Buy 100 Upgrades',
    icon: '🚀',
    objective: { type: 'upgrades_purchased', target: 100 },
    rewards: { coins: 1000, seeds: 50 },
    prerequisite: 'tech_enthusiast',
  },

  // === LAB QUESTS ===
  scientist: {
    id: 'scientist',
    name: 'Mad Scientist',
    description: 'Create 1 Custom Tree in Lab',
    icon: '🧪',
    objective: { type: 'lab_trees_created', target: 1 },
    rewards: { coins: 500, seeds: 20 }, // Refund some seeds
  },
  geneticist: {
    id: 'geneticist',
    name: 'Master Geneticist',
    description: 'Create 5 Custom Trees',
    icon: '🧬',
    objective: { type: 'lab_trees_created', target: 5 },
    rewards: { coins: 2000, seeds: 100 },
    prerequisite: 'scientist',
  },

  // === EXTREME ENERGY ===
  energy_millionaire: {
    id: 'energy_millionaire',
    name: 'Energy Millionaire',
    description: 'Collect 1,000,000 Energy',
    icon: '🔋',
    objective: { type: 'total_energy', target: 1000000 },
    rewards: { coins: 5000, seeds: 200 },
    prerequisite: 'infinite_power',
  },
  energy_god: {
    id: 'energy_god',
    name: 'Energy God',
    description: 'Collect 10,000,000 Energy',
    icon: '⚡',
    objective: { type: 'total_energy', target: 10000000 },
    rewards: { coins: 50000, seeds: 1000 },
    prerequisite: 'energy_millionaire',
  },

  growing_strong: {
    id: 'growing_strong',
    name: 'Growing Strong',
    description: 'Grow any tree to height 100',
    icon: '📏',
    objective: { type: 'tree_height', target: 100 },
    rewards: { coins: 50, seeds: 5 },
    prerequisite: 'first_tap',
  },
  energy_collector: {
    id: 'energy_collector',
    name: 'Energy Collector',
    description: 'Collect 500 total energy',
    icon: '⚡',
    objective: { type: 'total_energy', target: 500 },
    rewards: { coins: 75, seeds: 8 },
  },

  // === OAK TREE QUESTS ===
  oak_level_5: {
    id: 'oak_level_5',
    name: 'Oak Apprentice',
    description: 'Level Oak Tree to level 5',
    icon: '🌳',
    objective: { type: 'specific_tree_level', target: 5, treeId: 'oak' },
    rewards: { coins: 60, seeds: 6 },
    prerequisite: 'growing_strong',
  },
  oak_level_10: {
    id: 'oak_level_10',
    name: 'Oak Master',
    description: 'Level Oak Tree to level 10',
    icon: '🌳',
    objective: { type: 'specific_tree_level', target: 10, treeId: 'oak' },
    rewards: { coins: 150, seeds: 15 },
    prerequisite: 'oak_level_5',
  },

  // === INTERMEDIATE ===
  tap_enthusiast: {
    id: 'tap_enthusiast',
    name: 'Tap Enthusiast',
    description: 'Tap 200 times',
    icon: '✋',
    objective: { type: 'tap_count', target: 200 },
    rewards: { coins: 80, seeds: 5 },
    prerequisite: 'getting_started',
  },
  tall_tree: {
    id: 'tall_tree',
    name: 'Tall Tree',
    description: 'Grow a tree to height 200',
    icon: '🌲',
    objective: { type: 'tree_height', target: 200 },
    rewards: { coins: 100, seeds: 10 },
    prerequisite: 'growing_strong',
  },
  energy_surge: {
    id: 'energy_surge',
    name: 'Energy Surge',
    description: 'Collect 2000 total energy',
    icon: '🔋',
    objective: { type: 'total_energy', target: 2000 },
    rewards: { coins: 120, seeds: 12 },
    prerequisite: 'energy_collector',
  },
  first_unlock: {
    id: 'first_unlock',
    name: 'New Species',
    description: 'Unlock a second tree species',
    icon: '🔓',
    objective: { type: 'unlock_species', target: 2 },
    rewards: { coins: 100, seeds: 10 },
  },
  level_5: {
    id: 'level_5',
    name: 'Level 5',
    description: 'Level up any tree to level 5',
    icon: '⭐',
    objective: { type: 'tree_level', target: 5 },
    rewards: { coins: 80, seeds: 8 },
  },

  // === PINE TREE QUESTS ===
  pine_level_5: {
    id: 'pine_level_5',
    name: 'Pine Pioneer',
    description: 'Level Pine Tree to level 5',
    icon: '🌲',
    objective: { type: 'specific_tree_level', target: 5, treeId: 'pine' },
    rewards: { coins: 70, seeds: 7 },
    prerequisite: 'first_unlock',
  },
  pine_level_10: {
    id: 'pine_level_10',
    name: 'Pine Guardian',
    description: 'Level Pine Tree to level 10',
    icon: '🌲',
    objective: { type: 'specific_tree_level', target: 10, treeId: 'pine' },
    rewards: { coins: 160, seeds: 16 },
    prerequisite: 'pine_level_5',
  },

  // === MAPLE TREE QUESTS ===
  maple_level_5: {
    id: 'maple_level_5',
    name: 'Maple Keeper',
    description: 'Level Maple Tree to level 5',
    icon: '🍁',
    objective: { type: 'specific_tree_level', target: 5, treeId: 'maple' },
    rewards: { coins: 80, seeds: 8 },
    prerequisite: 'collector',
  },
  maple_level_10: {
    id: 'maple_level_10',
    name: 'Autumn Lord',
    description: 'Level Maple Tree to level 10',
    icon: '🍁',
    objective: { type: 'specific_tree_level', target: 10, treeId: 'maple' },
    rewards: { coins: 180, seeds: 18 },
    prerequisite: 'maple_level_5',
  },

  // === ADVANCED ===
  tap_master: {
    id: 'tap_master',
    name: 'Tap Master',
    description: 'Tap 500 times',
    icon: '🏅',
    objective: { type: 'tap_count', target: 500 },
    rewards: { coins: 150, seeds: 15 },
    prerequisite: 'tap_enthusiast',
  },
  sky_high: {
    id: 'sky_high',
    name: 'Sky High',
    description: 'Grow a tree to height 400',
    icon: '☁️',
    objective: { type: 'tree_height', target: 400 },
    rewards: { coins: 200, seeds: 20 },
    prerequisite: 'tall_tree',
  },
  master_growth: {
    id: 'master_growth',
    name: 'Master Grower',
    description: 'Level any tree to level 10',
    icon: '🏆',
    objective: { type: 'tree_level', target: 10 },
    rewards: { coins: 200, seeds: 25 },
    prerequisite: 'level_5',
  },
  collector: {
    id: 'collector',
    name: 'Collector',
    description: 'Unlock 3 different tree species',
    icon: '🌳',
    objective: { type: 'unlock_species', target: 3 },
    rewards: { coins: 150, seeds: 20 },
    prerequisite: 'first_unlock',
  },
  energy_master: {
    id: 'energy_master',
    name: 'Energy Master',
    description: 'Collect 10000 total energy',
    icon: '💡',
    objective: { type: 'total_energy', target: 10000 },
    rewards: { coins: 300, seeds: 30 },
    prerequisite: 'energy_surge',
  },

  // === CHERRY TREE QUESTS ===
  cherry_level_5: {
    id: 'cherry_level_5',
    name: 'Blossom Lover',
    description: 'Level Cherry Blossom to level 5',
    icon: '🌸',
    objective: { type: 'specific_tree_level', target: 5, treeId: 'cherry' },
    rewards: { coins: 100, seeds: 10 },
    prerequisite: 'collector',
  },
  cherry_level_10: {
    id: 'cherry_level_10',
    name: 'Sakura Master',
    description: 'Level Cherry Blossom to level 10',
    icon: '🌸',
    objective: { type: 'specific_tree_level', target: 10, treeId: 'cherry' },
    rewards: { coins: 250, seeds: 25 },
    prerequisite: 'cherry_level_5',
  },

  // === BAOBAB TREE QUESTS ===
  baobab_level_5: {
    id: 'baobab_level_5',
    name: 'Ancient Seeker',
    description: 'Level Baobab Tree to level 5',
    icon: '🌴',
    objective: { type: 'specific_tree_level', target: 5, treeId: 'baobab' },
    rewards: { coins: 150, seeds: 15 },
    prerequisite: 'tree_master',
  },
  baobab_level_10: {
    id: 'baobab_level_10',
    name: 'Elder Guardian',
    description: 'Level Baobab Tree to level 10',
    icon: '🌴',
    objective: { type: 'specific_tree_level', target: 10, treeId: 'baobab' },
    rewards: { coins: 400, seeds: 40 },
    prerequisite: 'baobab_level_5',
  },

  // === EXPERT ===
  tap_legend: {
    id: 'tap_legend',
    name: 'Tap Legend',
    description: 'Tap 2000 times',
    icon: '👑',
    objective: { type: 'tap_count', target: 2000 },
    rewards: { coins: 400, seeds: 40 },
    prerequisite: 'tap_master',
  },
  tree_master: {
    id: 'tree_master',
    name: 'Tree Master',
    description: 'Unlock all 5 tree species',
    icon: '🌟',
    objective: { type: 'unlock_species', target: 5 },
    rewards: { coins: 500, seeds: 50 },
    prerequisite: 'collector',
  },
  level_max: {
    id: 'level_max',
    name: 'Maximum Power',
    description: 'Level any tree to level 15',
    icon: '💎',
    objective: { type: 'tree_level', target: 15 },
    rewards: { coins: 500, seeds: 50 },
    prerequisite: 'master_growth',
  },
  giant_tree: {
    id: 'giant_tree',
    name: 'Giant Tree',
    description: 'Grow a tree to height 1000',
    icon: '🗼',
    objective: { type: 'tree_height', target: 1000 },
    rewards: { coins: 600, seeds: 60 },
    prerequisite: 'sky_high',
  },
  ultimate: {
    id: 'ultimate',
    name: 'Ultimate Grower',
    description: 'Level any tree to level 20',
    icon: '🎯',
    objective: { type: 'tree_level', target: 20 },
    rewards: { coins: 1000, seeds: 100 },
    prerequisite: 'level_max',
  },

  // === NEW PROGRESSION QUESTS ===
  tap_apprentice: {
    id: 'tap_apprentice',
    name: 'Tap Apprentice',
    description: 'Tap 3000 times',
    icon: '🥊',
    objective: { type: 'tap_count', target: 3000 },
    rewards: { coins: 500, seeds: 50 },
    prerequisite: 'tap_legend',
  },
  tap_grandmaster: {
    id: 'tap_grandmaster',
    name: 'Tap Grandmaster',
    description: 'Tap 5000 times',
    icon: '🏆',
    objective: { type: 'tap_count', target: 5000 },
    rewards: { coins: 800, seeds: 80 },
    prerequisite: 'tap_apprentice',
  },

  // === HEIGHT CHALLENGES ===
  towering_oak: {
    id: 'towering_oak',
    name: 'Towering Oak',
    description: 'Grow Oak to height 500',
    icon: '🏔️',
    objective: { type: 'tree_height', target: 500, treeId: 'oak' },
    rewards: { coins: 200, seeds: 20 },
    prerequisite: 'oak_level_10',
  },
  cherry_peak: {
    id: 'cherry_peak',
    name: 'Cherry Peak',
    description: 'Grow Cherry to height 600',
    icon: '🗻',
    objective: { type: 'tree_height', target: 600, treeId: 'cherry' },
    rewards: { coins: 250, seeds: 25 },
    prerequisite: 'cherry_level_10',
  },
  ancient_heights: {
    id: 'ancient_heights',
    name: 'Ancient Heights',
    description: 'Grow Baobab to height 700',
    icon: '🪨',
    objective: { type: 'tree_height', target: 700, treeId: 'baobab' },
    rewards: { coins: 300, seeds: 30 },
    prerequisite: 'baobab_level_10',
  },

  // === ENERGY MILESTONES ===
  power_plant: {
    id: 'power_plant',
    name: 'Power Plant',
    description: 'Collect 25000 total energy',
    icon: '🔋',
    objective: { type: 'total_energy', target: 25000 },
    rewards: { coins: 600, seeds: 60 },
    prerequisite: 'energy_master',
  },
  energy_titan: {
    id: 'energy_titan',
    name: 'Energy Titan',
    description: 'Collect 50000 total energy',
    icon: '⚡',
    objective: { type: 'total_energy', target: 50000 },
    rewards: { coins: 1000, seeds: 100 },
    prerequisite: 'power_plant',
  },
  infinite_power: {
    id: 'infinite_power',
    name: 'Infinite Power',
    description: 'Collect 100000 total energy',
    icon: '🌟',
    objective: { type: 'total_energy', target: 100000 },
    rewards: { coins: 2000, seeds: 200 },
    prerequisite: 'energy_titan',
  },

  // === ADVANCED TREE LEVELS ===
  oak_mastery: {
    id: 'oak_mastery',
    name: 'Oak Mastery',
    description: 'Level Oak to 15',
    icon: '🌳',
    objective: { type: 'specific_tree_level', target: 15, treeId: 'oak' },
    rewards: { coins: 400, seeds: 40 },
    prerequisite: 'oak_level_10',
  },
  cherry_mastery: {
    id: 'cherry_mastery',
    name: 'Cherry Mastery',
    description: 'Level Cherry to 15',
    icon: '🌸',
    objective: { type: 'specific_tree_level', target: 15, treeId: 'cherry' },
    rewards: { coins: 500, seeds: 50 },
    prerequisite: 'cherry_level_10',
  },

  // === EXTREME CHALLENGES ===
  mega_tree: {
    id: 'mega_tree',
    name: 'Mega Tree',
    description: 'Grow any tree to height 2000',
    icon: '🌌',
    objective: { type: 'tree_height', target: 2000 },
    rewards: { coins: 1200, seeds: 120 },
    prerequisite: 'giant_tree',
  },
  legendary_grower: {
    id: 'legendary_grower',
    name: 'Legendary Grower',
    description: 'Level any tree to 25',
    icon: '👑',
    objective: { type: 'tree_level', target: 25 },
    rewards: { coins: 1500, seeds: 150 },
    prerequisite: 'ultimate',
  },
  cosmic_tree: {
    id: 'cosmic_tree',
    name: 'Cosmic Tree',
    description: 'Grow any tree to height 5000',
    icon: '🪐',
    objective: { type: 'tree_height', target: 5000 },
    rewards: { coins: 3000, seeds: 300 },
    prerequisite: 'mega_tree',
  },
  tap_deity: {
    id: 'tap_deity',
    name: 'Tap Deity',
    description: 'Tap 10000 times',
    icon: '✨',
    objective: { type: 'tap_count', target: 10000 },
    rewards: { coins: 2000, seeds: 200 },
    prerequisite: 'tap_grandmaster',
  },

};

export const getAllQuests = (): Quest[] => Object.values(QUESTS);

export const getAvailableQuests = (completedQuestIds: string[]): Quest[] => {
  return getAllQuests().filter(quest => {
    if (completedQuestIds.includes(quest.id)) return false;
    if (quest.prerequisite && !completedQuestIds.includes(quest.prerequisite)) return false;
    return true;
  });
};
