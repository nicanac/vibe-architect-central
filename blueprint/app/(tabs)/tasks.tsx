import { View, Text, StyleSheet } from 'react-native';

export default function TasksScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Action Items</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 18, color: '#6B7280' },
});
