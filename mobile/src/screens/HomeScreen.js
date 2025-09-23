import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { api, getApiBaseUrl } from '../api';

export default function HomeScreen({ navigation }) {
  const [blogs, setBlogs] = useState([]);
  const [images, setImages] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [b, g, e] = await Promise.all([
        api.get('/api/blog'),
        api.get('/api/gallery'),
        api.get('/api/events'),
      ]);
      setBlogs(b.data || []);
      setImages(g.data || []);
      setEvents(e.data || []);
    } catch (e) {
      console.log('Home load error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <FlatList
      style={{ flex: 1, padding: 16 }}
      data={blogs}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>YSC St. Dominic</Text>
          <Text style={styles.caption}>Base URL: {getApiBaseUrl()}</Text>
          <Text style={styles.section}>Latest Blogs</Text>
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BlogDetail', { id: item.id })}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {!!item.date && (
            <Text style={styles.caption}>{new Date(item.date).toLocaleString()}</Text>
          )}
        </TouchableOpacity>
      )}
      ListFooterComponent={
        <View>
          <Text style={styles.section}>Upcoming Events</Text>
          {events.slice(0, 5).map((ev) => (
            <View key={ev.id} style={styles.card}>
              <Text style={styles.cardTitle}>{ev.title}</Text>
              {!!ev.date && (
                <Text style={styles.caption}>{new Date(ev.date).toLocaleString()}</Text>
              )}
            </View>
          ))}
          <Text style={styles.section}>Recent Photos</Text>
          {images.slice(0, 6).map((img) => (
            <View key={img.id} style={styles.card}>
              <Text>{img.caption || 'Photo'}</Text>
            </View>
          ))}
        </View>
      }
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
    />
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  caption: { color: '#666', marginBottom: 12 },
  section: { marginTop: 12, fontSize: 18, fontWeight: '600' },
  card: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
});
