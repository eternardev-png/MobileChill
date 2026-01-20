import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Switch, ScrollView, TextInput } from 'react-native';
import { useGame } from '../gameState';
import { useSound } from './SoundContext';
import { CloseIcon, SettingsIcon } from './Icons';
import { telegram } from '../telegram';
import Slider from '@react-native-community/slider';

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
    const { state, updateSettings, redeemPromoCode } = useGame();
    const { musicVolume, sfxVolume, setMusicVolume, setSfxVolume } = useSound();

    // Promo Code State
    const [promoCode, setPromoCode] = useState('');
    const [promoMessage, setPromoMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const handleRedeem = () => {
        if (!promoCode.trim()) return;

        const result = redeemPromoCode(promoCode);
        if (result.success) {
            setPromoMessage({ text: result.reward ? `${result.message} ${result.reward}` : result.message, type: 'success' });
            setPromoCode('');
        } else {
            setPromoMessage({ text: result.message, type: 'error' });
        }

        // Clear message after 3 seconds
        setTimeout(() => setPromoMessage(null), 3000);
    };

    const toggleShowWelcome = (value: boolean) => {
        telegram.haptic('light');
        updateSettings({ showWelcomeAlways: value });
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <SettingsIcon size={24} color="#fbbf24" />
                            <Text style={styles.headerTitle}>Settings</Text>
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <CloseIcon size={24} color="#888" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollContent}>
                        {/* Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>General</Text>

                            <View style={styles.settingRow}>
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingLabel}>Show Welcome Screen</Text>
                                    <Text style={styles.settingDesc}>Show the menu every time the app starts</Text>
                                </View>
                                <Switch
                                    value={state.settings?.showWelcomeAlways || false}
                                    onValueChange={toggleShowWelcome}
                                    trackColor={{ false: '#444', true: '#22c55e' }}
                                    thumbColor={state.settings?.showWelcomeAlways ? '#fff' : '#888'}
                                />
                            </View>
                        </View>

                        {/* Audio Settings */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Audio</Text>

                            <View style={styles.settingRowColumn}>
                                <View style={styles.settingHeader}>
                                    <Text style={styles.settingLabel}>Music Volume</Text>
                                    <Text style={styles.settingValue}>{Math.round(musicVolume * 100)}%</Text>
                                </View>
                                <Slider
                                    style={{ width: '100%', height: 40 }}
                                    minimumValue={0}
                                    maximumValue={1}
                                    value={musicVolume}
                                    onValueChange={setMusicVolume}
                                    minimumTrackTintColor="#a855f7"
                                    maximumTrackTintColor="#444"
                                    thumbTintColor="#fff"
                                />
                            </View>

                            <View style={styles.settingRowColumn}>
                                <View style={styles.settingHeader}>
                                    <Text style={styles.settingLabel}>SFX Volume</Text>
                                    <Text style={styles.settingValue}>{Math.round(sfxVolume * 100)}%</Text>
                                </View>
                                <Slider
                                    style={{ width: '100%', height: 40 }}
                                    minimumValue={0}
                                    maximumValue={1}
                                    value={sfxVolume}
                                    onValueChange={setSfxVolume}
                                    minimumTrackTintColor="#fbbf24"
                                    maximumTrackTintColor="#444"
                                    thumbTintColor="#fff"
                                />
                            </View>
                        </View>

                        {/* Promo Code Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Promo Code</Text>
                            <View style={styles.promoContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Code"
                                    placeholderTextColor="#666"
                                    value={promoCode}
                                    onChangeText={setPromoCode}
                                    autoCapitalize="characters"
                                />
                                <TouchableOpacity
                                    style={[styles.redeemButton, !promoCode.trim() && styles.redeemButtonDisabled]}
                                    onPress={handleRedeem}
                                    disabled={!promoCode.trim()}
                                >
                                    <Text style={styles.redeemText}>Redeem</Text>
                                </TouchableOpacity>
                            </View>
                            {promoMessage && (
                                <Text style={[
                                    styles.messageText,
                                    promoMessage.type === 'success' ? styles.successText : styles.errorText
                                ]}>
                                    {promoMessage.text}
                                </Text>
                            )}
                        </View>

                        {/* Version Info */}
                        <View style={styles.versionInfo}>
                            <Text style={styles.versionText}>MobileChill v1.3.0</Text>
                            <Text style={styles.authorText}>Developed by eternardev</Text>
                        </View>
                    </ScrollView>
                </View>
            </View >
        </Modal >
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxHeight: '70%',
        backgroundColor: '#1a1a1a',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#333',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        backgroundColor: '#222',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    closeButton: {
        padding: 4,
    },
    scrollContent: {
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: '#fbbf24',
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 16,
        opacity: 0.8,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#222',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    settingDesc: {
        color: '#888',
        fontSize: 12,
    },
    versionInfo: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
        opacity: 0.5,
    },
    versionText: {
        color: '#888',
        fontSize: 12,
        fontWeight: '600',
    },
    authorText: {
        color: '#666',
        fontSize: 10,
        marginTop: 2,
    },
    promoContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    input: {
        flex: 1,
        backgroundColor: '#222',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        color: '#fff',
        fontSize: 14,
    },
    redeemButton: {
        backgroundColor: '#22c55e',
        borderRadius: 12,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    redeemButtonDisabled: {
        backgroundColor: '#444',
        opacity: 0.5,
    },
    redeemText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    messageText: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    successText: {
        color: '#4ade80',
    },
    errorText: {
        color: '#ef4444',
    },
    settingRowColumn: {
        backgroundColor: '#222',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#333',
        marginBottom: 12,
    },
    settingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    settingValue: {
        color: '#888',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
