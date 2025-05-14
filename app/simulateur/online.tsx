import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { DatePicker } from '@/components/DatePicker';
import { Button } from '@/components/Button';
import { useRouter } from 'expo-router';
import { ArrowLeft, LayoutDashboard } from 'lucide-react-native';
import { useAppContext } from '@/context/AppContext';
import { calculateTotalBankroll } from '@/utils/calculations';
import { format, addWeeks, addMonths, addYears } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';

const NL_LIMITS = [2, 5, 10, 20, 35, 50, 75, 100, 150, 200, 250, 300, 400, 500, 1000];
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

const nlToBB = (nl: number) => nl / 100;

export default function OnlineSimulatorScreen() {
  const router = useRouter();
  const { bankrollItems } = useAppContext();
  const totalBankroll = calculateTotalBankroll(bankrollItems);

  const [rake, setRake] = useState('');
  const [rakeback, setRakeback] = useState('');
  const [winrate, setWinrate] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('');
  const [nlLimit, setNlLimit] = useState(NL_LIMITS[0].toString());
  const [tableCount, setTableCount] = useState('1');
  const [currentBankroll, setCurrentBankroll] = useState(totalBankroll.toString());
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [simulationPeriod, setSimulationPeriod] = useState(SIMULATION_PERIODS[0].value);

  useEffect(() => {
    loadSimulatorConfig();
  }, []);

  const loadSimulatorConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('simulator_configs')
        .select('*')
        .single();

      if (error) throw error;
      if (data) {
        setRake(data.rake?.toString() || '');
        setRakeback(data.rakeback?.toString() || '');
        setWinrate(data.winrate?.toString() || '');
        setHoursPerWeek(data.hours_per_week?.toString() || '');
        setNlLimit(data.nl_limit?.toString() || NL_LIMITS[0].toString());
        setTableCount(data.table_count?.toString() || '1');
        setCurrentBankroll(data.current_bankroll?.toString() || totalBankroll.toString());
        setMonthlyWithdrawal(data.monthly_withdrawal?.toString() || '');
        setStartDate(new Date(data.start_date || new Date()));
        setSimulationPeriod(data.simulation_period || SIMULATION_PERIODS[0].value);
      }
    } catch (error) {
      console.error('Error loading simulator config:', error);
    }
  };

  const saveSimulatorConfig = async () => {
    try {
      const { error } = await supabase
        .from('simulator_configs')
        .upsert({
          rake: parseFloat(rake) || 0,
          rakeback: parseFloat(rakeback) || 0,
          winrate: parseFloat(winrate) || 0,
          hours_per_week: parseFloat(hoursPerWeek) || 0,
          nl_limit: parseInt(nlLimit),
          table_count: parseInt(tableCount),
          current_bankroll: parseFloat(currentBankroll) || 0,
          monthly_withdrawal: parseFloat(monthlyWithdrawal) || 0,
          start_date: startDate.toISOString(),
          simulation_period: simulationPeriod,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving simulator config:', error);
    }
  };

  useEffect(() => {
    saveSimulatorConfig();
  }, [
    rake,
    rakeback,
    winrate,
    hoursPerWeek,
    nlLimit,
    tableCount,
    currentBankroll,
    monthlyWithdrawal,
    startDate,
    simulationPeriod,
  ]);

  const resetSimulator = () => {
    setRake('');
    setRakeback('');
    setWinrate('');
    setHoursPerWeek('');
    setNlLimit(NL_LIMITS[0].toString());
    setTableCount('1');
    setCurrentBankroll(totalBankroll.toString());
    setMonthlyWithdrawal('');
    setStartDate(new Date());
    setSimulationPeriod(SIMULATION_PERIODS[0].value);
  };

  const handsPerHour = parseInt(tableCount) * 70;
  const bbValue = nlToBB(parseInt(nlLimit));

  const calculateHourlyRate = () => {
    const rakeValue = parseFloat(rake) || 0;
    const rakebackValue = (parseFloat(rakeback) || 0) / 100;
    const winrateValue = parseFloat(winrate) || 0;

    const bbPerHour = ((winrateValue + (rakeValue * rakebackValue)) * handsPerHour) / 100;
    return bbPerHour * bbValue;
  };

  const calculateHourlyRakeback = () => {
    const rakeValue = parseFloat(rake) || 0;
    const rakebackValue = (parseFloat(rakeback) || 0) / 100;

    const bbRakebackPerHour = (rakeValue * rakebackValue * handsPerHour) / 100;
    return bbRakebackPerHour * bbValue;
  };

  const calculateNetGains = () => {
    const hourlyRate = calculateHourlyRate();
    const hoursPerWeekValue = parseFloat(hoursPerWeek) || 0;
    const monthlyWithdrawalValue = parseFloat(monthlyWithdrawal) || 0;

    let totalWeeks = 0;
    const [value, unit] = simulationPeriod.split('');
    const numValue = parseInt(value);

    switch (unit) {
      case 'w':
        totalWeeks = numValue;
        break;
      case 'm':
        totalWeeks = numValue * 4.33;
        break;
      case 'y':
        totalWeeks = 52;
        break;
    }

    const totalHours = hoursPerWeekValue * totalWeeks;
    const grossGains = hourlyRate * totalHours;

    let withdrawalMultiplier = 0;
    switch (simulationPeriod) {
      case '1w': withdrawalMultiplier = 0.25; break;
      case '2w': withdrawalMultiplier = 0.5; break;
      case '3w': withdrawalMultiplier = 0.75; break;
      case '1m': withdrawalMultiplier = 1; break;
      case '2m': withdrawalMultiplier = 2; break;
      case '3m': withdrawalMultiplier = 3; break;
      case '6m': withdrawalMultiplier = 6; break;
      case '1y': withdrawalMultiplier = 12; break;
    }

    const totalWithdrawal = monthlyWithdrawalValue * withdrawalMultiplier;
    return grossGains - totalWithdrawal;
  };

  const hourlyRate = calculateHourlyRate();
  const hourlyRakeback = calculateHourlyRakeback();
  const netGains = calculateNetGains();
  const finalBankroll = parseFloat(currentBankroll) + netGains;

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

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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
            label="Limite"
            value={nlLimit}
            onValueChange={setNlLimit}
            items={NL_LIMITS.map(limit => ({
              label: `NL${limit}`,
              value: limit.toString(),
            }))}
          />
          
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Valeur de la BB :</Text>
            <Text style={styles.infoValue}>{formatCurrency(bbValue)}</Text>
          </View>
          
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

        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>Résultats</Text>
          
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Taux horaire (Gains + Rakeback)</Text>
            <Text style={[styles.resultValue, hourlyRate >= 0 ? styles.positive : styles.negative]}>
              {formatCurrency(hourlyRate)}/h
            </Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Rakeback horaire</Text>
            <Text style={[styles.resultValue, styles.positive]}>
              {formatCurrency(hourlyRakeback)}/h
            </Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>
              Gains nets sur {SIMULATION_PERIODS.find(p => p.value === simulationPeriod)?.label.toLowerCase()}
            </Text>
            <Text style={[styles.resultValue, netGains >= 0 ? styles.positive : styles.negative]}>
              {formatCurrency(netGains)}
            </Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Projection bankroll finale</Text>
            <Text style={[styles.resultValue, finalBankroll >= 0 ? styles.positive : styles.negative]}>
              {formatCurrency(finalBankroll)}
            </Text>
          </View>
        </View>
      </Card>

      <Button
        title="🔄 Réinitialiser le simulateur"
        onPress={resetSimulator}
        variant="secondary"
        style={styles.resetButton}
      />
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
  resultsSection: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  resultCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  resultLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  positive: {
    color: '#10b981',
  },
  negative: {
    color: '#ef4444',
  },
  resetButton: {
    marginTop: 24,
  },
});