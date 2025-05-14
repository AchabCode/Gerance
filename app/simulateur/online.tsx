import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '@/components/Card';
import { useRouter } from 'expo-router';
import { ArrowLeft, Chrome as Home } from 'lucide-react-native';

export default function OnlineSimulatorScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.navigation}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.navButton}
          >
            <ArrowLeft size={24} color="#0f172a" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)')} 
            style={styles.navButton}
          >
            <Home size={24} color="#0f172a" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Simulateur Online</Text>
      </View>
      
      <Card>
        <Text style={styles.comingSoon}>
          Les paramètres pour le mode Online seront bientôt disponibles
        </Text>
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
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  navButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  comingSoon: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});