import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { api } from '../api';

export default function EventsScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/events');
      setEvents(res.data || []);
    } catch (e) {
      console.log('Events load error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <FlatList
      style={{ flex: 1, padding: 16 }}
      data={events}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {!!item.date && <Text style={styles.caption}>{new Date(item.date).toLocaleString()}</Text>}
          {!!item.description && <Text>{item.description}</Text>}
        </View>
      )}
      ListEmptyComponent={<Text>No events yet</Text>}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
    />
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  caption: { color: '#666', marginBottom: 4 },
});
