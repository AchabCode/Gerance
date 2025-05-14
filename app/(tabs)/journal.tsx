import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';

export default function JournalScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Simulateur</Text>
        <Text style={styles.subtitle}>Choisissez votre mode de jeu</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push('/(tabs)/journal/live')}
        >
          <Card style={styles.optionCard}>
            <Text style={styles.optionTitle}>Live</Text>
            <Text style={styles.optionDescription}>
              Calculez votre taux horaire et vos gains estimés en live
            </Text>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push('/(tabs)/journal/online')}
        >
          <Card style={styles.optionCard}>
            <Text style={styles.optionTitle}>Online</Text>
            <Text style={styles.optionDescription}>
              Calculez votre taux horaire et vos gains estimés en ligne
            </Text>
          </Card>
        </TouchableOpacity>
      </View>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  optionsContainer: {
    flex: 1,
    gap: 16,
  },
  option: {
    flex: 1,
    maxHeight: 200,
  },
  optionCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  optionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});