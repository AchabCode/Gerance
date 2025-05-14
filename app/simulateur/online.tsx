import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/Card';

export default function OnlineSimulatorScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
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