import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { api } from '../api';

export default function LeadersScreen() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/leaders');
      setLeaders(res.data || []);
    } catch (e) {
      console.log('Leaders load error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <FlatList
      style={{ flex: 1, padding: 16 }}
      data={leaders}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          {!!item.position && <Text style={styles.caption}>{item.position}</Text>}
          {!!item.bio && <Text>{item.bio}</Text>}
        </View>
      )}
      ListEmptyComponent={<Text>No leaders yet</Text>}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
    />
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  caption: { color: '#666', marginBottom: 4 },
});
