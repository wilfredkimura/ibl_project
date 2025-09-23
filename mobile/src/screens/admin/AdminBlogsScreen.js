import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../../api';

export default function AdminBlogsScreen() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/blog');
      setBlogs(res.data || []);
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert('Permission required', 'Allow photo access');
    const pick = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!pick.canceled) setImage(pick.assets?.[0] || null);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setImage(null);
    setEditing(null);
  };

  const submit = async () => {
    try {
      const form = new FormData();
      form.append('title', title);
      form.append('content', content);
      if (image) form.append('picture', { uri: image.uri, name: 'blog.jpg', type: 'image/jpeg' });
      if (editing) {
        await api.put(`/api/blog/${editing.id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/api/blog', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      resetForm();
      load();
    } catch (e) {
      Alert.alert('Save failed', e?.response?.data?.message || e.message);
    }
  };

  const editItem = (b) => {
    setEditing(b);
    setTitle(b.title || '');
    setContent(b.content || '');
    setImage(null);
  };

  const remove = async (id) => {
    Alert.alert('Confirm', 'Delete this blog?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await api.delete(`/api/blog/${id}`);
          load();
        } catch (e) {
          Alert.alert('Delete failed', e?.response?.data?.message || e.message);
        }
      }}
    ]);
  };

  return (
    <FlatList
      style={{ flex: 1, padding: 16 }}
      ListHeaderComponent={
        <View style={styles.form}>
          <Text style={styles.title}>{editing ? 'Edit Blog' : 'New Blog'}</Text>
          <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
          <TextInput style={[styles.input, { height: 120 }]} placeholder="Content" value={content} onChangeText={setContent} multiline />
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <Button title={image ? 'Change Image' : 'Pick Image'} onPress={pickImage} />
            {editing && <Button title="Cancel Edit" color="#666" onPress={resetForm} />}
          </View>
          <Button title={editing ? 'Save Changes' : 'Create Blog'} onPress={submit} />
          <View style={{ height: 16 }} />
          <Text style={styles.title}>Blogs</Text>
        </View>
      }
      data={blogs}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {!!item.picture_url && (
              <Image source={{ uri: item.picture_url }} style={{ width: 64, height: 64, borderRadius: 8 }} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              {!!item.date && <Text style={styles.caption}>{new Date(item.date).toLocaleString()}</Text>}
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <Button title="Edit" onPress={() => editItem(item)} />
            <Button title="Delete" color="#b00020" onPress={() => remove(item.id)} />
          </View>
        </View>
      )}
      refreshing={loading}
      onRefresh={load}
    />
  );
}

const styles = StyleSheet.create({
  form: { marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, paddingHorizontal: 10, height: 44, marginBottom: 8 },
  card: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
})
