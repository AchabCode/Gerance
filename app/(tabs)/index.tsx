import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { BankrollChart } from '@/components/BankrollChart';
import { getRandomMotivationalMessage } from '@/utils/calculations';
import { useAppContext } from '@/context/AppContext';
import { calculateTotalBankroll } from '@/utils/calculations';

export default function HomeScreen() {
  const { bankrollItems, bankrollHistory, loading } = useAppContext();
  const router = useRouter();
  const [motivationalMessage, setMotivationalMessage] = useState('');

  useEffect(() => {
    setMotivationalMessage(getRandomMotivationalMessage());
  }, []);

  const totalBankroll = calculateTotalBankroll(bankrollItems);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.bankrollCard}>
        <Text style={styles.cardLabel}>Ma Bankroll actuelle</Text>
        <Text style={[styles.bankrollValue, totalBankroll >= 0 && styles.positiveValue]}>
          {totalBankroll.toLocaleString('fr-FR')} €
        </Text>
        <Button
          title="Gérer"
          onPress={() => router.push('/(tabs)/bankroll')}
          style={styles.manageButton}
          size="large"
        />
      </Card>

      <BankrollChart data={bankrollHistory} />

      <Card style={styles.motivationCard}>
        <Text style={styles.motivationLabel}>Motivation du jour</Text>
        <Text style={styles.motivationText}>{motivationalMessage}</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 16,
  },
  bankrollCard: {
    alignItems: 'center',
    padding: 24,
  },
  cardLabel: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
  bankrollValue: {
    fontSize: 42,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 24,
  },
  positiveValue: {
    color: '#2b9553',
  },
  manageButton: {
    width: 200,
  },
  motivationCard: {
    marginTop: 16,
  },
  motivationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 16,
    color: '#0f172a',
    fontStyle: 'italic',
    lineHeight: 24,
  },
});