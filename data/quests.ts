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
    | 'lab_trees_created' // NEW
    | 'telegram_join';    // NEW
    target: number;
    treeId?: string;
    rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  };

  rewards: {
    coins?: number;
    gems?: number;
    energy?: number;
  };

  prerequisite?: string;
}

export const QUESTS: Record<string, Quest> = {


  // Replaced by multiple separate chunks for precision, but applying a batch replacement logic
  // ACTUALLY, multi_replace_file_content is better for non-contiguous.
  // I will start replacing Category by Category.

  // Starting Quest
  tutorial_upgrade: {
    id: 'tutorial_upgrade',
    name: 'First Upgrade',
    description: 'Buy your first upgrade',
    icon: 'quest_upgrade',
    objective: { type: 'upgrades_purchased', target: 1 },
    rewards: { coins: 50 },
  },
  getting_started: {
    id: 'getting_started',
    name: 'Getting Started',
    description: 'Tap the tree 50 times',
    icon: 'quest_cursor',
    objective: { type: 'tap_count', target: 50 },
    rewards: { coins: 40, gems: 2 },
  },

  // === ROULETTE QUESTS ===
  lucky_spinner: {
    id: 'lucky_spinner',
    name: 'Feeling Lucky',
    description: 'Spin the roulette 5 times',
    icon: 'quest_roulette',
    objective: { type: 'roulette_spins', target: 5 },
    rewards: { coins: 100 },
  },
  gambler: {
    id: 'gambler',
    name: 'High Roller',
    description: 'Spin the roulette 25 times',
    icon: 'quest_roulette',
    objective: { type: 'roulette_spins', target: 25 },
    rewards: { coins: 300, gems: 5 },
    prerequisite: 'lucky_spinner',
  },
  casino_owner: {
    id: 'casino_owner',
    name: 'Casino Tycoon',
    description: 'Spin the roulette 100 times',
    icon: 'quest_roulette',
    objective: { type: 'roulette_spins', target: 100 },
    rewards: { coins: 1000, gems: 20 },
    prerequisite: 'gambler',
  },

  // === UPGRADE QUESTS ===
  improver: {
    id: 'improver',
    name: 'Improver',
    description: 'Buy 5 Upgrades',
    icon: 'quest_upgrade',
    objective: { type: 'upgrades_purchased', target: 5 },
    rewards: { coins: 50 },
  },
  tech_enthusiast: {
    id: 'tech_enthusiast',
    name: 'Tech Enthusiast',
    description: 'Buy 20 Upgrades',
    icon: 'quest_upgrade',
    objective: { type: 'upgrades_purchased', target: 20 },
    rewards: { coins: 200, gems: 3 },
    prerequisite: 'improver',
  },
  optimization: {
    id: 'optimization',
    name: 'Max Optimization',
    description: 'Buy 100 Upgrades',
    icon: 'quest_upgrade',
    objective: { type: 'upgrades_purchased', target: 100 },
    rewards: { coins: 1000, gems: 20 },
    prerequisite: 'tech_enthusiast',
  },

  // === LAB QUESTS ===
  lab_common_1: {
    id: 'lab_common_1',
    name: 'Lab Beginner',
    description: 'Create 1 Common tree in the Lab',
    icon: 'lab_grey',
    objective: { type: 'lab_trees_created', target: 1, rarity: 'common' },
    rewards: { coins: 500, gems: 7 },
  },
  lab_common_5: {
    id: 'lab_common_5',
    name: 'Common Researcher',
    description: 'Create 5 Common trees in the Lab',
    icon: 'lab_grey',
    objective: { type: 'lab_trees_created', target: 5, rarity: 'common' },
    rewards: { coins: 2000, gems: 25 },
    prerequisite: 'lab_common_1',
  },
  lab_rare_1: {
    id: 'lab_rare_1',
    name: 'Rare Discovery',
    description: 'Create 1 Rare tree in the Lab',
    icon: 'lab_blue',
    objective: { type: 'lab_trees_created', target: 1, rarity: 'rare' },
    rewards: { coins: 1000, gems: 13 },
  },
  lab_rare_5: {
    id: 'lab_rare_5',
    name: 'Rare Specialist',
    description: 'Create 5 Rare trees in the Lab',
    icon: 'lab_blue',
    objective: { type: 'lab_trees_created', target: 5, rarity: 'rare' },
    rewards: { coins: 4000, gems: 65 },
    prerequisite: 'lab_rare_1',
  },
  lab_epic_1: {
    id: 'lab_epic_1',
    name: 'Epic Breakthrough',
    description: 'Create 1 Epic tree in the Lab',
    icon: 'lab_purple',
    objective: { type: 'lab_trees_created', target: 1, rarity: 'epic' },
    rewards: { coins: 2500, gems: 32 },
  },
  lab_epic_5: {
    id: 'lab_epic_5',
    name: 'Epic Architect',
    description: 'Create 5 Epic trees in the Lab',
    icon: 'lab_purple',
    objective: { type: 'lab_trees_created', target: 5, rarity: 'epic' },
    rewards: { coins: 10000, gems: 130 },
    prerequisite: 'lab_epic_1',
  },
  lab_legendary_1: {
    id: 'lab_legendary_1',
    name: 'Legendary Creation',
    description: 'Create 1 Legendary tree in the Lab',
    icon: 'lab_yellow',
    objective: { type: 'lab_trees_created', target: 1, rarity: 'legendary' },
    rewards: { coins: 5000, gems: 75 },
  },
  lab_legendary_5: {
    id: 'lab_legendary_5',
    name: 'God of Biology',
    description: 'Create 5 Legendary trees in the Lab',
    icon: 'lab_yellow',
    objective: { type: 'lab_trees_created', target: 5, rarity: 'legendary' },
    rewards: { coins: 25000, gems: 320 },
    prerequisite: 'lab_legendary_1',
  },

  // === EXTREME ENERGY ===
  energy_millionaire: {
    id: 'energy_millionaire',
    name: 'Energy Millionaire',
    description: 'Collect 1,000,000 Energy',
    icon: 'quest_energy',
    objective: { type: 'total_energy', target: 1000000 },
    rewards: { coins: 5000, gems: 65 },
    prerequisite: 'infinite_power',
  },
  energy_god: {
    id: 'energy_god',
    name: 'Energy God',
    description: 'Collect 10,000,000 Energy',
    icon: 'quest_energy',
    objective: { type: 'total_energy', target: 10000000 },
    rewards: { coins: 50000, gems: 320 },
    prerequisite: 'energy_millionaire',
  },

  growing_strong: {
    id: 'growing_strong',
    name: 'Growing Strong',
    description: 'Grow any tree to height 100',
    icon: 'quest_height',
    objective: { type: 'tree_height', target: 100 },
    rewards: { coins: 50, gems: 3 },
    prerequisite: 'tutorial_upgrade',
  },
  energy_collector: {
    id: 'energy_collector',
    name: 'Energy Collector',
    description: 'Collect 500 total energy',
    icon: 'quest_energy',
    objective: { type: 'total_energy', target: 500 },
    rewards: { coins: 75, gems: 3 },
  },

  // === OAK TREE QUESTS ===
  oak_level_5: {
    id: 'oak_level_5',
    name: 'Oak Apprentice',
    description: 'Level Oak Tree to level 5',
    icon: 'tree_oak',
    objective: { type: 'specific_tree_level', target: 5, treeId: 'oak' },
    rewards: { coins: 60, gems: 3 },
  },
  oak_level_10: {
    id: 'oak_level_10',
    name: 'Oak Master',
    description: 'Level Oak Tree to level 10',
    icon: 'tree_oak',
    objective: { type: 'specific_tree_level', target: 10, treeId: 'oak' },
    rewards: { coins: 150, gems: 7 },
    prerequisite: 'oak_level_5',
  },

  // === INTERMEDIATE ===
  tap_enthusiast: {
    id: 'tap_enthusiast',
    name: 'Tap Enthusiast',
    description: 'Tap 200 times',
    icon: 'quest_cursor',
    objective: { type: 'tap_count', target: 200 },
    rewards: { coins: 80, gems: 3 },
    prerequisite: 'getting_started',
  },
  tall_tree: {
    id: 'tall_tree',
    name: 'Tall Tree',
    description: 'Grow a tree to height 200',
    icon: 'quest_height',
    objective: { type: 'tree_height', target: 200 },
    rewards: { coins: 100, gems: 4 },
    prerequisite: 'growing_strong',
  },
  energy_surge: {
    id: 'energy_surge',
    name: 'Energy Surge',
    description: 'Collect 2000 total energy',
    icon: 'quest_energy',
    objective: { type: 'total_energy', target: 2000 },
    rewards: { coins: 120, gems: 5 },
    prerequisite: 'energy_collector',
  },
  first_unlock: {
    id: 'first_unlock',
    name: 'New Species',
    description: 'Unlock a second tree species',
    icon: 'quest_unlock',
    objective: { type: 'unlock_species', target: 2 },
    rewards: { coins: 100, gems: 4 },
  },
  level_5: {
    id: 'level_5',
    name: 'Level 5',
    description: 'Level up any tree to level 5',
    icon: 'icon_gem', // Star icon replacement
    objective: { type: 'tree_level', target: 5 },
    rewards: { coins: 80, gems: 3 },
  },

  // === PINE TREE QUESTS ===
  pine_level_5: {
    id: 'pine_level_5',
    name: 'Pine Pioneer',
    description: 'Level Pine Tree to level 5',
    icon: 'tree_pine',
    objective: { type: 'specific_tree_level', target: 5, treeId: 'pine' },
    rewards: { coins: 70, gems: 3 },
  },
  pine_level_10: {
    id: 'pine_level_10',
    name: 'Pine Guardian',
    description: 'Level Pine Tree to level 10',
    icon: 'tree_pine',
    objective: { type: 'specific_tree_level', target: 10, treeId: 'pine' },
    rewards: { coins: 160, gems: 7 },
    prerequisite: 'pine_level_5',
  },
  pine_level_15: {
    id: 'pine_level_15',
    name: 'Pine Mastery',
    description: 'Level Pine Tree to level 15',
    icon: 'tree_pine',
    objective: { type: 'specific_tree_level', target: 15, treeId: 'pine' },
    rewards: { coins: 400, gems: 15 },
    prerequisite: 'pine_level_10',
  },

  // === MAPLE TREE QUESTS ===
  maple_level_5: {
    id: 'maple_level_5',
    name: 'Maple Keeper',
    description: 'Level Maple Tree to level 5',
    icon: 'tree_maple',
    objective: { type: 'specific_tree_level', target: 5, treeId: 'maple' },
    rewards: { coins: 80, gems: 3 },
  },
  maple_level_10: {
    id: 'maple_level_10',
    name: 'Autumn Lord',
    description: 'Level Maple Tree to level 10',
    icon: 'tree_maple',
    objective: { type: 'specific_tree_level', target: 10, treeId: 'maple' },
    rewards: { coins: 180, gems: 8 },
    prerequisite: 'maple_level_5',
  },
  maple_level_15: {
    id: 'maple_level_15',
    name: 'Maple Mastery',
    description: 'Level Maple Tree to level 15',
    icon: 'tree_maple',
    objective: { type: 'specific_tree_level', target: 15, treeId: 'maple' },
    rewards: { coins: 450, gems: 20 },
    prerequisite: 'maple_level_10',
  },

  // === ADVANCED ===
  tap_master: {
    id: 'tap_master',
    name: 'Tap Master',
    description: 'Tap 500 times',
    icon: 'quest_cursor',
    objective: { type: 'tap_count', target: 500 },
    rewards: { coins: 150, gems: 7 },
    prerequisite: 'tap_enthusiast',
  },
  sky_high: {
    id: 'sky_high',
    name: 'Sky High',
    description: 'Grow a tree to height 400',
    icon: 'quest_height',
    objective: { type: 'tree_height', target: 400 },
    rewards: { coins: 200, gems: 8 },
    prerequisite: 'tall_tree',
  },
  master_growth: {
    id: 'master_growth',
    name: 'Master Grower',
    description: 'Level any tree to level 10',
    icon: 'icon_gem',
    objective: { type: 'tree_level', target: 10 },
    rewards: { coins: 200, gems: 10 },
    prerequisite: 'level_5',
  },
  collector: {
    id: 'collector',
    name: 'Collector',
    description: 'Unlock 3 different tree species',
    icon: 'quest_unlock',
    objective: { type: 'unlock_species', target: 3 },
    rewards: { coins: 150, gems: 9 },
    prerequisite: 'first_unlock',
  },
  energy_master: {
    id: 'energy_master',
    name: 'Energy Master',
    description: 'Collect 10000 total energy',
    icon: 'quest_energy',
    objective: { type: 'total_energy', target: 10000 },
    rewards: { coins: 300, gems: 13 },
    prerequisite: 'energy_surge',
  },

  // === CHERRY TREE QUESTS ===
  cherry_level_5: {
    id: 'cherry_level_5',
    name: 'Blossom Lover',
    description: 'Level Cherry Blossom to level 5',
    icon: 'tree_cherry',
    objective: { type: 'specific_tree_level', target: 5, treeId: 'cherry' },
    rewards: { coins: 100, gems: 4 },
  },
  cherry_level_10: {
    id: 'cherry_level_10',
    name: 'Sakura Master',
    description: 'Level Cherry Blossom to level 10',
    icon: 'tree_cherry',
    objective: { type: 'specific_tree_level', target: 10, treeId: 'cherry' },
    rewards: { coins: 250, gems: 10 },
    prerequisite: 'cherry_level_5',
  },

  // === BAOBAB TREE QUESTS ===
  baobab_level_5: {
    id: 'baobab_level_5',
    name: 'Ancient Seeker',
    description: 'Level Baobab Tree to level 5',
    icon: 'tree_baobab',
    objective: { type: 'specific_tree_level', target: 5, treeId: 'baobab' },
    rewards: { coins: 150, gems: 7 },
  },
  // === MONEY TREE QUESTS ===
  money_level_5: {
    id: 'money_level_5',
    name: 'Wealthy Roots',
    description: 'Level Money Tree to level 5',
    icon: 'tree_money',
    objective: { type: 'specific_tree_level', target: 5, treeId: 'money' },
    rewards: { coins: 200, gems: 8 },
  },
  money_level_10: {
    id: 'money_level_10',
    name: 'Golden branches',
    description: 'Level Money Tree to level 10',
    icon: 'tree_money',
    objective: { type: 'specific_tree_level', target: 10, treeId: 'money' },
    rewards: { coins: 500, gems: 20 },
    prerequisite: 'money_level_5',
  },
  money_level_15: {
    id: 'money_level_15',
    name: 'Fortune Master',
    description: 'Level Money Tree to level 15',
    icon: 'tree_money',
    objective: { type: 'specific_tree_level', target: 15, treeId: 'money' },
    rewards: { coins: 1200, gems: 40 },
    prerequisite: 'money_level_10',
  },
  baobab_level_10: {
    id: 'baobab_level_10',
    name: 'Elder Guardian',
    description: 'Level Baobab Tree to level 10',
    icon: 'tree_baobab',
    objective: { type: 'specific_tree_level', target: 10, treeId: 'baobab' },
    rewards: { coins: 400, gems: 15 },
    prerequisite: 'baobab_level_5',
  },
  baobab_level_15: {
    id: 'baobab_level_15',
    name: 'Baobab Mastery',
    description: 'Level Baobab Tree to level 15',
    icon: 'tree_baobab',
    objective: { type: 'specific_tree_level', target: 15, treeId: 'baobab' },
    rewards: { coins: 800, gems: 32 },
    prerequisite: 'baobab_level_10',
  },

  // === EXPERT ===
  tap_legend: {
    id: 'tap_legend',
    name: 'Tap Legend',
    description: 'Tap 2000 times',
    icon: 'quest_cursor',
    objective: { type: 'tap_count', target: 2000 },
    rewards: { coins: 400, gems: 15 },
    prerequisite: 'tap_master',
  },
  tree_master: {
    id: 'tree_master',
    name: 'Tree Master',
    description: 'Unlock all 5 tree species',
    icon: 'quest_unlock',
    objective: { type: 'unlock_species', target: 5 },
    rewards: { coins: 500, gems: 20 },
    prerequisite: 'collector',
  },
  level_max: {
    id: 'level_max',
    name: 'Maximum Power',
    description: 'Level any tree to level 15',
    icon: 'icon_gem',
    objective: { type: 'tree_level', target: 15 },
    rewards: { coins: 500, gems: 20 },
    prerequisite: 'master_growth',
  },
  giant_tree: {
    id: 'giant_tree',
    name: 'Giant Tree',
    description: 'Grow a tree to height 1000',
    icon: 'quest_height',
    objective: { type: 'tree_height', target: 1000 },
    rewards: { coins: 600, gems: 25 },
    prerequisite: 'sky_high',
  },
  ultimate: {
    id: 'ultimate',
    name: 'Ultimate Grower',
    description: 'Level any tree to level 20',
    icon: 'icon_gem',
    objective: { type: 'tree_level', target: 20 },
    rewards: { coins: 1000, gems: 40 },
    prerequisite: 'level_max',
  },

  // === NEW PROGRESSION QUESTS ===
  tap_apprentice: {
    id: 'tap_apprentice',
    name: 'Tap Apprentice',
    description: 'Tap 3000 times',
    icon: 'quest_cursor',
    objective: { type: 'tap_count', target: 3000 },
    rewards: { coins: 500, gems: 20 },
    prerequisite: 'tap_legend',
  },
  tap_grandmaster: {
    id: 'tap_grandmaster',
    name: 'Tap Grandmaster',
    description: 'Tap 5000 times',
    icon: 'quest_cursor',
    objective: { type: 'tap_count', target: 5000 },
    rewards: { coins: 800, gems: 32 },
    prerequisite: 'tap_apprentice',
  },

  // === HEIGHT CHALLENGES ===
  towering_oak: {
    id: 'towering_oak',
    name: 'Towering Oak',
    description: 'Grow Oak to height 500',
    icon: 'quest_height',
    objective: { type: 'tree_height', target: 500, treeId: 'oak' },
    rewards: { coins: 200, gems: 8 },
    prerequisite: 'oak_level_10',
  },
  cherry_peak: {
    id: 'cherry_peak',
    name: 'Cherry Peak',
    description: 'Grow Cherry to height 600',
    icon: 'quest_height',
    objective: { type: 'tree_height', target: 600, treeId: 'cherry' },
    rewards: { coins: 250, gems: 10 },
    prerequisite: 'cherry_level_10',
  },
  ancient_heights: {
    id: 'ancient_heights',
    name: 'Ancient Heights',
    description: 'Grow Baobab to height 700',
    icon: 'quest_height',
    objective: { type: 'tree_height', target: 700, treeId: 'baobab' },
    rewards: { coins: 300, gems: 13 },
    prerequisite: 'baobab_level_10',
  },

  // === ENERGY MILESTONES ===
  power_plant: {
    id: 'power_plant',
    name: 'Power Plant',
    description: 'Collect 25000 total energy',
    icon: 'quest_energy',
    objective: { type: 'total_energy', target: 25000 },
    rewards: { coins: 600, gems: 25 },
    prerequisite: 'energy_master',
  },
  energy_titan: {
    id: 'energy_titan',
    name: 'Energy Titan',
    description: 'Collect 50000 total energy',
    icon: 'quest_energy',
    objective: { type: 'total_energy', target: 50000 },
    rewards: { coins: 1000, gems: 40 },
    prerequisite: 'power_plant',
  },
  infinite_power: {
    id: 'infinite_power',
    name: 'Infinite Power',
    description: 'Collect 100000 total energy',
    icon: 'quest_energy',
    objective: { type: 'total_energy', target: 100000 },
    rewards: { coins: 2000, gems: 75 },
    prerequisite: 'energy_titan',
  },

  // === ADVANCED TREE LEVELS ===
  oak_mastery: {
    id: 'oak_mastery',
    name: 'Oak Mastery',
    description: 'Level Oak to 15',
    icon: 'tree_oak',
    objective: { type: 'specific_tree_level', target: 15, treeId: 'oak' },
    rewards: { coins: 400, gems: 15 },
    prerequisite: 'oak_level_10',
  },
  cherry_mastery: {
    id: 'cherry_mastery',
    name: 'Cherry Mastery',
    description: 'Level Cherry to 15',
    icon: 'tree_cherry',
    objective: { type: 'specific_tree_level', target: 15, treeId: 'cherry' },
    rewards: { coins: 500, gems: 20 },
    prerequisite: 'cherry_level_10',
  },

  // === EXTREME CHALLENGES ===
  mega_tree: {
    id: 'mega_tree',
    name: 'Mega Tree',
    description: 'Grow any tree to height 2000',
    icon: 'quest_height',
    objective: { type: 'tree_height', target: 2000 },
    rewards: { coins: 1200, gems: 50 },
    prerequisite: 'giant_tree',
  },
  legendary_grower: {
    id: 'legendary_grower',
    name: 'Legendary Grower',
    description: 'Level any tree to 25',
    icon: 'icon_gem',
    objective: { type: 'tree_level', target: 25 },
    rewards: { coins: 1500, gems: 65 },
    prerequisite: 'ultimate',
  },
  cosmic_tree: {
    id: 'cosmic_tree',
    name: 'Cosmic Tree',
    description: 'Grow any tree to height 5000',
    icon: 'quest_height',
    objective: { type: 'tree_height', target: 5000 },
    rewards: { coins: 3000, gems: 130 },
    prerequisite: 'mega_tree',
  },
  tap_deity: {
    id: 'tap_deity',
    name: 'Tap Deity',
    description: 'Tap 10000 times',
    icon: 'quest_cursor',
    objective: { type: 'tap_count', target: 10000 },
    rewards: { coins: 2000, gems: 75 },
    prerequisite: 'tap_grandmaster',
  },

  // === SOCIAL QUESTS ===
  telegram_official: {
    id: 'telegram_official',
    name: 'Join Community',
    description: 'Join our Telegram Channel',
    icon: 'icon_gem', // We will handle this in UI if needed
    objective: { type: 'telegram_join', target: 1 },
    rewards: { coins: 500, gems: 20 },
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
