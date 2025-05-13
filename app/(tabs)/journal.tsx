import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAppContext } from '@/context/AppContext';
import { calculateHourlyRate } from '@/utils/calculations';
import { ChevronDown, Save, Trash2 } from 'lucide-react-native';

export default function JournalScreen() {
  const { hourlyRateParams, updateHourlyRateParams, simulatorConfigs, saveConfig, deleteSimulatorConfig } = useAppContext();
  
  const [bb_amount, setBbAmount] = useState(hourlyRateParams.bb_amount.toString());
  const [bb_per_hour, setBbPerHour] = useState(hourlyRateParams.bb_per_hour.toString());
  const [rakeback_hourly, setRakebackHourly] = useState(hourlyRateParams.rakeback_hourly.toString());
  const [monthly_hours, setMonthlyHours] = useState(hourlyRateParams.monthly_hours.toString());
  const [monthly_expenses, setMonthlyExpenses] = useState(hourlyRateParams.monthly_expenses.toString());
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [configName, setConfigName] = useState('');
  const [showConfigs, setShowConfigs] = useState(false);
  
  useEffect(() => {
    setBbAmount(hourlyRateParams.bb_amount.toString());
    setBbPerHour(hourlyRateParams.bb_per_hour.toString());
    setRakebackHourly(hourlyRateParams.rakeback_hourly.toString());
    setMonthlyHours(hourlyRateParams.monthly_hours.toString());
    setMonthlyExpenses(hourlyRateParams.monthly_expenses.toString());
  }, [hourlyRateParams]);

  const handleParamUpdate = (params: typeof hourlyRateParams) => {
    updateHourlyRateParams(params);
  };

  const handleSaveConfig = async () => {
    if (!configName.trim()) return;
    
    await saveConfig({
      name: configName,
      bb_amount: Number(bb_amount) || 0,
      bb_per_hour: Number(bb_per_hour) || 0,
      rakeback_hourly: Number(rakeback_hourly) || 0,
      monthly_hours: Number(monthly_hours) || 0,
      monthly_expenses: Number(monthly_expenses) || 0,
    });
    
    setConfigName('');
    setShowSaveModal(false);
  };

  const loadConfig = (config: typeof simulatorConfigs[0]) => {
    setBbAmount(config.bb_amount.toString());
    setBbPerHour(config.bb_per_hour.toString());
    setRakebackHourly(config.rakeback_hourly.toString());
    setMonthlyHours(config.monthly_hours.toString());
    setMonthlyExpenses(config.monthly_expenses.toString());
    
    handleParamUpdate({
      bb_amount: config.bb_amount,
      bb_per_hour: config.bb_per_hour,
      rakeback_hourly: config.rakeback_hourly,
      monthly_hours: config.monthly_hours,
      monthly_expenses: config.monthly_expenses,
    });
    
    setShowConfigs(false);
  };
  
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
        <Text style={styles.title}>Simulateur</Text>
      </View>
      
      <Card>
        <View style={styles.toolbarContainer}>
          <Text style={styles.sectionTitle}>Taux horaire estimé</Text>
          <View style={styles.toolbar}>
            <TouchableOpacity
              style={styles.toolbarButton}
              onPress={() => setShowConfigs(!showConfigs)}
            >
              <ChevronDown size={20} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.toolbarButton}
              onPress={() => setShowSaveModal(true)}
            >
              <Save size={20} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>

        {showConfigs && simulatorConfigs.length > 0 && (
          <View style={styles.configsList}>
            {simulatorConfigs.map(config => (
              <TouchableOpacity
                key={config.id}
                style={styles.configItem}
                onPress={() => loadConfig(config)}
              >
                <Text style={styles.configName}>{config.name}</Text>
                <TouchableOpacity
                  onPress={() => deleteSimulatorConfig(config.id)}
                  hitSlop={8}
                >
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <Input
          label="Montant de la BB jouée ($)"
          value={bb_amount}
          onChangeText={(text) => {
            setBbAmount(text);
            handleParamUpdate({
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
            handleParamUpdate({
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
            handleParamUpdate({
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
            handleParamUpdate({
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
            handleParamUpdate({
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

      <Modal
        visible={showSaveModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSaveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sauvegarder la configuration</Text>
            <TextInput
              style={styles.modalInput}
              value={configName}
              onChangeText={setConfigName}
              placeholder="Nom de la configuration"
              placeholderTextColor="#94a3b8"
            />
            <View style={styles.modalButtons}>
              <Button
                title="Annuler"
                onPress={() => setShowSaveModal(false)}
                variant="secondary"
                style={styles.modalButton}
              />
              <Button
                title="Sauvegarder"
                onPress={handleSaveConfig}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  toolbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolbarButton: {
    padding: 8,
    marginLeft: 8,
  },
  configsList: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginBottom: 16,
    padding: 8,
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  configName: {
    fontSize: 14,
    color: '#0f172a',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    marginLeft: 8,
  },
});