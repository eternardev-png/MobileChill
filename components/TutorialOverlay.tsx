import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, useWindowDimensions, Modal } from 'react-native';
import { useGame } from '../gameState';

export const TutorialOverlay: React.FC<{ visible: boolean }> = ({ visible }) => {
    const { width, height } = useWindowDimensions();
    const { state, advanceTutorial } = useGame();
    const { tutorialStep } = state;

    if (!visible || tutorialStep === 0 || tutorialStep >= 13) return null;

    return (
        <View style={styles.container} pointerEvents="box-none">
            {/* Step 1: Tap Tree */}
            {tutorialStep === 1 && (
                <View style={[styles.pointerContainer, { top: height * 0.4, left: width * 0.5 - 100 }]}>
                    <Text style={styles.text}>👆 Tap the Tree to get Power Points!</Text>
                    <View style={styles.arrowDown} />
                </View>
            )}

            {/* Step 2: Open Shop */}
            {tutorialStep === 2 && (
                <View style={[styles.pointerContainer, { bottom: 85, left: width * (1.5 / 6) - 100, width: 200 }]}>
                    <Text style={styles.text}>🛒 Buy Upgrades here!</Text>
                    <View style={styles.arrowDown} />
                </View>
            )}

            {/* Step 5: Open Quests */}
            {tutorialStep === 5 && (
                <View style={[styles.pointerContainer, { bottom: 85, left: width * (2.5 / 6) - 100, width: 200 }]}>
                    <Text style={styles.text}>📜 Open Quests!</Text>
                    <View style={styles.arrowDown} />
                </View>
            )}

            {/* Step 8: Open Prestige */}
            {tutorialStep === 8 && (
                <View style={[styles.pointerContainer, { bottom: 85, left: width * (3.5 / 6) - 100, width: 200 }]}>
                    <Text style={styles.text}>✨ Prestige Menu!</Text>
                    <View style={styles.arrowDown} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 999,
        elevation: 999, // Ensure it's on top of everything
    },
    pointerContainer: {
        position: 'absolute',
        alignItems: 'center',
        width: 200,
    },
    text: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 8,
    },
    arrowDown: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 15,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#fff',
        marginVertical: 5,
    },
    arrowUp: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 15,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#fff',
        marginVertical: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#1a1a1a',
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#a855f7',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#a855f7',
        marginBottom: 16,
    },
    modalText: {
        color: '#ccc',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    highlight: {
        color: '#fff',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#a855f7',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 25,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
