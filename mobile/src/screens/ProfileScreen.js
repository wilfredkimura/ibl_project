import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { api, absoluteUrl } from '../api';
import { AuthContext } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { token, signOut, user, isAdmin } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [busy, setBusy] = useState(false);
  const [pickedImage, setPickedImage] = useState(null);

  const load = async () => {
    try {
      const res = await api.get('/api/profile');
      setProfile(res.data);
      setName(res.data?.name || '');
      setBio(res.data?.bio || '');
    } catch (e) {
      // Not logged in
    }
  };

  useEffect(() => { load(); }, [token]);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission required', 'Please allow photo library access.');
      return;
    }
    const pick = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (pick.canceled) return;
    const file = pick.assets?.[0];
    setPickedImage(file || null);
  };

  const update = async () => {
    try {
      setBusy(true);
      const form = new FormData();
      if (name) form.append('name', name);
      if (bio) form.append('bio', bio);
      if (pickedImage) {
        form.append('picture', { uri: pickedImage.uri, name: 'profile.jpg', type: 'image/jpeg' });
      }
      const res = await api.put('/api/profile', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfile(res.data);
      setPickedImage(null);
      Alert.alert('Saved', 'Profile updated');
    } catch (e) {
      Alert.alert('Update failed', e?.response?.data?.message || e.message);
    } finally {
      setBusy(false);
    }
  };

  if (!token) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <Text>You are not logged in.</Text>
        <View style={{ height: 12 }} />
        <Button title="Login" onPress={() => navigation.navigate('Login')} />
        <View style={{ height: 8 }} />
        <Button title="Register" onPress={() => navigation.navigate('Register')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {token && (
        <Text style={styles.status}>Admin: {isAdmin ? 'Yes' : 'No'}</Text>
      )}
      {!!(profile?.picture_url || pickedImage) && (
        <Image source={{ uri: pickedImage?.uri || absoluteUrl(profile?.picture_url) }} style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 12 }} />
      )}
      <Button title={pickedImage ? 'Change Selected Image' : 'Pick Profile Image'} onPress={pickImage} />
      {isAdmin && (
        <View style={{ height: 12 }} />
        )}
      {isAdmin && (
        <Button title="Open Admin Dashboard" onPress={() => navigation.getParent()?.navigate?.('Admin')} />
      )}
      <View style={{ height: 12 }} />
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={[styles.input, { height: 100 }]} multiline placeholder="Bio" value={bio} onChangeText={setBio} />
      <Button title={busy ? 'Saving...' : 'Save'} onPress={update} disabled={busy} />
      <View style={{ height: 12 }} />
      <Button title="Logout" color="#444" onPress={signOut} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  status: { marginBottom: 8, color: '#666' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, paddingHorizontal: 10, height: 44, marginBottom: 12 },
});
