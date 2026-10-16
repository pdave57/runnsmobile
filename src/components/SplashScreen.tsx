import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';

// Brand Colors
const COLORS = {
    primaryBlue: '#132B5E',
    primaryRed: '#D91E36',
    background: '#FFFFFF',
};

const { width } = Dimensions.get('window');

const SplashScreen: React.FC = () => {
    // Animation Values
    const logoScale = useRef(new Animated.Value(0.8));
    const logoOpacity = useRef(new Animated.Value(0));
    const taglineTranslateY = useRef(new Animated.Value(20));
    const taglineOpacity = useRef(new Animated.Value(0));

    useEffect(() => {
        // Run animations on mount
        Animated.parallel([
            Animated.timing(logoOpacity.current, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(logoScale.current, {
                toValue: 1,
                friction: 4,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        // Delay tagline animation slightly for a staggered effect
        setTimeout(() => {
            Animated.parallel([
                Animated.timing(taglineOpacity.current, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(taglineTranslateY.current, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]).start();
        }, 400);
    }, []);

    // Access .current for Animated - required pattern for react-native Animated
    // eslint-disable-next-line react-hooks/refs
    const logoScaleValue = logoScale.current;
    // eslint-disable-next-line react-hooks/refs
    const logoOpacityValue = logoOpacity.current;
    // eslint-disable-next-line react-hooks/refs
    const taglineTranslateYValue = taglineTranslateY.current;
    // eslint-disable-next-line react-hooks/refs
    const taglineOpacityValue = taglineOpacity.current;

    return (
        <View style={styles.container}>
            {/* Animated Logo */}
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: logoOpacityValue,
                        transform: [{ scale: logoScaleValue }]
                    }
                ]}
            >
                <Image
                    source={require('../../assets/splash-icon.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </Animated.View>

            {/* Animated Tagline */}
            <Animated.View
                style={[
                    styles.taglineContainer,
                    {
                        opacity: taglineOpacityValue,
                        transform: [{ translateY: taglineTranslateYValue }]
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
    logoImage: {
        width: 180,
        height: 180,
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