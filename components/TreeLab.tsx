import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Svg, { Line, Defs, RadialGradient, Stop, Circle, G, Path } from 'react-native-svg';
import { useGame } from '../gameState';
import { TreeSpecies } from '../data/treeSpecies';
import { GemIcon, GrowthRateIcon, CoinIcon, EnergyIcon, TimeIcon } from './Icons';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

interface TreeLabProps {
    onClose: () => void;
}

// Reuse MiniTree logic for Preview
const LabTreePreview: React.FC<{ settings: any }> = ({ settings }) => {
    const size = 300; // Increased size
    const centerX = size / 2;
    const startY = size - 40; // Reduced padding from bottom
    const baseLength = 50; // Slightly larger base length

    // Test Growth Simulation
    // Scale maxDepth based on 'testLevel' (1-50)
    const { hueStart, hueEnd, branchCount, asymmetry,
        spreadAngle, decay, curvature, gravity, testLevel } = settings;

    // Use a simpler depth calc to ensure visibility at low levels
    // Level 1: depth 3, Level 50: depth 10
    const maxDepth = Math.min(10, 3 + Math.floor(testLevel / 7));

    // Scale visual size but keep it reasonable
    // Don't shrink too much at start, don't explode at end
    const growthScale = 0.8 + (testLevel / 100) * 0.4;

    // Use numeric asymmetry directly (slider value 0-1)
    const asymmetryFactor = typeof asymmetry === 'number' ? asymmetry : 0.2;

    const generateBranches = (x1: number, y1: number, angle: number, length: number, depth: number, branchPath: string = 'root'): JSX.Element[] => {
        if (depth > maxDepth || length < 2) return [];

        const x2 = x1 + length * Math.sin((angle * Math.PI) / 180);
        const y2 = y1 - length * Math.cos((angle * Math.PI) / 180);

        // Color Interpolation
        const t = depth / 10;
        const currentHue = hueStart + (hueEnd - hueStart) * t;
        const strokeColor = `hsl(${currentHue}, 80%, ${30 + t * 40}%)`;

        const branches: JSX.Element[] = [
            <Line
                key={branchPath}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={strokeColor}
                strokeWidth={Math.max(1, (maxDepth - depth + 1) * 1.5)} // Removed scale from width to keep lines visible
                strokeLinecap="round"
            />
        ];

        // Deterministic Chaos
        let hash = 0;
        for (let i = 0; i < branchPath.length; i++) {
            hash = ((hash << 5) - hash) + branchPath.charCodeAt(i);
            hash |= 0;
        }
        const seed = Math.sin(hash);

        // Physics & Structure Math
        const currentAngle = spreadAngle || 30;
        const currentDecay = decay || 0.7;
        const gravEffect = (gravity || 0) * (depth * 2);
        const curveEffect = (curvature || 0) * depth;

        const newLen = length * currentDecay;
        const count = branchCount;
        const sector = currentAngle * 2;
        const step = count > 1 ? sector / (count - 1) : 0;
        const startParamsAngle = angle - currentAngle + curveEffect;

        for (let i = 0; i < count; i++) {
            const asym = asymmetryFactor * seed * (10 * (i + 1));
            let targetAngle = startParamsAngle + (step * i);
            targetAngle += gravEffect;
            branches.push(...generateBranches(x2, y2, targetAngle + asym, newLen, depth + 1, `${branchPath}-${i}`));
        }

        return branches;
    };

    // Center the Group and apply scale from the bottom-center anchor point
    return (
        <View style={{ overflow: 'hidden', width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size}>
                <Defs>
                    <RadialGradient id="lab-glow" cx="50%" cy="80%">
                        <Stop offset="0%" stopColor={`hsl(${hueStart}, 80%, 50%)`} stopOpacity="0.4" />
                        <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </RadialGradient>
                </Defs>
                <Circle cx={centerX} cy={startY} r={60} fill="url(#lab-glow)" />

                {/* Anchor scaling to the tree base (centerX, startY) */}
                <G transform={`translate(${centerX}, ${startY}) scale(${growthScale}) translate(${-centerX}, ${-startY})`}>
                    {generateBranches(centerX, startY, 0, baseLength, 0)}
                </G>
            </Svg>
        </View>
    );
};

// Parameter Slider Component
const ParamSlider: React.FC<{ label: string; value: number; onChange: (v: number) => void; icon?: React.ReactNode; min?: number; max?: number; step?: number; suffix?: string; colorScale?: boolean }> = ({ label, value, onChange, icon, min = 0.5, max = 2.0, step = 0.1, suffix = "x", colorScale = true }) => (
    <View style={styles.sliderRow}>
        <View style={styles.sliderLabelContainer}>
            {icon}
            <Text style={styles.sliderLabel}>{label}</Text>
        </View>
        <Slider
            style={{ width: 140, height: 40 }}
            minimumValue={min}
            maximumValue={max}
            step={step}
            value={value}
            onValueChange={onChange}
            minimumTrackTintColor={colorScale ? (value > 1 ? "#ef4444" : "#22c55e") : "#a855f7"}
            maximumTrackTintColor="#333"
            thumbTintColor="#fff"
        />
        <Text style={[styles.sliderValue, { color: colorScale ? (value > 1 ? '#ef4444' : '#22c55e') : '#fff' }]}>{value.toFixed(1)}{suffix}</Text>
    </View>
);

// Accordion Section Component
const AccordionSection: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void }> = ({ title, children, isOpen, onToggle }) => (
    <View style={styles.accordionContainer}>
        <TouchableOpacity style={styles.accordionHeader} onPress={onToggle}>
            <Text style={styles.accordionTitle}>{title}</Text>
            <Text style={styles.accordionArrow}>{isOpen ? '▼' : '▶'}</Text>
        </TouchableOpacity>
        {isOpen && <View style={styles.accordionContent}>{children}</View>}
    </View>
);

export const TreeLab: React.FC<TreeLabProps> = ({ onClose }) => {
    const { state, createCustomTree } = useGame();

    // Lab State
    const [hueStart, setHueStart] = useState(120);
    const [hueEnd, setHueEnd] = useState(300);

    // Structure State (Sliders)
    const [branchCount, setBranchCount] = useState(2); // Slider 2-5
    const [asymmetry, setAsymmetry] = useState(0.2); // Slider 0-1 (was 'low'|'med'|'high')

    // Structural DNA 2.0
    const [spreadAngle, setSpreadAngle] = useState(30);
    const [decay, setDecay] = useState(0.7);
    const [curvature, setCurvature] = useState(0);
    const [gravity, setGravity] = useState(0);
    const [testLevel, setTestLevel] = useState(20);

    // Multipliers
    const [growthMult, setGrowthMult] = useState(1.0);
    const [coinMult, setCoinMult] = useState(1.0);
    const [energyMult, setEnergyMult] = useState(1.0);
    const [timeMult, setTimeMult] = useState(1.0);
    const [cost, setCost] = useState(150);

    // Accordion State
    const [activeSection, setActiveSection] = useState<'colors' | 'structure' | 'bonuses' | null>('structure');

    const toggleSection = (section: 'colors' | 'structure' | 'bonuses') => {
        setActiveSection(prev => prev === section ? null : section);
    };

    // Color Palette
    const HUES = [
        0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165,
        180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345
    ];

    useEffect(() => {
        let newCost = 50; // Base

        // Multiplier analysis for exponential scale
        const multipliers = [growthMult, coinMult, energyMult, timeMult];
        const positiveMultipliers = multipliers.filter(m => m > 1);

        const calcFactor = (val: number) => {
            if (val > 1) {
                // Exponential increase for values > 1
                return Math.pow(val, 2.5) * 100 - 100;
            }
            if (val < 1) {
                // Linear decrease for values < 1
                return (val - 1) * 80;
            }
            return 0;
        };

        let bonusTotal = calcFactor(growthMult) + calcFactor(coinMult) + calcFactor(energyMult) + calcFactor(timeMult);

        // Extra penalty for stacking multiple positive buffs
        if (positiveMultipliers.length > 1) {
            bonusTotal *= Math.pow(1.5, positiveMultipliers.length);
        }

        newCost += bonusTotal;

        // Structure costs
        newCost += (branchCount - 2) * 50; // +50 per extra branch
        if (decay > 0.8) newCost += 50; // Increased
        if (asymmetry > 0.5) newCost += 30; // Increased

        setCost(Math.max(10, Math.round(newCost)));
    }, [growthMult, coinMult, energyMult, timeMult, branchCount, decay, asymmetry]);

    // Rarity Calculation based on Cost
    const getRarity = (costVal: number): 'common' | 'rare' | 'epic' | 'legendary' => {
        if (costVal >= 550) return 'legendary';
        if (costVal >= 350) return 'epic';
        if (costVal >= 150) return 'rare';
        return 'common';
    };

    const currentRarity = getRarity(cost);
    const rarityColors = { common: '#a3a3a3', rare: '#3b82f6', epic: '#a855f7', legendary: '#eab308' };

    const handleSynthesize = () => {
        if (state.gems < cost) return;

        const rarity = getRarity(cost);

        const description = `Genetically modified specimen.\nGrowth: ${growthMult}x | Coins: ${coinMult}x\nEnergy: ${energyMult}x | Time: ${timeMult}x`;
        const emoji = 'quest_lab';

        const newTree: Omit<TreeSpecies, 'id' | 'unlockCost'> = {
            name: `Specimen #${Math.floor(Math.random() * 9000) + 1000}`,
            emoji,
            description,
            rarity,
            baseColor: { hue: hueStart, saturation: 80, lightness: 40 },
            gradientStart: { hue: hueStart, saturation: 80, lightness: 30 },
            gradientEnd: { hue: hueEnd, saturation: 90, lightness: 70 },
            branchAngleRange: [spreadAngle - 5, spreadAngle + 5],
            branchCount: Math.round(branchCount),
            branchLengthMultiplier: decay,
            asymmetryFactor: asymmetry,
            maxDepthBonus: rarity === 'legendary' ? 2 : (rarity === 'epic' ? 1 : 0),
            spreadAngle,
            decay,
            curvature,
            gravity,
            growthRate: growthMult,
            energyPerTap: energyMult,
            coinMultiplier: coinMult,
            timeMultiplier: timeMult,
        };

        createCustomTree(newTree, cost);
        onClose();
    };

    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <View style={[styles.header, { alignItems: 'flex-start' }]}>
                    <View>
                        <Text style={styles.title}>Tree Laboratory</Text>
                        <View style={styles.badgesRow}>
                            <View style={[styles.costBadge, cost > state.gems && styles.costBadgeRed]}>
                                <Text style={styles.costText}>{cost}</Text>
                                <GemIcon size={14} color="#fff" />
                            </View>
                            {/* Rarity Badge */}
                            <View style={[styles.rarityBadge, { backgroundColor: rarityColors[currentRarity] + '33', borderColor: rarityColors[currentRarity] }]}>
                                <Text style={[styles.rarityText, { color: rarityColors[currentRarity] }]}>{currentRarity.toUpperCase()}</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Text style={styles.closeBtnText}>✕</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>

                    {/* Preview Section */}
                    <View style={styles.previewContainer}>
                        <LabTreePreview settings={{ hueStart, hueEnd, branchCount, asymmetry, spreadAngle, decay, curvature, gravity, testLevel }} />
                        <Text style={styles.previewLabel}>PREVIEW SPECIES</Text>

                        <View style={{ width: '80%', marginTop: 20 }}>
                            <Text style={[styles.label, { width: '100%', textAlign: 'center', marginBottom: 5, color: '#888' }]}>TEST GROW LEVEL: {Math.floor(testLevel)}</Text>
                            <Slider
                                style={{ width: '100%', height: 40 }}
                                minimumValue={1} maximumValue={50} step={1}
                                value={testLevel} onValueChange={setTestLevel}
                                minimumTrackTintColor="#a855f7" maximumTrackTintColor="#333" thumbTintColor="#fff"
                            />
                        </View>
                    </View>

                    {/* Controls */}
                    <View style={styles.controlsSection}>

                        {/* COLORS Section */}
                        <AccordionSection title="COLORS" isOpen={activeSection === 'colors'} onToggle={() => toggleSection('colors')}>
                            <Text style={styles.subLabel}>START COLOR</Text>
                            <View style={styles.colorGridContainer}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorScrollContent}>
                                    <View>
                                        <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                                            {HUES.slice(0, 12).map(h => (
                                                <TouchableOpacity key={`start-${h}`} style={[styles.colorDot, { backgroundColor: `hsl(${h}, 80%, 50%)` }, hueStart === h && styles.colorSelected]} onPress={() => setHueStart(h)} />
                                            ))}
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            {HUES.slice(12).map(h => (
                                                <TouchableOpacity key={`start-${h}`} style={[styles.colorDot, { backgroundColor: `hsl(${h}, 80%, 50%)` }, hueStart === h && styles.colorSelected]} onPress={() => setHueStart(h)} />
                                            ))}
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>

                            <Text style={styles.subLabel}>END COLOR</Text>
                            <View style={styles.colorGridContainer}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorScrollContent}>
                                    <View>
                                        <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                                            {HUES.slice(0, 12).map(h => (
                                                <TouchableOpacity key={`end-${h}`} style={[styles.colorDot, { backgroundColor: `hsl(${h}, 80%, 50%)` }, hueEnd === h && styles.colorSelected]} onPress={() => setHueEnd(h)} />
                                            ))}
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            {HUES.slice(12).map(h => (
                                                <TouchableOpacity key={`end-${h}`} style={[styles.colorDot, { backgroundColor: `hsl(${h}, 80%, 50%)` }, hueEnd === h && styles.colorSelected]} onPress={() => setHueEnd(h)} />
                                            ))}
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        </AccordionSection>

                        {/* STRUCTURE Section (Old + Advanced) */}
                        <AccordionSection title="STRUCTURE" isOpen={activeSection === 'structure'} onToggle={() => toggleSection('structure')}>
                            <ParamSlider label="Branches" value={branchCount} onChange={setBranchCount} min={2} max={6} step={1} suffix="" colorScale={false} />
                            <ParamSlider label="Wildness" value={asymmetry} onChange={setAsymmetry} min={0} max={1.0} step={0.05} suffix="" colorScale={false} />

                            <View style={styles.separator} />

                            <ParamSlider label="Spread" value={spreadAngle} onChange={setSpreadAngle} min={15} max={90} step={1} suffix="°" colorScale={false} />
                            <ParamSlider label="Decay" value={decay} onChange={setDecay} min={0.5} max={0.9} step={0.05} suffix="" colorScale={false} />
                            <ParamSlider label="Curve" value={curvature} onChange={setCurvature} min={-45} max={45} step={1} suffix="°" colorScale={false} />
                            <ParamSlider label="Gravity" value={gravity} onChange={setGravity} min={-2} max={2} step={0.1} suffix="g" colorScale={false} />
                        </AccordionSection>

                        {/* BONUSES Section */}
                        <AccordionSection title="BONUSES" isOpen={activeSection === 'bonuses'} onToggle={() => toggleSection('bonuses')}>
                            <ParamSlider label="Growth" icon={<GrowthRateIcon size={14} color="#4ade80" />} value={growthMult} onChange={setGrowthMult} />
                            <ParamSlider label="Wealth" icon={<CoinIcon size={14} color="#fbbf24" />} value={coinMult} onChange={setCoinMult} />
                            <ParamSlider label="Energy" icon={<EnergyIcon size={14} color="#facc15" />} value={energyMult} onChange={setEnergyMult} />
                            <ParamSlider label="Time" icon={<TimeIcon size={14} color="#fff" />} value={timeMult} onChange={setTimeMult} />
                        </AccordionSection>

                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.synthBtn, state.gems < cost && styles.synthBtnDisabled]}
                        onPress={handleSynthesize}
                        disabled={state.gems < cost}
                    >
                        <Text style={styles.synthBtnText}>SYNTHESIZE SPECIES</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 200,
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#111',
        paddingTop: 50, // Safe area
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
        marginBottom: 10,
    },
    badgesRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    title: { fontSize: 24, fontWeight: '900', color: '#a855f7', letterSpacing: 1 },
    costBadge: { flexDirection: 'row', backgroundColor: '#222', padding: 6, borderRadius: 8, gap: 4, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
    costBadgeRed: { borderColor: '#ef4444' },
    costText: { color: '#fff', fontWeight: 'bold' },
    rarityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, marginLeft: 10 },
    rarityText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
    closeBtn: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: '#222',
        alignItems: 'center', justifyContent: 'center',
    },
    closeBtnText: { color: '#fff', fontSize: 20 },
    content: { flex: 1 },
    previewContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30,
        backgroundColor: '#0d0d0d',
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    previewLabel: { color: '#444', fontSize: 10, letterSpacing: 2, marginTop: 10 },
    controlsSection: { padding: 20 },

    // Accordion Styles
    accordionContainer: { marginBottom: 15, backgroundColor: '#1a1a1a', borderRadius: 8, overflow: 'hidden' },
    accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#222' },
    accordionTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },
    accordionArrow: { color: '#666', fontSize: 12 },
    accordionContent: { padding: 15, backgroundColor: '#161616' },

    subLabel: { color: '#666', fontSize: 11, fontWeight: 'bold', marginBottom: 10, marginTop: 5 },

    colorGridContainer: { marginBottom: 15 },
    colorScrollContent: { paddingRight: 20 },
    colorDot: { width: 32, height: 32, borderRadius: 16, marginRight: 8, borderWidth: 2, borderColor: 'transparent' },
    colorSelected: { borderColor: '#fff', transform: [{ scale: 1.1 }] },

    controlGroup: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, justifyContent: 'flex-start', gap: 40 },
    toggleRow: { flexDirection: 'row', backgroundColor: '#222', borderRadius: 8, padding: 2 },
    toggleBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
    toggleBtnActive: { backgroundColor: '#333' },
    toggleText: { color: '#666', fontWeight: 'bold', fontSize: 12 },
    toggleTextActive: { color: '#fff' },
    label: { color: '#fff', width: 80, fontSize: 14, fontWeight: '600' },
    separator: { height: 1, backgroundColor: '#333', marginVertical: 15 },

    sliderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 12, gap: 20 },
    sliderLabelContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, width: 90 },
    sliderLabel: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    sliderValue: { fontSize: 12, fontWeight: 'bold', width: 40, textAlign: 'right' },

    footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#222' },
    synthBtn: {
        backgroundColor: '#a855f7', padding: 16, borderRadius: 12, alignItems: 'center',
        shadowColor: '#a855f7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8
    },
    synthBtnDisabled: { backgroundColor: '#444', shadowOpacity: 0 },
    synthBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
});
