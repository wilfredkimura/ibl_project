import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { api } from '../api';

export default function BlogsScreen({ navigation }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/blog');
      setBlogs(res.data || []);
    } catch (e) {
      console.log('Blogs load error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <FlatList
      style={{ flex: 1, padding: 16 }}
      data={blogs}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BlogDetail', { id: item.id })}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {!!item.date && <Text style={styles.caption}>{new Date(item.date).toLocaleString()}</Text>}
        </TouchableOpacity>
      )}
      ListEmptyComponent={<Text>No blogs yet</Text>}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
    />
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  caption: { color: '#666' },
});
