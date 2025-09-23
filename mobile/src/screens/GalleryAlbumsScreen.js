import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { api } from '../api';

export default function GalleryAlbumsScreen({ navigation }) {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/albums');
      setAlbums(res.data || []);
    } catch (e) {
      console.log('Albums load error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const goUngrouped = () => {
    navigation.navigate('GalleryAlbum', { isUngrouped: true, albumTitle: 'Ungrouped Photos' });
  };

  const goAlbum = (album) => {
    navigation.navigate('GalleryAlbum', { albumId: album.id, albumTitle: album.title, isUngrouped: false });
  };

  const data = [{ id: 'ungrouped', title: 'Ungrouped Photos', isUngrouped: true }, ...albums.map(a => ({ ...a, isUngrouped: false }))];

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {loading && (
        <View style={{ alignItems: 'center', marginVertical: 12 }}>
          <ActivityIndicator />
        </View>
      )}
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => (item.isUngrouped ? goUngrouped() : goAlbum(item))}
            style={styles.card}
          >
            <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
            {!!item.date && !item.isUngrouped && (
              <Text style={styles.caption}>{new Date(item.date).toLocaleDateString()}</Text>
            )}
            {!item.isUngrouped && (
              <Text style={styles.small}>{(item.photo_count ?? 0)} {Number(item.photo_count) === 1 ? 'photo' : 'photos'}</Text>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={!loading ? <Text>No albums yet</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minHeight: 120, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  caption: { color: '#666', marginTop: 4 },
  small: { color: '#666', marginTop: 2, fontSize: 12 },
});
