import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { CherryBlossomTree } from './CherryBlossomTree';

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
                <View style={styles.treeContainer}>
                    <CherryBlossomTree />
                </View>

                <View style={styles.titleBox}>
                    <Text style={styles.title}>Eternal Tree</Text>
                </View>

                <Text style={styles.subtitle}>🌸 Grow, Cultivate, Ascend.</Text>

                <TouchableOpacity style={styles.startButton} onPress={onStart}>
                    <Text style={styles.startButtonText}>Start</Text>
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
        width: '100%',
        marginTop: -80, // Shift everything up
    },
    treeContainer: {
        position: 'relative',
        marginBottom: -5,
        zIndex: 1, // Below other elements
    },
    titleBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 2,
        borderColor: '#ff69b4',
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 40,
        shadowColor: '#ff69b4',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        zIndex: 2, // Above tree
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 20,
        color: '#ffb3d9',
        marginTop: 20,
        marginBottom: 40,
        textAlign: 'center',
        zIndex: 2,
    },
    startButton: {
        backgroundColor: '#ff69b4',
        paddingVertical: 18,
        paddingHorizontal: 70,
        borderRadius: 30,
        elevation: 5,
        shadowColor: '#ff69b4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        zIndex: 3, // Above everything
    },
    startButtonText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
});
