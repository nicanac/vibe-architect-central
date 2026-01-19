import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RecordButton } from '../../components/meeting/RecordButton';
import { MeetingCard } from '../../components/meeting/MeetingCard';
import { router } from 'expo-router';

export default function DashboardScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Good Morning, Alex</Text>
                <Text style={styles.date}>Today, Oct 24</Text>
            </View>

            <View style={styles.recordContainer}>
                <View style={styles.recordCard}>
                    <RecordButton onRecordingStart={() => console.log('Started')} />
                    <Text style={styles.recordHint}>Tap to start recording</Text>
                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>12.5 hrs</Text>
                    <Text style={styles.statLabel}>Saved Time</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>24</Text>
                    <Text style={styles.statLabel}>Meetings</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Recent Meetings</Text>
            <MeetingCard
                title="Product Roadmap Q3"
                date="10:00 AM"
                duration="45 mins"
                onPress={() => router.push('/meeting/123')}
            />
            <MeetingCard
                title="Design Review"
                date="Yesterday"
                duration="30 mins"
                onPress={() => router.push('/meeting/456')}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    content: { padding: 20, paddingBottom: 100 },
    header: { marginBottom: 24, marginTop: 40 },
    greeting: { fontSize: 28, fontWeight: '700', color: '#1F2937' },
    date: { fontSize: 16, color: '#6B7280', marginTop: 4 },

    recordContainer: { alignItems: 'center', marginBottom: 32 },
    recordCard: {
        width: '100%',
        backgroundColor: '#8B5CF6',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#8B5CF6',
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8
    },
    recordHint: { color: 'rgba(255,255,255,0.8)', marginTop: 16, fontSize: 14 },

    statsRow: { flexDirection: 'row', gap: 16, marginBottom: 32 },
    statCard: { flex: 1, backgroundColor: '#FFF', padding: 16, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    statValue: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
    statLabel: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },

    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 12 },
});
