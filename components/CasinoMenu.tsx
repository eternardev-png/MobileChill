import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { RouletteWheel } from './RouletteWheel';
import { SlotMachine } from './SlotMachine';
import { CasinoIcon, GemIcon, SlotIcon } from './Icons';
import { useSound } from './SoundContext';

const { width } = Dimensions.get('window');

interface CasinoMenuProps {
    onClose: () => void;
}

type CasinoGame = 'menu' | 'roulette' | 'slots';

export const CasinoMenu: React.FC<CasinoMenuProps> = ({ onClose }) => {
    const [activeGame, setActiveGame] = useState<CasinoGame>('menu');
    const { playMusic, stopSfx } = useSound();

    // Helper to stop all casino SFX
    const stopCasinoSounds = () => {
        stopSfx('slot_spin');
        stopSfx('roulette_spin');
        stopSfx('roulette_win');
    };

    const handleClose = () => {
        stopCasinoSounds();
        onClose();
    };

    const handleBackToMenu = () => {
        stopCasinoSounds();
        setActiveGame('menu');
    };

    // Music Effect
    React.useEffect(() => {
        if (activeGame === 'slots') {
            playMusic('casino_slots');
        } else if (activeGame === 'roulette') {
            playMusic('casino_roulette');
        } else {
            // Menu
            playMusic('casino_roulette'); // Revert to lobby/roulette theme
        }
    }, [activeGame, playMusic]);

    // If a sub-game is active, render it directly
    if (activeGame === 'roulette') {
        return <RouletteWheel onClose={handleBackToMenu} />;
    }

    if (activeGame === 'slots') {
        return <SlotMachine onClose={handleBackToMenu} />;
    }

    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                    <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>CASINO</Text>
                    <GemIcon size={32} />
                </View>

                <Text style={styles.subtitle}>CHOOSE YOUR GAME</Text>

                <View style={styles.gamesContainer}>
                    {/* Roulette Option */}
                    <TouchableOpacity
                        style={styles.gameCard}
                        onPress={() => setActiveGame('roulette')}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: 'rgba(251, 191, 36, 0.2)' }]}>
                            <CasinoIcon size={40} color="#fbbf24" />
                        </View>
                        <Text style={styles.gameTitle}>FORTUNE WHEEL</Text>
                        <View style={styles.costBadge}>
                            <Text style={styles.costText}>5</Text>
                            <GemIcon size={14} color="#fff" />
                        </View>
                    </TouchableOpacity>

                    {/* Slots Option */}
                    <TouchableOpacity
                        style={styles.gameCard}
                        onPress={() => setActiveGame('slots')}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                            <SlotIcon size={40} color="#ef4444" />
                        </View>
                        <Text style={styles.gameTitle}>SLOTS</Text>
                        <View style={styles.costBadge}>
                            <Text style={styles.costText}>3</Text>
                            <GemIcon size={14} color="#fff" />
                        </View>
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
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    container: {
        width: '90%',
        maxWidth: 360,
        backgroundColor: '#1a1a1a',
        borderRadius: 32,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    closeBtn: {
        position: 'absolute',
        top: 10,
        right: 15,
        padding: 5,
        zIndex: 10,
    },
    closeBtnText: {
        color: '#666',
        fontSize: 24,
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 2,
    },
    subtitle: {
        color: '#888',
        fontSize: 14,
        marginBottom: 30,
        fontWeight: '600',
        letterSpacing: 1,
    },
    gamesContainer: {
        width: '100%',
        gap: 16,
    },
    gameCard: {
        backgroundColor: '#262626',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#404040',
        gap: 16,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#fff',
        flex: 1,
    },
    costBadge: {
        backgroundColor: '#064e3b',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#22c55e',
        gap: 4,
    },
    costText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
});
