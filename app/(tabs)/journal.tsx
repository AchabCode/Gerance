import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { useAppContext } from '@/context/AppContext';
import { calculateHourlyRate } from '@/utils/calculations';

export default function JournalScreen() {
  const { hourlyRateParams, updateHourlyRateParams } = useAppContext();
  
  const [bb_amount, setBbAmount] = useState('');
  const [bb_per_hour, setBbPerHour] = useState('');
  const [rakeback_hourly, setRakebackHourly] = useState('');
  const [monthly_hours, setMonthlyHours] = useState('');
  const [monthly_expenses, setMonthlyExpenses] = useState('');
  
  const hourlyRate = calculateHourlyRate(
    Number(bb_amount) || 0,
    Number(bb_per_hour) || 0,
    Number(rakeback_hourly) || 0
  );

  const monthlyEarnings = hourlyRate * (Number(monthly_hours) || 0);
  const monthlyNetEarnings = monthlyEarnings - (Number(monthly_expenses) || 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Calculateur</Text>
      </View>
      
      <Card>
        <Text style={styles.sectionTitle}>Taux horaire estimé</Text>
        
        <Input
          label="Montant de la BB jouée ($)"
          value={bb_amount}
          onChangeText={(text) => {
            setBbAmount(text);
            updateHourlyRateParams({
              ...hourlyRateParams,
              bb_amount: Number(text) || 0,
            });
          }}
          keyboardType="decimal-pad"
          placeholder="Entrez le montant de la BB"
        />
        
        <Input
          label="BB gagnées par heure"
          value={bb_per_hour}
          onChangeText={(text) => {
            setBbPerHour(text);
            updateHourlyRateParams({
              ...hourlyRateParams,
              bb_per_hour: Number(text) || 0,
            });
          }}
          keyboardType="decimal-pad"
          placeholder="Entrez le nombre de BB/heure"
        />
        
        <Input
          label="Rakeback $/heure"
          value={rakeback_hourly}
          onChangeText={(text) => {
            setRakebackHourly(text);
            updateHourlyRateParams({
              ...hourlyRateParams,
              rakeback_hourly: Number(text) || 0,
            });
          }}
          keyboardType="decimal-pad"
          placeholder="Entrez le rakeback horaire"
        />
        
        <Input
          label="Nombre d'heures jouées dans le mois"
          value={monthly_hours}
          onChangeText={(text) => {
            setMonthlyHours(text);
            updateHourlyRateParams({
              ...hourlyRateParams,
              monthly_hours: Number(text) || 0,
            });
          }}
          keyboardType="decimal-pad"
          placeholder="Entrez le nombre d'heures par mois"
        />

        <Input
          label="Frais mensuels ($)"
          value={monthly_expenses}
          onChangeText={(text) => {
            setMonthlyExpenses(text);
            updateHourlyRateParams({
              ...hourlyRateParams,
              monthly_expenses: Number(text) || 0,
            });
          }}
          keyboardType="decimal-pad"
          placeholder="Entrez vos frais mensuels"
        />
        
        <View style={styles.rateContainer}>
          <View style={styles.rateItem}>
            <Text style={styles.rateLabel}>Votre taux horaire estimé:</Text>
            <Text style={styles.rateValue}>{hourlyRate.toFixed(2)} $/heure</Text>
          </View>
          
          <View style={styles.rateItem}>
            <Text style={styles.rateLabel}>Gains bruts estimés:</Text>
            <Text style={styles.rateValue}>{monthlyEarnings.toFixed(2)} $/mois</Text>
          </View>

          <View style={styles.rateItem}>
            <Text style={styles.rateLabel}>Gains nets estimés:</Text>
            <Text style={[styles.rateValue, monthlyNetEarnings < 0 && styles.negativeValue]}>
              {monthlyNetEarnings.toFixed(2)} $/mois après frais
            </Text>
          </View>
        </View>
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
    paddingBottom: 32,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  rateContainer: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  rateItem: {
    marginBottom: 12,
    alignItems: 'center',
  },
  rateLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6',
  },
  negativeValue: {
    color: '#ef4444',
  },
});