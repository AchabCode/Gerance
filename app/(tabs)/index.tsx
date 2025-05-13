import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { BankrollChart } from '@/components/BankrollChart';
import { getRandomMotivationalMessage } from '@/utils/calculations';
import { useAppContext } from '@/context/AppContext';
import { calculateTotalBankroll } from '@/utils/calculations';
import { Eye, EyeOff } from 'lucide-react-native';

export default function HomeScreen() {
  const { bankrollItems, bankrollHistory, loading } = useAppContext();
  const router = useRouter();
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [showBankroll, setShowBankroll] = useState(false);

  useEffect(() => {
    setMotivationalMessage(getRandomMotivationalMessage());
  }, []);

  const totalBankroll = calculateTotalBankroll(bankrollItems);

  const toggleBankrollVisibility = () => {
    setShowBankroll(!showBankroll);
  };

  const formatBankroll = (amount: number) => {
    return showBankroll ? amount.toLocaleString('fr-FR') : '*****';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.bankrollCard}>
        <Text style={styles.cardLabel}>Ma Bankroll actuelle</Text>
        <View style={styles.bankrollContainer}>
          <Text style={[styles.bankrollValue, totalBankroll >= 0 && styles.positiveValue]}>
            {formatBankroll(totalBankroll)} €
          </Text>
          <TouchableOpacity onPress={toggleBankrollVisibility} style={styles.eyeButton}>
            {showBankroll ? (
              <EyeOff size={24} color="#64748b" />
            ) : (
              <Eye size={24} color="#64748b" />
            )}
          </TouchableOpacity>
        </View>
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
  bankrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  bankrollValue: {
    fontSize: 42,
    fontWeight: '700',
    color: '#0f172a',
    marginRight: 12,
  },
  positiveValue: {
    color: '#2b9553',
  },
  eyeButton: {
    padding: 8,
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