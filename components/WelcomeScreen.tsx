import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { CoinIcon, TreeIcon } from './Icons';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
    onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <View style={styles.iconContainer}>
                    <TreeIcon size={80} color="#4ade80" />
                </View>
                <Text style={styles.title}>MobileChill</Text>
                <Text style={styles.subtitle}>Relax, Grow, and Collect.</Text>

                <View style={styles.features}>
                    <View style={styles.featureItem}>
                        <Text style={styles.featureEmoji}>🌳</Text>
                        <Text style={styles.featureText}>Grow unique trees</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Text style={styles.featureEmoji}>✨</Text>
                        <Text style={styles.featureText}>Collect rare species</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Text style={styles.featureEmoji}>💤</Text>
                        <Text style={styles.featureText}>Chill gameplay</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.startButton} onPress={onStart}>
                    <Text style={styles.startButtonText}>Start Journey</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    content: {
        alignItems: 'center',
        width: '80%',
    },
    iconContainer: {
        marginBottom: 20,
        shadowColor: '#4ade80',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#888',
        marginBottom: 40,
        textAlign: 'center',
    },
    features: {
        marginBottom: 40,
        gap: 15,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    featureEmoji: { fontSize: 20 },
    featureText: { color: '#ccc', fontSize: 16 },
    startButton: {
        backgroundColor: '#22c55e',
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 30,
        elevation: 5,
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    startButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
