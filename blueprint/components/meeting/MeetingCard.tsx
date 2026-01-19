import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MeetingCardProps {
    title: string;
    date: string;
    duration: string;
    onPress?: () => void;
}

export function MeetingCard({ title, date, duration, onPress }: MeetingCardProps) {
    return (
        <Pressable style={styles.card} onPress={onPress}>
            <View style={styles.iconContainer}>
                <Ionicons name="calendar" size={20} color="#8B5CF6" />
            </View>
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Text style={styles.date}>{date} • {duration}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3E8FF', // Light purple
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    info: { flex: 1 },
    title: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
    date: { fontSize: 13, color: '#6B7280', marginTop: 2 },
});
