import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CoinIcon, EnergyIcon } from './Icons';

interface OfflineProgressModalProps {
    earnings: { money: number; energy: number };
    onClose: () => void;
}

export const OfflineProgressModal: React.FC<OfflineProgressModalProps> = ({ earnings, onClose }) => {
    return (
        <View style={styles.overlay}>
            <View style={styles.modal}>
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>While you were away, your trees produced:</Text>

                <View style={styles.earningsContainer}>
                    <View style={styles.earningItem}>
                        <CoinIcon size={24} />
                        <Text style={[styles.earningValue, { color: '#fbbf24' }]}>+{Math.floor(earnings.money)}</Text>
                    </View>
                    <View style={styles.earningItem}>
                        <EnergyIcon size={24} />
                        <Text style={[styles.earningValue, { color: '#eab308' }]}>+{Math.floor(earnings.energy)}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.collectButton} onPress={onClose}>
                    <Text style={styles.collectButtonText}>Collect</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 900,
    },
    modal: {
        width: '85%',
        maxWidth: 400,
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 24,
        textAlign: 'center',
    },
    earningsContainer: {
        flexDirection: 'row',
        gap: 32,
        marginBottom: 32,
    },
    earningItem: {
        alignItems: 'center',
        gap: 8,
    },
    earningValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    collectButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
    },
    collectButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
