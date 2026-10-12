import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

// Get screen width for responsive sizing
const { width } = Dimensions.get('window');

const HeroBanner: React.FC = () => {
    // Type the ref specifically for the expo-av Video component
    const videoRef = useRef<Video>(null);

    // Auto-play the video when the component mounts
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playAsync().catch((error) => {
                console.error('Error playing video:', error);
            });
        }
    }, []);

    return (
        <View style={styles.container}>
            {/* Video Background */}
            <Video
                ref={videoRef}
                // Replace this URL with your actual rider delivery video URL
                source={{
                    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
                }}
                style={styles.video}
                resizeMode={ResizeMode.COVER}
                isLooping
                isMuted={true}
                shouldPlay
            />

            {/* Dark Overlay for Text Readability */}
            <View style={styles.overlay} />

            {/* Text Content */}
            <View style={styles.content}>
                <Text style={styles.title}>
                    Dispatch that {'\n'}
                    <Text style={styles.highlight}>keeps moving.</Text>
                </Text>
                <Text style={styles.subtitle}>
                    Book a rider in seconds, follow your package in real time, and get it delivered across the city.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width * 0.9, // 90% of screen width
        maxWidth: 900,
        height: 380, // Fixed height for the banner
        borderRadius: 24,
        overflow: 'hidden', // Keeps video inside rounded corners
        marginVertical: 30,
        alignSelf: 'center',
        shadowColor: '#132B5E',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 25,
        elevation: 10, // Android shadow
    },
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(13, 31, 69, 0.65)', // Navy blue with 65% opacity
        zIndex: 1,
    },
    content: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        zIndex: 2,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#ffffff',
        textAlign: 'center',
        fontStyle: 'italic',
        textTransform: 'uppercase',
        lineHeight: 40,
        marginBottom: 15,
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    highlight: {
        color: '#D91E36', // Brand Red
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.95)',
        textAlign: 'center',
        lineHeight: 24,
        fontWeight: '400',
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 5,
    },
});

export default HeroBanner;