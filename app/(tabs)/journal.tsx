import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';

export default function JournalScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Simulateur</Text>
      </View>
      
      <Card>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/simulateur/live')}
        >
          <Text style={styles.buttonText}>Simulateur Live</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonLast]} 
          onPress={() => router.push('/simulateur/online')}
        >
          <Text style={styles.buttonText}>Simulateur Online</Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  header: {
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  button: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonLast: {
    marginBottom: 0,
  },
  buttonText: {
    fontSize: 16,
    color: '#0f172a',
    textAlign: 'center',
    fontWeight: '500',
  },
});