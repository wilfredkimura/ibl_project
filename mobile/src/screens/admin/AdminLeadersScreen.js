import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../../api';

export default function AdminLeadersScreen() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/leaders');
      setLeaders(res.data || []);
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
    setName('');
    setPosition('');
    setBio('');
    setImage(null);
    setEditing(null);
  };

  const submit = async () => {
    try {
      const form = new FormData();
      form.append('name', name);
      if (position) form.append('position', position);
      if (bio) form.append('bio', bio);
      if (image) form.append('picture', { uri: image.uri, name: 'leader.jpg', type: 'image/jpeg' });
      if (editing) {
        await api.put(`/api/leaders/${editing.id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/api/leaders', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      resetForm();
      load();
    } catch (e) {
      Alert.alert('Save failed', e?.response?.data?.message || e.message);
    }
  };

  const editItem = (l) => {
    setEditing(l);
    setName(l.name || '');
    setPosition(l.position || '');
    setBio(l.bio || '');
    setImage(null);
  };

  const remove = async (id) => {
    Alert.alert('Confirm', 'Delete this leader?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await api.delete(`/api/leaders/${id}`);
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
          <Text style={styles.title}>{editing ? 'Edit Leader' : 'New Leader'}</Text>
          <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Position" value={position} onChangeText={setPosition} />
          <TextInput style={[styles.input, { height: 100 }]} placeholder="Bio" value={bio} onChangeText={setBio} multiline />
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <Button title={image ? 'Change Image' : 'Pick Image'} onPress={pickImage} />
            {editing && <Button title="Cancel Edit" color="#666" onPress={resetForm} />}
          </View>
          <Button title={editing ? 'Save Changes' : 'Create Leader'} onPress={submit} />
          <View style={{ height: 16 }} />
          <Text style={styles.title}>Leaders</Text>
        </View>
      }
      data={leaders}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {!!item.picture_url && (
              <Image source={{ uri: item.picture_url }} style={{ width: 56, height: 56, borderRadius: 28 }} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              {!!item.position && <Text style={styles.caption}>{item.position}</Text>}
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
  card: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 8, backgroundColor: '#fff' },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  caption: { color: '#666' }
});
