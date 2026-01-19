import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
// Mock import for blueprint - in real app would verify package installation
// import { startRecording, stopRecording } from '@siteed/expo-audio-stream';

interface RecordButtonProps {
    onRecordingStart?: () => void;
    onRecordingComplete?: (uri: string) => void;
}

export function RecordButton({ onRecordingStart, onRecordingComplete }: RecordButtonProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleStart = useCallback(async () => {
        setIsLoading(true);
        // Simulate recording start
        setTimeout(() => {
            setIsLoading(false);
            setIsRecording(true);
            onRecordingStart?.();
        }, 500);
    }, [onRecordingStart]);

    const handleStop = useCallback(async () => {
        setIsRecording(false);
        // Simulate callback
        onRecordingComplete?.('file://mock-uri');
    }, [onRecordingComplete]);

    return (
        <Pressable
            style={[styles.button, isRecording && styles.recording]}
            onPress={isRecording ? handleStop : handleStart}
            disabled={isLoading}
        >
            {isLoading ? (
                <ActivityIndicator color="#FFF" />
            ) : (
                <>
                    <View style={[styles.icon, isRecording && styles.iconRecording]} />
                    <Text style={styles.text}>
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </Text>
                </>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#8B5CF6', // Primary Purple
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 30,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12,
    },
    recording: { backgroundColor: '#EF4444' }, // Error/Stop Red
    text: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    icon: { width: 12, height: 12, backgroundColor: '#FFF', borderRadius: 6 },
    iconRecording: { borderRadius: 2 }, // Square when stopping
});
