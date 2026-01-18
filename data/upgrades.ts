export interface Upgrade {
  id: string;
  name: string;
  description: string;
  icon: string;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  effect: {
    type: 'tap_power' | 'growth_speed' | 'auto_energy' | 'auto_growth' | 'coin_multiplier' | 'auto_coin';
    baseValue: number;
    valuePerLevel: number;
  };
}

export const UPGRADES: Record<string, Upgrade> = {
  tapPower: {
    id: 'tapPower',
    name: 'Power per Tap',
    description: 'Increase power gained per tap',
    icon: 'shop_tap',
    maxLevel: 20,
    baseCost: 10,
    costMultiplier: 1.5,
    effect: { type: 'tap_power', baseValue: 1, valuePerLevel: 0.5 },
  },

  growthSpeed: {
    id: 'growthSpeed',
    name: 'Faster Growth',
    description: 'Trees grow faster in height',
    icon: 'shop_faster_growth',
    maxLevel: 15,
    baseCost: 25,
    costMultiplier: 1.6,
    effect: { type: 'growth_speed', baseValue: 1.0, valuePerLevel: 0.1 },
  },

  autoEnergy: {
    id: 'autoEnergy',
    name: 'Auto Power',
    description: 'Generate power points passively',
    icon: 'shop_auto_energy',
    maxLevel: 20,
    baseCost: 40,
    costMultiplier: 1.6,
    effect: { type: 'auto_energy', baseValue: 0, valuePerLevel: 0.1 },
  },

  autoGrowth: {
    id: 'autoGrowth',
    name: 'Auto Growth',
    description: 'Tree grows automatically',
    icon: 'shop_auto_growth',
    maxLevel: 15,
    baseCost: 60,
    costMultiplier: 1.7,
    effect: { type: 'auto_growth', baseValue: 0, valuePerLevel: 0.05 },
  },

  coinBonus: {
    id: 'coinBonus',
    name: 'Coin Multiplier',
    description: 'Earn more coins from all sources',
    icon: 'shop_coin_multiplier',
    maxLevel: 10,
    baseCost: 30,
    costMultiplier: 1.7,
    effect: { type: 'coin_multiplier', baseValue: 1.0, valuePerLevel: 0.15 },
  },

  autoCoin: {
    id: 'autoCoin',
    name: 'Gold Mine',
    description: 'Generate coins passively',
    icon: 'shop_gold_mine',
    maxLevel: 20,
    baseCost: 100,
    costMultiplier: 1.5,
    effect: { type: 'auto_coin', baseValue: 0, valuePerLevel: 0.1 },
  },
};

export const calculateUpgradeCost = (upgrade: Upgrade, currentLevel: number): number => {
  if (currentLevel >= upgrade.maxLevel) return Infinity;
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
};

export const calculateUpgradeEffect = (upgrade: Upgrade, level: number): number => {
  return upgrade.effect.baseValue + (upgrade.effect.valuePerLevel * level);
};

export const getAllUpgrades = (): Upgrade[] => Object.values(UPGRADES);
