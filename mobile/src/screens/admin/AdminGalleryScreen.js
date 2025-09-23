import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../../api';

export default function AdminGalleryScreen() {
  const [albums, setAlbums] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [albumTitle, setAlbumTitle] = useState('');
  const [albumDate, setAlbumDate] = useState('');

  const [newCaption, setNewCaption] = useState('');
  const [newAlbumId, setNewAlbumId] = useState('');
  const [newImage, setNewImage] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [a, g] = await Promise.all([
        api.get('/api/albums'),
        api.get('/api/gallery'),
      ]);
      setAlbums(a.data || []);
      setImages(g.data || []);
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const createAlbum = async () => {
    try {
      if (!albumTitle.trim()) return Alert.alert('Validation', 'Album title required');
      await api.post('/api/albums', { title: albumTitle.trim(), date: albumDate || undefined });
      setAlbumTitle('');
      setAlbumDate('');
      load();
    } catch (e) {
      Alert.alert('Create album failed', e?.response?.data?.message || e.message);
    }
  };

  const deleteAlbum = async (id) => {
    Alert.alert('Confirm', 'Delete this album?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await api.delete(`/api/albums/${id}`); load(); }
        catch (e) { Alert.alert('Delete failed', e?.response?.data?.message || e.message); }
      } }
    ]);
  };

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert('Permission required', 'Allow photo access');
    const pick = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!pick.canceled) setNewImage(pick.assets?.[0] || null);
  };

  const uploadImage = async () => {
    try {
      if (!newImage) return Alert.alert('Validation', 'Pick an image');
      const form = new FormData();
      if (newCaption) form.append('captions', newCaption);
      if (newAlbumId) form.append('album_id', String(newAlbumId));
      form.append('pictures', { uri: newImage.uri, name: 'gallery.jpg', type: 'image/jpeg' });
      await api.post('/api/gallery', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setNewCaption('');
      setNewAlbumId('');
      setNewImage(null);
      load();
    } catch (e) {
      Alert.alert('Upload failed', e?.response?.data?.message || e.message);
    }
  };

  const deleteImage = async (id) => {
    Alert.alert('Confirm', 'Delete this image?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await api.delete(`/api/gallery/${id}`); load(); }
        catch (e) { Alert.alert('Delete failed', e?.response?.data?.message || e.message); }
      } }
    ]);
  };

  return (
    <FlatList
      style={{ flex: 1, padding: 16 }}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>New Album</Text>
          <TextInput style={styles.input} placeholder="Album Title" value={albumTitle} onChangeText={setAlbumTitle} />
          <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD)" value={albumDate} onChangeText={setAlbumDate} />
          <Button title="Create Album" onPress={createAlbum} />
          <View style={{ height: 16 }} />
          <Text style={styles.title}>Upload Image</Text>
          <TextInput style={styles.input} placeholder="Caption" value={newCaption} onChangeText={setNewCaption} />
          <Text style={{ marginBottom: 6 }}>Album</Text>
          {/* Simple album selector */}
          <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 8 }}>
            <Picker selectedValue={newAlbumId} onValueChange={(v) => setNewAlbumId(v)}>
              <Picker.Item label="(No album)" value="" />
              {albums.map((a) => (
                <Picker.Item key={a.id} label={`${a.title}`} value={String(a.id)} />
              ))}
            </Picker>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <Button title={newImage ? 'Change Image' : 'Pick Image'} onPress={pickImage} />
            <Button title="Upload" onPress={uploadImage} />
          </View>
          <View style={{ height: 16 }} />
          <Text style={styles.title}>Images</Text>
        </View>
      }
      data={images}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{item.caption || 'Photo'}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <Button title="Delete" color="#b00020" onPress={() => deleteImage(item.id)} />
          </View>
        </View>
      )}
      refreshing={loading}
      onRefresh={load}
    />
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, paddingHorizontal: 10, height: 44, marginBottom: 8 },
  card: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
})
