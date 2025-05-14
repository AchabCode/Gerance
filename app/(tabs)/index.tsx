import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { getRandomMotivationalMessage } from '@/utils/calculations';
import { useAppContext } from '@/context/AppContext';
import { calculateTotalBankroll } from '@/utils/calculations';
import { Eye, EyeOff } from 'lucide-react-native';
import { subDays, subMonths, subWeeks, startOfDay, isAfter } from 'date-fns';

type TimePeriod = '24h' | 'Semaine' | 'Mois' | 'Trimestre' | 'Année';

export default function HomeScreen() {
  const { bankrollItems, bankrollHistory } = useAppContext();
  const router = useRouter();
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [showBankroll, setShowBankroll] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod | null>(null);

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

  const calculateEvolution = (period: TimePeriod) => {
    const now = new Date();
    let startDate = startOfDay(now);

    switch (period) {
      case '24h':
        startDate = subDays(now, 1);
        break;
      case 'Semaine':
        startDate = subWeeks(now, 1);
        break;
      case 'Mois':
        startDate = subMonths(now, 1);
        break;
      case 'Trimestre':
        startDate = subMonths(now, 3);
        break;
      case 'Année':
        startDate = subMonths(now, 12);
        break;
    }

    const filteredHistory = bankrollHistory
      .filter(point => isAfter(new Date(point.date), startDate))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (filteredHistory.length < 2) return { amount: 0, percentage: 0 };

    const oldestAmount = filteredHistory[0].amount;
    const latestAmount = filteredHistory[filteredHistory.length - 1].amount;
    const difference = latestAmount - oldestAmount;
    const percentage = (difference / oldestAmount) * 100;

    return {
      amount: difference,
      percentage: percentage,
    };
  };

  const renderEvolution = (period: TimePeriod) => {
    const evolution = calculateEvolution(period);
    const isPositive = evolution.amount >= 0;

    return (
      <TouchableOpacity
        style={[styles.periodButton, selectedPeriod === period && styles.selectedPeriod]}
        onPress={() => setSelectedPeriod(period)}
      >
        <Text style={[styles.periodText, selectedPeriod === period && styles.selectedPeriodText]}>
          {period}
        </Text>
        {selectedPeriod === period && (
          <View style={styles.evolutionContainer}>
            <Text style={[styles.evolutionAmount, isPositive ? styles.positiveEvolution : styles.negativeEvolution]}>
              {showBankroll ? `${evolution.amount >= 0 ? '+' : ''}${evolution.amount.toLocaleString('fr-FR')} €` : '*****'}
            </Text>
            <Text style={[styles.evolutionPercentage, isPositive ? styles.positiveEvolution : styles.negativeEvolution]}>
              {showBankroll ? `${evolution.percentage >= 0 ? '+' : ''}${evolution.percentage.toFixed(2)}%` : '*****'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
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
        <View style={styles.periodsContainer}>
          {renderEvolution('24h')}
          {renderEvolution('Semaine')}
          {renderEvolution('Mois')}
          {renderEvolution('Trimestre')}
          {renderEvolution('Année')}
        </View>
      </Card>

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
    marginBottom: 16,
  },
  periodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  selectedPeriod: {
    backgroundColor: '#e0f2fe',
  },
  periodText: {
    fontSize: 14,
    color: '#64748b',
  },
  selectedPeriodText: {
    color: '#0f172a',
    fontWeight: '500',
  },
  evolutionContainer: {
    marginTop: 4,
    alignItems: 'center',
  },
  evolutionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  evolutionPercentage: {
    fontSize: 12,
  },
  positiveEvolution: {
    color: '#2b9553',
  },
  negativeEvolution: {
    color: '#ef4444',
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