import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, AppState } from 'react-native';
import { Audio } from 'expo-av';

interface SoundContextType {
    playMusic: (trackName: string) => void;
    playSfx: (sfxName: string) => void;
    stopSfx: (sfxName: string) => void;
    musicVolume: number;
    sfxVolume: number;
    setMusicVolume: (vol: number) => void;
    setSfxVolume: (vol: number) => void;
    toggleMute: () => void;
    isMuted: boolean;
    needsInteraction: boolean;
}

const SoundContext = createContext<SoundContextType | null>(null);

// Маппинг ресурсов (оставляем твой)
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

    // Casino Specific
    slot_spin: require('../assets/sounds/sfx_slot_spin.mp3'),
    roulette_spin: require('../assets/sounds/sfx_roulette_spin.mp3'),
    // roulette_win removed
};

// Коэффициенты громкости для выравнивания треков (0.0 - 1.0)
const TRACK_VOLUMES: Record<string, number> = {
    // Nature (ambient background) - делаем мягче
    menu_theme: 0.6,
    oak_theme: 0.6,
    pine_theme: 0.6,
    maple_theme: 0.6,
    cherry_theme: 0.6,
    baobab_theme: 0.6,
    money_theme: 0.6,
    // Lab - таинственная атмосфера
    lab_common: 0.5,
    lab_rare: 0.5,
    lab_epic: 0.5,
    lab_legendary: 0.5,
    // Casino - делаем тише, чтобы слышать звуки спинов и выигрышей
    casino_roulette: 0.4,
    casino_slots: 0.4,
};

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [musicVolume, setMusicVolume] = useState(0.5);
    const [sfxVolume, setSfxVolume] = useState(1.0);
    const [isMuted, setIsMuted] = useState(false);

    // Состояние "нужен клик" для Web/Telegram
    const [needsInteraction, setNeedsInteraction] = useState(false);

    // Audio Ducking State
    const [isDucking, setIsDucking] = useState(false);

    const soundObject = useRef<Audio.Sound | null>(null);
    const activeSfxObjects = useRef<Record<string, Audio.Sound>>({}); // Track playing SFX
    const duckingTimeout = useRef<NodeJS.Timeout | null>(null);

    const currentTrackName = useRef<string | null>(null);
    const isChangingTrack = useRef(false); // Блокировка гонки запросов

    // 1. Инициализация аудио режима
    useEffect(() => {
        const initAudio = async () => {
            try {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    staysActiveInBackground: false, // Важно для Telegram
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                });
            } catch (error) {
                console.log('Error initializing audio mode:', error);
            }
        };
        initAudio();

        // 2. Обработка сворачивания (Visibility Change для Web)
        if (Platform.OS === 'web') {
            const handleVisibilityChange = () => {
                if (document.hidden) {
                    soundObject.current?.pauseAsync();
                    // Pause all SFX too?
                } else {
                    soundObject.current?.playAsync();
                }
            };
            document.addEventListener("visibilitychange", handleVisibilityChange);
            return () => {
                document.removeEventListener("visibilitychange", handleVisibilityChange);
            };
        } else {
            // Для нативного iOS/Android
            const subscription = AppState.addEventListener('change', nextAppState => {
                if (nextAppState === 'active') {
                    soundObject.current?.playAsync();
                } else if (nextAppState.match(/inactive|background/)) {
                    soundObject.current?.pauseAsync();
                }
            });
            return () => subscription.remove();
        }
    }, []);

    // 3. Реакция на изменение громкости (с учетом Ducking)
    useEffect(() => {
        if (soundObject.current) {
            const trackMultiplier = (currentTrackName.current && TRACK_VOLUMES[currentTrackName.current])
                ? TRACK_VOLUMES[currentTrackName.current]
                : 1.0;

            // Apply Ducking: 30% volume if ducking
            const duckingMultiplier = isDucking ? 0.3 : 1.0;

            const volume = isMuted ? 0 : (musicVolume * trackMultiplier * duckingMultiplier);
            soundObject.current.setVolumeAsync(volume).catch(() => { });
            soundObject.current.setIsMutedAsync(isMuted).catch(() => { });
        }
    }, [musicVolume, isMuted, isDucking]); // React to isDucking changes

    // Stop SFX Helper
    const stopSfx = async (sfxName: string) => {
        const sound = activeSfxObjects.current[sfxName];
        if (sound) {
            try {
                await sound.stopAsync();
                await sound.unloadAsync();
            } catch (e) { /* ignore */ }
            delete activeSfxObjects.current[sfxName];
        }

        // If we stop a ducking sound, cancel ducking immediately
        if (sfxName === 'slot_spin' || sfxName === 'roulette_spin' || sfxName === 'roulette_win') {
            if (duckingTimeout.current) clearTimeout(duckingTimeout.current);
            setIsDucking(false);
        }
    };

    const playMusic = async (trackName: string) => {
        if (currentTrackName.current === trackName) return; // Уже играет
        if (isChangingTrack.current) return; // Защита от частых переключений

        isChangingTrack.current = true;
        const source = SOUNDS[trackName];

        if (!source) {
            console.warn(`[Audio] Missing music asset: ${trackName}`);
            isChangingTrack.current = false;
            return;
        }

        try {
            // Выгружаем старое
            if (soundObject.current) {
                await soundObject.current.unloadAsync();
                soundObject.current = null;
            }

            const trackMultiplier = TRACK_VOLUMES[trackName] ?? 1.0;
            // Apply ducking to initial volume too
            const duckingMultiplier = isDucking ? 0.3 : 1.0;
            const initialVolume = isMuted ? 0 : (musicVolume * trackMultiplier * duckingMultiplier);

            // Загружаем новое
            const { sound } = await Audio.Sound.createAsync(
                source,
                {
                    shouldPlay: true,
                    isLooping: true,
                    volume: initialVolume,
                    isMuted: isMuted,
                }
            );

            soundObject.current = sound;
            currentTrackName.current = trackName;
            console.log(`[Audio] Playing: ${trackName}`);

        } catch (error: any) {
            console.log(`[Audio] Error playing ${trackName}:`, error);

            // Если ошибка связана с автоплеем в браузере
            if (String(error).includes('NotAllowedError') || Platform.OS === 'web') {
                setNeedsInteraction(true);
            }
        } finally {
            isChangingTrack.current = false;
        }
    };

    const playSfx = async (sfxName: string) => {
        if (isMuted || sfxVolume === 0) return;
        const source = SOUNDS[sfxName];
        if (!source) return;

        try {
            // Ducking Logic for specific loud sounds
            if (sfxName === 'slot_spin' || sfxName === 'roulette_spin' || sfxName === 'roulette_win') {
                setIsDucking(true);
                if (duckingTimeout.current) clearTimeout(duckingTimeout.current);

                // Auto-reset ducking after expected sound duration (approx 3-4s is safe)
                duckingTimeout.current = setTimeout(() => {
                    setIsDucking(false);
                }, 3500);
            }

            const { sound } = await Audio.Sound.createAsync(
                source,
                { shouldPlay: true, volume: isMuted ? 0 : sfxVolume }
            );

            // Track sound object specifically for stopping later
            // Note: If multiple clicks happen fast, we overwrite the ref, which is acceptable for simple SFX.
            // For slots/roulette, there's usually 1 instance at a time.
            if (activeSfxObjects.current[sfxName]) {
                try { await activeSfxObjects.current[sfxName].unloadAsync(); } catch (e) { }
            }
            activeSfxObjects.current[sfxName] = sound;

            sound.setOnPlaybackStatusUpdate(async (status) => {
                if (status.isLoaded && status.didJustFinish) {
                    try {
                        await sound.unloadAsync();
                    } catch (e) { /* ignore */ }
                    delete activeSfxObjects.current[sfxName];
                }
            });
        } catch (error) {
            // Игнорируем ошибки SFX чтобы не спамить в консоль
        }
    };

    const handleUnlockAudio = async () => {
        // Пробуем проиграть пустой звук или клик, чтобы браузер разблокировал AudioContext
        try {
            if (soundObject.current) {
                await soundObject.current.playAsync();
            } else if (currentTrackName.current) {
                // Если трек был выбран, но не загрузился из-за ошибки, пробуем снова
                const track = currentTrackName.current;
                currentTrackName.current = null; // Сбрасываем чтобы playMusic сработал
                playMusic(track);
            } else {
                // Просто играем клик для разблокировки
                playSfx('click');
            }
            setNeedsInteraction(false);
        } catch (e) {
            console.log('Still locked:', e);
        }
    };

    const toggleMute = () => setIsMuted(prev => !prev);

    return (
        <SoundContext.Provider value={{
            playMusic,
            playSfx,
            stopSfx,
            musicVolume,
            sfxVolume,
            setMusicVolume,
            setSfxVolume,
            toggleMute,
            isMuted,
            needsInteraction
        }}>
            {children}
            {/* Оверлей показывается только если браузер заблокировал звук */}
            {needsInteraction && (
                <View style={styles.overlayContainer} pointerEvents="box-none">
                    <TouchableOpacity onPress={handleUnlockAudio} style={styles.unlockButton} activeOpacity={0.8}>
                        <Text style={styles.unlockText}>🔇 Включить звук</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SoundContext.Provider>
    );
};

const styles = StyleSheet.create({
    overlayContainer: {
        position: 'absolute',
        bottom: 100, // Чуть выше таббара
        alignSelf: 'center',
        zIndex: 9999,
    },
    unlockButton: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#fbbf24',
    },
    unlockText: {
        color: '#fbbf24',
        fontWeight: 'bold',
        fontSize: 14,
    }
});

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) throw new Error("useSound must be used within SoundProvider");
    return context;
};
