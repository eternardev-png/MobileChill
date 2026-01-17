import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text, Dimensions, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useGame, GameProvider } from './gameState';
import { GameHUD } from './components/GameHUD';
import { Tree } from './components/Tree';
import { UpgradeShop } from './components/UpgradeShop';
import { CollectionScreen } from './components/CollectionScreen';
import { RouletteWheel } from './components/RouletteWheel';
import { PrestigeShop } from './components/PrestigeShop';
import { QuestPanel } from './components/QuestPanel';
import { WelcomeScreen } from './components/WelcomeScreen';
import { TreeLab } from './components/TreeLab';
import { OfflineProgressModal } from './components/OfflineProgressModal';
import {
    ShopIcon,
    TreeIcon,
    SettingsIcon,
    QuestIcon,
    PrestigeIcon,
    LabIcon,
} from './components/Icons';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { GlobalStyles } from './components/GlobalStyles';

const { width, height } = Dimensions.get('window');

// Background glow for roulette button
const RouletteGlow = () => (
    <Svg height="60" width="60" style={styles.rouletteGlow}>
        <Defs>
            <RadialGradient id="grad" cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
                <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </RadialGradient>
        </Defs>
        <Circle cx="30" cy="30" r="30" fill="url(#grad)" />
    </Svg>
);

const GameContent = () => {
    const { state, saveGame, loadGame, resetGame, addResources, getClaimableQuestsCount } = useGame();
    const [activeTab, setActiveTab] = useState<'shop' | 'tree' | 'quests' | 'collection' | 'prestige' | 'lab'>('tree');
    const [showWelcome, setShowWelcome] = useState(false);
    const [offlineEarnings, setOfflineEarnings] = useState<{ money: number, energy: number } | null>(null);
    const [showRoulette, setShowRoulette] = useState(false);


    // Loading and initialization logic...
    useEffect(() => {
        // Check for existing save on mount
        const saved = localStorage.getItem('mobilechill_save');
        if (!saved) {
            setShowWelcome(true);
        } else {
            try {
                const parsed = JSON.parse(saved);
                const now = Date.now();
                const timeDiff = (now - (parsed.lastSaveTime || now)) / 1000;
                if (timeDiff > 60) {
                    // Calculate offline earnings (simplified for brevity)
                }
            } catch (e) {
                setShowWelcome(true);
            }
        }
    }, []);


    // Save loop
    useEffect(() => {
        const interval = setInterval(saveGame, 10000);
        return () => clearInterval(interval);
    }, [state, saveGame]);

    const handleReset = async () => {
        await resetGame();
        setShowWelcome(true);
    };

    const handleCloseWelcome = () => {
        setShowWelcome(false);
        addResources(0, 0); // Trigger initial save
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Main Game Area */}
            <SafeAreaView style={styles.gameArea}>
                <GameHUD />

                <View style={styles.canvasContainer}>
                    <Tree />
                </View>

                {/* Roulette button - floating in top right corner, JUST THE ICON with glow */}
                <TouchableOpacity style={styles.rouletteButton} onPress={() => setShowRoulette(true)}>
                    <View style={styles.rouletteButtonContent}>
                        <RouletteGlow />
                        <Text style={styles.rouletteEmoji}>🎰</Text>
                    </View>
                </TouchableOpacity>


            </SafeAreaView>

            {/* Navigation Bar */}
            <View style={styles.navbar}>
                <TouchableOpacity
                    style={[styles.navItem, activeTab === 'collection' && styles.navItemActive]}
                    onPress={() => setActiveTab('collection')}
                >
                    <View style={styles.collectionIconWrapper}>
                        <View style={[styles.collectionIconRow, { marginBottom: 2 }]}>
                            <View style={[styles.collectionDot, { backgroundColor: '#22c55e' }]} />
                            <View style={[styles.collectionDot, { backgroundColor: '#3b82f6' }]} />
                        </View>
                        <View style={styles.collectionIconRow}>
                            <View style={[styles.collectionDot, { backgroundColor: '#a855f7' }]} />
                            <View style={[styles.collectionDot, { backgroundColor: '#f59e0b' }]} />
                        </View>
                    </View>
                    <Text style={[styles.navText, activeTab === 'collection' && styles.navTextActive]}>Collection</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.navItem, activeTab === 'shop' && styles.navItemActive]}
                    onPress={() => setActiveTab('shop')}
                >
                    <ShopIcon size={24} color={activeTab === 'shop' ? '#4ade80' : '#888'} />
                    <Text style={[styles.navText, activeTab === 'shop' && styles.navTextActive]}>Shop</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.navItem, activeTab === 'quests' && styles.navItemActive]}
                    onPress={() => setActiveTab('quests')}
                >
                    <View style={styles.questIconWrapper}>
                        <QuestIcon size={24} color={activeTab === 'quests' ? '#4ade80' : '#888'} />
                        {getClaimableQuestsCount() > 0 && (
                            <View style={styles.navQuestBadge} />
                        )}
                    </View>
                    <Text style={[styles.navText, activeTab === 'quests' && styles.navTextActive]}>Quests</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.navItem, activeTab === 'prestige' && styles.navItemActive]}
                    onPress={() => setActiveTab('prestige')}
                >
                    <PrestigeIcon size={24} color={activeTab === 'prestige' ? '#4ade80' : '#888'} />
                    <Text style={[styles.navText, activeTab === 'prestige' && styles.navTextActive]}>Prestige</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.navItem, activeTab === 'lab' && styles.navItemActive]}
                    onPress={() => setActiveTab('lab')}
                >
                    <LabIcon size={24} color={activeTab === 'lab' ? '#a855f7' : '#888'} />
                    <Text style={[styles.navText, activeTab === 'lab' && styles.navTextColored]}>Lab</Text>
                </TouchableOpacity>
            </View>

            {/* Overlays */}
            {activeTab === 'shop' && (
                <View style={styles.overlayContainer}>
                    <UpgradeShop onClose={() => setActiveTab('tree')} />
                </View>
            )}

            {activeTab === 'collection' && (
                <CollectionScreen onClose={() => setActiveTab('tree')} />
            )}

            {activeTab === 'prestige' && (
                <View style={styles.overlayContainer}>
                    <PrestigeShop onClose={() => setActiveTab('tree')} />
                </View>
            )}

            {activeTab === 'quests' && (
                <QuestPanel onClose={() => setActiveTab('tree')} />
            )}

            {activeTab === 'lab' && (
                <TreeLab onClose={() => setActiveTab('tree')} />
            )}
            {showRoulette && <RouletteWheel onClose={() => setShowRoulette(false)} />}
            {showWelcome && <WelcomeScreen onStart={handleCloseWelcome} />}
            {offlineEarnings && <OfflineProgressModal earnings={offlineEarnings} onClose={() => setOfflineEarnings(null)} />}
        </View>
    );
};

export default function App() {
    return (
        <GameProvider>
            <GlobalStyles />
            <StatusBar style="light" />
            <GameContent />
        </GameProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111',
    },
    gameArea: {
        flex: 1,
        position: 'relative',
    },
    canvasContainer: {
        flex: 1,
        zIndex: 0,
    },
    navbar: {
        flexDirection: 'row',
        backgroundColor: '#1a1a1a',
        paddingBottom: 20,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#333',
        justifyContent: 'space-around',
        zIndex: 20,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    navItemActive: {
        // Active state style
    },
    navText: {
        color: '#888',
        fontSize: 10,
        marginTop: 4,
        fontWeight: '600',
    },
    navTextActive: {
        color: '#4ade80',
    },
    navTextColored: {
        color: '#a855f7',
    },
    treeIconWrapper: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    questIconWrapper: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    navQuestBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ef4444',
        borderWidth: 1,
        borderColor: '#1a1a1a',
    },
    collectionIconWrapper: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    collectionIconRow: {
        flexDirection: 'row',
        gap: 2,
    },
    collectionDot: {
        width: 8,
        height: 8,
        borderRadius: 2,
    },
    overlayContainer: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 50,
    },
    questButton: {
        position: 'absolute',
        top: 100, // Below HUD
        left: 16,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#333',
        zIndex: 10,
    },
    questBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#ef4444',
        borderWidth: 2,
        borderColor: '#1a1a1a',
    },
    rouletteButton: {
        position: 'absolute',
        top: 130,
        right: 30,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    rouletteButtonContent: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    rouletteGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        transform: [{ scale: 1.2 }],
    },
    rouletteEmoji: {
        fontSize: 32,
        zIndex: 2,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});
