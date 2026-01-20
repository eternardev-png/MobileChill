import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Audio } from 'expo-av';

// Migrated to expo-av for better cross-platform support (iOS/Android/Web)
// ensuring sound works reliability across devices and preventing "Autoplay prevented" errors.

interface SoundContextType {
    playMusic: (trackName: string) => void;
    playSfx: (sfxName: string) => void;
    musicVolume: number;
    sfxVolume: number;
    setMusicVolume: (vol: number) => void;
    setSfxVolume: (vol: number) => void;
    toggleMute: () => void;
    isMuted: boolean;
}

const SoundContext = createContext<SoundContextType | null>(null);

// Local Asset Mapping
const SOUNDS: Record<string, any> = {
    // MUSIC
    menu_theme: require('../assets/sounds/music_menu.mp3'),
    oak_theme: require('../assets/sounds/music_oak.mp3'),
    pine_theme: require('../assets/sounds/music_pine.mp3'),
    maple_theme: require('../assets/sounds/music_maple.mp3'),
    cherry_theme: require('../assets/sounds/music_cherry.mp3'),
    baobab_theme: require('../assets/sounds/music_baobab.mp3'),
    money_theme: require('../assets/sounds/music_money.mp3'),

    // Lab & Casino
    lab_common: require('../assets/sounds/music_lab_common.mp3'),
    lab_rare: require('../assets/sounds/music_lab_rare.mp3'),
    lab_epic: require('../assets/sounds/music_lab_epic.mp3'),
    lab_legendary: require('../assets/sounds/music_lab_legendary.mp3'),
    casino_roulette: require('../assets/sounds/music_roulette.mp3'),
    casino_slots: require('../assets/sounds/music_slots.mp3'),

    // SFX
    click: require('../assets/sounds/sfx_click.mp3'),
    success: require('../assets/sounds/sfx_success.mp3'),
    error: require('../assets/sounds/sfx_error.mp3'),
    tap: require('../assets/sounds/sfx_tap.mp3'),
    upgrade_buy: require('../assets/sounds/sfx_upgrade.mp3'),
    tree_unlock: require('../assets/sounds/sfx_unlock.mp3'),
    level_up: require('../assets/sounds/sfx_level_up.mp3'),
    quest_claim: require('../assets/sounds/sfx_quest.mp3'),
    convert_resources: require('../assets/sounds/sfx_convert.mp3'),
};

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [musicVolume, setMusicVolume] = useState(0.5);
    const [sfxVolume, setSfxVolume] = useState(1.0);
    const [isMuted, setIsMuted] = useState(false);
    const [needsInteraction, setNeedsInteraction] = useState(false);

    // Track state
    const [soundObject, setSoundObject] = useState<Audio.Sound | null>(null);
    const [currentTrackName, setCurrentTrackName] = useState<string | null>(null);

    // Initialize Audio Mode
    useEffect(() => {
        const initAudio = async () => {
            try {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    staysActiveInBackground: false,
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                });
            } catch (error) {
                console.log('Error initializing audio mode:', error);
            }
        };
        initAudio();
    }, []);

    // Update volume for active music
    useEffect(() => {
        if (soundObject) {
            soundObject.setVolumeAsync(isMuted ? 0 : musicVolume).catch(e => console.log('Volume update error', e));
            soundObject.setIsMutedAsync(isMuted).catch(e => console.log('Mute update error', e));
        }
    }, [musicVolume, isMuted, soundObject]);

    const playMusic = async (trackName: string) => {
        // If already playing this track, just return
        if (currentTrackName === trackName && soundObject) {
            const status = await soundObject.getStatusAsync();
            if (status.isLoaded && status.isPlaying) {
                return;
            }
        }

        const source = SOUNDS[trackName];
        if (!source) {
            console.warn(`[Audio] Missing music asset for ${trackName}`);
            return;
        }

        try {
            // Unload previous sound if exists
            if (soundObject) {
                await soundObject.unloadAsync();
                setSoundObject(null);
            }

            const { sound } = await Audio.Sound.createAsync(
                source,
                {
                    shouldPlay: true,
                    isLooping: true,
                    volume: isMuted ? 0 : musicVolume,
                    isMuted: isMuted,
                },
                (status) => {
                    // status update callback if needed
                }
            );

            setSoundObject(sound);
            setCurrentTrackName(trackName);
            console.log(`[Audio] Playing music: ${trackName}`);

        } catch (error) {
            // Check for specific error related to user interaction requirements
            const errStr = String(error);
            console.log(`[Audio] Playback error for ${trackName}:`, errStr);

            // "The user has not interacted with the document yet" (Web specific)
            // But expo-av on web might throw different errors. 
            // We usually can detect this via status or catch.
            if (Platform.OS === 'web' || errStr.includes('interact') || errStr.includes('NotAllowedError')) {
                setNeedsInteraction(true);
            }
        }
    };

    const playSfx = async (sfxName: string) => {
        if (isMuted || sfxVolume === 0) return;

        const source = SOUNDS[sfxName];
        if (!source) {
            console.warn(`[Audio] Missing SFX asset for ${sfxName}`);
            return;
        }

        try {
            // For SFX "fire and forget" is often best, but creates many objects.
            // A slightly better way for frequent SFX is to create and then auto-unload
            const { sound } = await Audio.Sound.createAsync(
                source,
                { shouldPlay: true, volume: sfxVolume }
            );

            // Clean up after playback
            sound.setOnPlaybackStatusUpdate(async (status) => {
                if (status.isLoaded && status.didJustFinish) {
                    await sound.unloadAsync();
                }
            });

        } catch (error) {
            console.log('SFX play failed', error);
        }
    };

    const handleUnlockAudio = async () => {
        try {
            // Play a silent or short sound to unlock context
            // We'll use the tap sound as the trigger
            const { sound } = await Audio.Sound.createAsync(SOUNDS.tap);
            await sound.playAsync();

            console.log("[Audio] Context unlocked");
            setNeedsInteraction(false);

            // Resume/Restart music if we have a track pending
            if (currentTrackName) {
                // We need to re-call playMusic because the previous attemp failed/unloaded
                playMusic(currentTrackName);
            }

            // Cleanup unlock sound
            sound.setOnPlaybackStatusUpdate(async (status) => {
                if (status.isLoaded && status.didJustFinish) {
                    await sound.unloadAsync();
                }
            });

        } catch (e) {
            console.error("[Audio] Unlock failed", e);
        }
    };

    const toggleMute = () => setIsMuted(prev => !prev);

    return (
        <SoundContext.Provider value={{
            playMusic,
            playSfx,
            musicVolume,
            sfxVolume,
            setMusicVolume,
            setSfxVolume,
            toggleMute,
            isMuted
        }}>
            {children}
            {needsInteraction && (
                <View style={styles.overlayContainer} pointerEvents="box-none">
                    <TouchableOpacity onPress={handleUnlockAudio} style={styles.unlockButton}>
                        <Text style={styles.unlockText}>🔇 Tap to Enable Sound</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SoundContext.Provider>
    );
};

const styles = StyleSheet.create({
    overlayContainer: {
        position: 'absolute',
        bottom: 80, // Above bottom bar
        right: 20,
        zIndex: 9999,
        // elevation: 5, // Elevation is Android only, but harmless here
    },
    unlockButton: {
        backgroundColor: '#fbbf24',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    unlockText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
    }
});

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) throw new Error("useSound must be used within SoundProvider");
    return context;
};
