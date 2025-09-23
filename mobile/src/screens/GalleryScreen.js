import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Button, Alert, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { api, absoluteUrl } from '../api';
import ImageViewing from 'react-native-image-viewing';

export default function GalleryScreen({ route }) {
  const albumId = route?.params?.albumId || '';
  const albumTitle = route?.params?.albumTitle || 'Gallery';
  const isUngrouped = route?.params?.isUngrouped || false;

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fullscreen viewer state
  const [viewerVisible, setViewerVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      if (isUngrouped) {
        const g = await api.get('/api/gallery');
        const imgs = (g.data || []).filter((i) => !i.album_id);
        setImages(imgs);
      } else if (albumId) {
        // Prefer a dedicated album images endpoint if available, else filter via query
        try {
          const res = await api.get(`/api/albums/${albumId}/images`);
          setImages(res.data || []);
        } catch {
          const g = await api.get(`/api/gallery?album_id=${albumId}`);
          setImages(g.data || []);
        }
      } else {
        const g = await api.get('/api/gallery');
        setImages(g.data || []);
      }
    } catch (e) {
      console.log('Gallery load error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [albumId, isUngrouped]);

  const openViewer = (index) => {
    setCurrentIndex(index);
    setViewerVisible(true);
  };

  const closeViewer = () => setViewerVisible(false);

  // Preload neighbor images for smoother transitions
  useEffect(() => {
    if (!viewerVisible || images.length === 0) return;
    const uris = [currentIndex - 1, currentIndex + 1]
      .filter((i) => i >= 0 && i < images.length)
      .map((i) => absoluteUrl(images[i]?.picture_url));
    uris.forEach((u) => { if (u) Image.prefetch(u); });
  }, [viewerVisible, currentIndex, images]);

  const uploadImage = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission required', 'Please allow photo library access.');
        return;
      }
      const pick = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsMultipleSelection: false });
      if (pick.canceled) return;
      const file = pick.assets?.[0];
      if (!file) return;

      const form = new FormData();
      // backend expects either 'pictures' (array) or 'picture' (single)
      form.append('picture', { uri: file.uri, name: 'upload.jpg', type: 'image/jpeg' });
      if (albumId && !isUngrouped) form.append('album_id', String(albumId));

      await api.post('/api/gallery', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      Alert.alert('Success', 'Image uploaded');
      load();
    } catch (e) {
      Alert.alert('Upload failed', e?.response?.data?.message || e.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16, gap: 8 }}>
        <Text style={styles.title}>{isUngrouped ? 'Ungrouped Photos' : albumTitle}</Text>
        <Button title="Upload Image (Admin)" onPress={uploadImage} />
      </View>
      <FlatList
        style={{ flex: 1, paddingHorizontal: 16 }}
        data={images}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 8 }}
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.thumb} onPress={() => openViewer(index)}>
            {!!item.picture_url && (
              <Image source={{ uri: absoluteUrl(item.picture_url) }} style={styles.image} />
            )}
            <Text numberOfLines={2} style={styles.caption}>{item.caption || 'Photo'}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ padding: 16 }}>No images yet</Text>}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      />

      {/* Fullscreen pinch-to-zoom viewer */}
      <ImageViewing
        images={images.map((img) => ({ uri: absoluteUrl(img.picture_url) }))}
        imageIndex={currentIndex}
        visible={viewerVisible}
        onRequestClose={closeViewer}
        onImageIndexChange={setCurrentIndex}
        HeaderComponent={() => (
          <View style={{ position: 'absolute', top: 40, width: '100%', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>{isUngrouped ? 'Ungrouped Photos' : albumTitle}</Text>
          </View>
        )}
        FooterComponent={() => (
          <View style={{ padding: 12 }}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>{`${currentIndex + 1} of ${images.length}`}</Text>
            <Text style={{ color: '#fff', textAlign: 'center' }}>{images[currentIndex]?.caption || ''}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  thumb: { flex: 1, minHeight: 100, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8 },
  caption: { fontWeight: '600' },
  small: { color: '#666', fontSize: 12, marginTop: 4 },
  title: { fontSize: 18, fontWeight: '700' },
  image: { width: '100%', height: 120, borderRadius: 6, marginBottom: 6 },
});
