import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { DatePicker } from '@/components/DatePicker';
import { useRouter } from 'expo-router';
import { ArrowLeft, LayoutDashboard } from 'lucide-react-native';
import { useAppContext } from '@/context/AppContext';
import { calculateTotalBankroll } from '@/utils/calculations';
import { format, addWeeks, addMonths, addYears } from 'date-fns';
import { fr } from 'date-fns/locale';

const BB_LIMITS = [2, 5, 10, 20, 35, 50, 75, 100, 150, 200, 250, 300, 400, 500, 1000];
const TABLE_COUNTS = Array.from({ length: 12 }, (_, i) => i + 1);
const SIMULATION_PERIODS = [
  { label: '1 semaine', value: '1w' },
  { label: '2 semaines', value: '2w' },
  { label: '3 semaines', value: '3w' },
  { label: '1 mois', value: '1m' },
  { label: '2 mois', value: '2m' },
  { label: '3 mois', value: '3m' },
  { label: '6 mois', value: '6m' },
  { label: '1 an', value: '1y' },
];

export default function OnlineSimulatorScreen() {
  const router = useRouter();
  const { bankrollItems } = useAppContext();
  const totalBankroll = calculateTotalBankroll(bankrollItems);

  const [rake, setRake] = useState('');
  const [rakeback, setRakeback] = useState('');
  const [winrate, setWinrate] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('');
  const [bbLimit, setBbLimit] = useState(BB_LIMITS[0].toString());
  const [tableCount, setTableCount] = useState('1');
  const [currentBankroll, setCurrentBankroll] = useState(totalBankroll.toString());
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [simulationPeriod, setSimulationPeriod] = useState(SIMULATION_PERIODS[0].value);

  const handsPerHour = parseInt(tableCount) * 70;

  const getSimulationEndDate = () => {
    const [value, unit] = simulationPeriod.split('');
    const weeks = parseInt(value);
    
    switch (unit) {
      case 'w':
        return addWeeks(startDate, weeks);
      case 'm':
        return addMonths(startDate, weeks);
      case 'y':
        return addYears(startDate, 1);
      default:
        return startDate;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
            <LayoutDashboard size={24} color="#0f172a" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Simulateur Online</Text>
      </View>
      
      <Card>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Paramètres de jeu</Text>
          
          <Input
            label="Rake (bb/100)"
            value={rake}
            onChangeText={setRake}
            keyboardType="decimal-pad"
            placeholder="Ex: 5.5"
          />
          
          <Input
            label="Rakeback (%)"
            value={rakeback}
            onChangeText={setRakeback}
            keyboardType="decimal-pad"
            placeholder="Ex: 30"
          />
          
          <Input
            label="Winrate (bb/100)"
            value={winrate}
            onChangeText={setWinrate}
            keyboardType="decimal-pad"
            placeholder="Ex: 3"
          />
          
          <Input
            label="Heures de jeu par semaine"
            value={hoursPerWeek}
            onChangeText={setHoursPerWeek}
            keyboardType="decimal-pad"
            placeholder="Ex: 20"
          />
          
          <Select
            label="Limite (BB)"
            value={bbLimit}
            onValueChange={setBbLimit}
            items={BB_LIMITS.map(limit => ({
              label: `${limit} BB`,
              value: limit.toString(),
            }))}
          />
          
          <Select
            label="Nombre de tables"
            value={tableCount}
            onValueChange={setTableCount}
            items={TABLE_COUNTS.map(count => ({
              label: count.toString(),
              value: count.toString(),
            }))}
          />
          
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Mains par heure :</Text>
            <Text style={styles.infoValue}>{handsPerHour}</Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Paramètres financiers</Text>
          
          <Input
            label="Bankroll actuelle (€)"
            value={currentBankroll}
            onChangeText={setCurrentBankroll}
            keyboardType="decimal-pad"
            placeholder="Ex: 10000"
          />
          
          <Input
            label="CashOut mensuel (€)"
            value={monthlyWithdrawal}
            onChangeText={setMonthlyWithdrawal}
            keyboardType="decimal-pad"
            placeholder="Ex: 1000"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Paramètres de simulation</Text>
          
          <DatePicker
            label="Date de début"
            value={startDate}
            onChange={setStartDate}
          />
          
          <Select
            label="Durée de simulation"
            value={simulationPeriod}
            onValueChange={setSimulationPeriod}
            items={SIMULATION_PERIODS}
          />
          
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Date de fin :</Text>
            <Text style={styles.infoValue}>
              {format(getSimulationEndDate(), 'dd MMMM yyyy', { locale: fr })}
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
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
});