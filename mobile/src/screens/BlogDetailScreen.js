import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { api } from '../api';

export default function BlogDetailScreen({ route }) {
  const { id } = route.params || {};
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/blog');
        const found = (res.data || []).find((b) => String(b.id) === String(id));
        setBlog(found || null);
      } catch (e) {
        setError(e?.response?.data?.message || e.message);
      }
    })();
  }, [id]);

  if (error) return <View style={styles.container}><Text style={styles.error}>{error}</Text></View>;
  if (!blog) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{blog.title}</Text>
      {!!blog.date && <Text style={styles.caption}>{new Date(blog.date).toLocaleString()}</Text>}
      {!!blog.picture_url && <Text style={styles.caption}>Image: {blog.picture_url}</Text>}
      <Text style={styles.content}>{blog.content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
  caption: { color: '#666', marginBottom: 12 },
  content: { fontSize: 16, lineHeight: 22 },
  error: { color: 'red' },
});
