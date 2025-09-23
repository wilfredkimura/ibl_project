import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import { api } from '../../api';

export default function AdminUsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/users');
      setUsers(res.data || []);
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleAdmin = async (id) => {
    try {
      await api.put(`/api/users/${id}/toggle-admin`);
      load();
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.message || e.message);
    }
  };

  const removeUser = async (id) => {
    Alert.alert('Confirm', 'Delete this user?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await api.delete(`/api/users/${id}`);
          load();
        } catch (e) {
          Alert.alert('Error', e?.response?.data?.message || e.message);
        }
      }}
    ]);
  };

  return (
    <FlatList
      style={{ flex: 1, padding: 16 }}
      data={users}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.username || item.name} {item.is_admin ? '(admin)' : ''}</Text>
          <Text style={styles.caption}>{item.email}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <Button title={item.is_admin ? 'Revoke Admin' : 'Make Admin'} onPress={() => toggleAdmin(item.id)} />
            <Button title="Delete" color="#b00020" onPress={() => removeUser(item.id)} />
          </View>
        </View>
      )}
      ListEmptyComponent={<Text style={{ padding: 16 }}>No users</Text>}
      refreshing={loading}
      onRefresh={load}
    />
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 8 },
  title: { fontSize: 16, fontWeight: '600' },
  caption: { color: '#666' }
});
