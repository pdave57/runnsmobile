import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

// Brand Colors
const COLORS = {
    primaryBlue: '#132B5E',
    primaryRed: '#D91E36',
    background: '#FFFFFF',
};

const { width } = Dimensions.get('window');

const SplashScreen: React.FC = () => {
    // Animation Values
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const taglineTranslateY = useRef(new Animated.Value(20)).current;
    const taglineOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Run animations on mount
        Animated.parallel([
            Animated.timing(logoOpacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(logoScale, {
                toValue: 1,
                friction: 4,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        // Delay tagline animation slightly for a staggered effect
        setTimeout(() => {
            Animated.parallel([
                Animated.timing(taglineOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(taglineTranslateY, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]).start();
        }, 400);
    }, []);

    return (
        <View style={styles.container}>
            {/* Animated Logo */}
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: logoOpacity,
                        transform: [{ scale: logoScale }]
                    }
                ]}
            >
                <Text style={styles.logoText}>
                    <Text style={styles.logoBlue}>RUNN</Text>
                    <Text style={styles.logoRed}>S</Text>
                </Text>
            </Animated.View>

            {/* Animated Tagline */}
            <Animated.View
                style={[
                    styles.taglineContainer,
                    {
                        opacity: taglineOpacity,
                        transform: [{ translateY: taglineTranslateY }]
                    }
                ]}
            >
                <View style={styles.redLine} />
                <Text style={styles.taglineText}>LOGISTICS FORWARD</Text>
                <View style={styles.redLine} />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: 10,
    },
    logoText: {
        fontSize: 56,
        fontWeight: '900',
        fontStyle: 'italic',
        letterSpacing: -2,
    },
    logoBlue: {
        color: COLORS.primaryBlue,
    },
    logoRed: {
        color: COLORS.primaryRed,
    },
    taglineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    redLine: {
        width: 40,
        height: 3,
        backgroundColor: COLORS.primaryRed,
        marginHorizontal: 12,
    },
    taglineText: {
        fontSize: 14,
        color: COLORS.primaryBlue,
        fontWeight: '700',
        letterSpacing: 3,
    },
});

export default SplashScreen;