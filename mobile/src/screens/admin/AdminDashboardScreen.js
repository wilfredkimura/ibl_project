import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { api } from '../../api';

export default function AdminDashboardScreen({ navigation }) {
  const [counts, setCounts] = useState({ users: 0, blogs: 0, events: 0, leaders: 0, albums: 0, images: 0 });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [users, blogs, events, leaders, albums, images] = await Promise.all([
        api.get('/api/users'),
        api.get('/api/blog'),
        api.get('/api/events'),
        api.get('/api/leaders'),
        api.get('/api/albums'),
        api.get('/api/gallery'),
      ]);
      setCounts({
        users: (users.data || []).length,
        blogs: (blogs.data || []).length,
        events: (events.data || []).length,
        leaders: (leaders.data || []).length,
        albums: (albums.data || []).length,
        images: (images.data || []).length,
      });
    } catch (e) {
      // silent; paper components will still render
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const tiles = [
    { title: 'Users', value: counts.users, color: '#1976d2', onPress: () => navigation.navigate('Users') },
    { title: 'Blogs', value: counts.blogs, color: '#2e7d32', onPress: () => navigation.navigate('Blogs') },
    { title: 'Events', value: counts.events, color: '#f57c00', onPress: () => navigation.navigate('EventsAdmin') },
    { title: 'Leaders', value: counts.leaders, color: '#7b1fa2', onPress: () => navigation.navigate('LeadersAdmin') },
    { title: 'Albums', value: counts.albums, color: '#0288d1', onPress: () => navigation.navigate('GalleryAdmin') },
    { title: 'Images', value: counts.images, color: '#455a64', onPress: () => navigation.navigate('GalleryAdmin') },
  ];

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}>
      <Text variant="headlineSmall" style={styles.title}>Admin Dashboard</Text>
      <View style={styles.grid}>
        {tiles.map((t) => (
          <Card key={t.title} style={[styles.card, { borderColor: t.color }]}> 
            <Card.Title title={t.title} titleVariant="titleMedium" />
            <Card.Content>
              <Text variant="displaySmall" style={{ color: t.color, fontWeight: '700' }}>{t.value}</Text>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" onPress={t.onPress}>Manage</Button>
            </Card.Actions>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { flexBasis: '48%', borderWidth: 1, borderRadius: 12 },
});
