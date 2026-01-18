import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text, Dimensions, ImageBackground, Platform } from 'react-native';
import { useGame, GameProvider } from './gameState';
import { GameHUD } from './components/GameHUD';
import { Tree } from './components/Tree';
import { UpgradeShop } from './components/UpgradeShop';
import { CollectionScreen } from './components/CollectionScreen';
import { CasinoMenu } from './components/CasinoMenu';
import { PrestigeShop } from './components/PrestigeShop';
import { QuestPanel } from './components/QuestPanel';
import { WelcomeScreen } from './components/WelcomeScreen';
import { TreeLab } from './components/TreeLab';
import { OfflineProgressModal } from './components/OfflineProgressModal';
import { TutorialOverlay } from './components/TutorialOverlay';
import {
    ShopIcon,
    TreeIcon,
    SettingsIcon,
    QuestIcon,
    PrestigeIcon,
    LabIcon,
    CasinoIcon,
} from './components/Icons';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { GlobalStyles } from './components/GlobalStyles';
import { telegram } from './telegram';

const { width, height } = Dimensions.get('window');



const GameContent = () => {
    const { state, saveGame, loadGame, resetGame, addResources, getClaimableQuestsCount, advanceTutorial } = useGame();
    const [activeTab, setActiveTab] = useState<'shop' | 'tree' | 'quests' | 'collection' | 'prestige' | 'lab' | 'casino'>('tree');
    const [showWelcome, setShowWelcome] = useState(true);
    const [offlineEarnings, setOfflineEarnings] = useState<{ money: number, energy: number } | null>(null);


    // Loading and initialization logic...
    useEffect(() => {
        // Disable pinch-zoom on web
        if (Platform.OS === 'web') {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.getElementsByTagName('head')[0].appendChild(meta);
        }

        const checkSave = async () => {
            const saved = await telegram.cloudLoad('mobilechill_save');
            if (!saved) {
                setShowWelcome(true);
            } else {
                try {
                    const parsed = JSON.parse(saved);
                    setShowWelcome(false);
                    const now = Date.now();
                    const timeDiff = (now - (parsed.lastSaveTime || now)) / 1000;
                    if (timeDiff > 60) {
                        // Calculate offline earnings (simplified for brevity)
                    }
                } catch (e) {
                    setShowWelcome(true);
                }
            }
        };
        checkSave();
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
        if (state.tutorialStep === 0) {
            advanceTutorial(1); // Start tutorial: Step 1 (Tap Tree)
        }
    };

    return (
        <View style={styles.container}>
            {/* StatusBar removed for Telegram */}
            <TutorialOverlay visible={activeTab === 'tree' || ![1, 2, 5, 8].includes(state.tutorialStep)} />

            {/* Main Game Area */}
            <SafeAreaView style={styles.gameArea}>
                <GameHUD />

                <View style={styles.canvasContainer}>
                    <Tree />
                </View>
            </SafeAreaView>

            {/* Navigation Bar - Always visible */}
            <View style={styles.navbar}>
                {/* Collection */}
                {(() => {
                    const isUnlocked = state.tutorialStep >= 13;
                    return (
                        <TouchableOpacity
                            style={[styles.navItem, activeTab === 'collection' && styles.navItemActive, !isUnlocked && { opacity: 0.3 }]}
                            onPress={() => {
                                if (!isUnlocked) return;
                                telegram.haptic('light');
                                if (activeTab === 'collection') setActiveTab('tree');
                                else setActiveTab('collection');
                            }}
                            disabled={!isUnlocked}
                        >
                            <View style={styles.collectionIconWrapper}>
                                <View style={[styles.collectionIconRow, { marginBottom: 2 }]}>
                                    <View style={[styles.collectionDot, { backgroundColor: isUnlocked ? '#22c55e' : '#444' }]} />
                                    <View style={[styles.collectionDot, { backgroundColor: isUnlocked ? '#3b82f6' : '#444' }]} />
                                </View>
                                <View style={styles.collectionIconRow}>
                                    <View style={[styles.collectionDot, { backgroundColor: isUnlocked ? '#a855f7' : '#444' }]} />
                                    <View style={[styles.collectionDot, { backgroundColor: isUnlocked ? '#f59e0b' : '#444' }]} />
                                </View>
                            </View>
                            <Text style={[styles.navText, activeTab === 'collection' && styles.navTextActive]}>Collection</Text>
                        </TouchableOpacity>
                    );
                })()}

                {/* Shop */}
                {(() => {
                    const isUnlocked = (state.tutorialStep === 2 || state.tutorialStep === 3 || state.tutorialStep === 4 || state.tutorialStep >= 13);
                    return (
                        <TouchableOpacity
                            style={[styles.navItem, activeTab === 'shop' && styles.navItemActive, !isUnlocked && { opacity: 0.3 }]}
                            onPress={() => {
                                if (!isUnlocked) return;
                                telegram.haptic('light');
                                if (activeTab === 'shop') setActiveTab('tree');
                                else {
                                    setActiveTab('shop');
                                    if (state.tutorialStep === 2) advanceTutorial(3);
                                }
                            }}
                            disabled={!isUnlocked}
                        >
                            <ShopIcon size={24} color={!isUnlocked ? '#444' : (activeTab === 'shop' ? '#4ade80' : '#888')} />
                            <Text style={[styles.navText, activeTab === 'shop' && styles.navTextActive]}>Shop</Text>
                        </TouchableOpacity>
                    );
                })()}

                {/* Quests */}
                {(() => {
                    const isUnlocked = (state.tutorialStep === 5 || state.tutorialStep === 6 || state.tutorialStep === 7 || state.tutorialStep >= 13);
                    return (
                        <TouchableOpacity
                            style={[styles.navItem, activeTab === 'quests' && styles.navItemActive, !isUnlocked && { opacity: 0.3 }]}
                            onPress={() => {
                                if (!isUnlocked) return;
                                telegram.haptic('light');
                                if (activeTab === 'quests') setActiveTab('tree');
                                else {
                                    setActiveTab('quests');
                                    if (state.tutorialStep === 5) advanceTutorial(6);
                                }
                            }}
                            disabled={!isUnlocked}
                        >
                            <View style={styles.questIconWrapper}>
                                <QuestIcon size={24} color={!isUnlocked ? '#444' : (activeTab === 'quests' ? '#4ade80' : '#888')} />
                                {isUnlocked && getClaimableQuestsCount() > 0 && (
                                    <View style={styles.navQuestBadge} />
                                )}
                            </View>
                            <Text style={[styles.navText, activeTab === 'quests' && styles.navTextActive]}>Quests</Text>
                        </TouchableOpacity>
                    );
                })()}

                {/* Prestige */}
                {(() => {
                    const isUnlocked = (state.tutorialStep >= 8);
                    return (
                        <TouchableOpacity
                            style={[styles.navItem, activeTab === 'prestige' && styles.navItemActive, !isUnlocked && { opacity: 0.3 }]}
                            onPress={() => {
                                if (!isUnlocked) return;
                                telegram.haptic('light');
                                if (activeTab === 'prestige') setActiveTab('tree');
                                else {
                                    setActiveTab('prestige');
                                    if (state.tutorialStep === 8) advanceTutorial(9);
                                }
                            }}
                            disabled={!isUnlocked}
                        >
                            <PrestigeIcon size={24} color={!isUnlocked ? '#444' : (activeTab === 'prestige' ? '#4ade80' : '#888')} />
                            <Text style={[styles.navText, activeTab === 'prestige' && styles.navTextActive]}>Prestige</Text>
                        </TouchableOpacity>
                    );
                })()}

                {/* Lab */}
                {(() => {
                    const isUnlocked = state.tutorialStep >= 13;
                    return (
                        <TouchableOpacity
                            style={[styles.navItem, activeTab === 'lab' && styles.navItemActive, !isUnlocked && { opacity: 0.3 }]}
                            onPress={() => {
                                if (!isUnlocked) return;
                                telegram.haptic('light');
                                if (activeTab === 'lab') setActiveTab('tree');
                                else setActiveTab('lab');
                            }}
                            disabled={!isUnlocked}
                        >
                            <LabIcon size={24} color={!isUnlocked ? '#444' : (activeTab === 'lab' ? '#a855f7' : '#888')} />
                            <Text style={[styles.navText, activeTab === 'lab' && styles.navTextColored]}>Lab</Text>
                        </TouchableOpacity>
                    );
                })()}

                {/* Casino */}
                {(() => {
                    const isUnlocked = state.tutorialStep >= 13;
                    return (
                        <TouchableOpacity
                            style={[styles.navItem, activeTab === 'casino' && styles.navItemActive, !isUnlocked && { opacity: 0.3 }]}
                            onPress={() => {
                                if (!isUnlocked) return;
                                telegram.haptic('light');
                                if (activeTab === 'casino') setActiveTab('tree');
                                else setActiveTab('casino');
                            }}
                            disabled={!isUnlocked}
                        >
                            <CasinoIcon size={24} color={!isUnlocked ? '#444' : (activeTab === 'casino' ? '#fbbf24' : '#888')} />
                            <Text style={[styles.navText, activeTab === 'casino' && { color: '#fbbf24' }]}>Casino</Text>
                        </TouchableOpacity>
                    );
                })()}
            </View>

            {/* Overlays */}
            {activeTab === 'shop' && (
                <View style={styles.overlayContainer}>
                    <UpgradeShop onClose={() => {
                        setActiveTab('tree');
                        if (state.tutorialStep === 4) advanceTutorial(5); // Step 4 (Close Shop) -> 5 (Open Quests)
                    }} />
                </View>
            )}

            {activeTab === 'collection' && (
                <CollectionScreen onClose={() => setActiveTab('tree')} />
            )}

            {activeTab === 'prestige' && (
                <View style={styles.overlayContainer}>
                    <PrestigeShop onClose={() => {
                        setActiveTab('tree');
                        if (state.tutorialStep === 12) advanceTutorial(13); // Step 12 (Close Prestige) -> 13 (Done)
                    }} />
                </View>
            )}

            {activeTab === 'quests' && (
                <QuestPanel onClose={() => {
                    setActiveTab('tree');
                    if (state.tutorialStep === 7) advanceTutorial(8); // Step 7 (Close Quests) -> 8 (Open Prestige)
                }} />
            )}

            {activeTab === 'lab' && (
                <TreeLab onClose={() => setActiveTab('tree')} />
            )}

            {activeTab === 'casino' && (
                <CasinoMenu onClose={() => setActiveTab('tree')} />
            )}

            {showWelcome && <WelcomeScreen onStart={handleCloseWelcome} />}
            {offlineEarnings && <OfflineProgressModal earnings={offlineEarnings} onClose={() => setOfflineEarnings(null)} />}
        </View>
    );
};

export default function App() {
    return (
        <GameProvider>
            <GlobalStyles />
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

});
