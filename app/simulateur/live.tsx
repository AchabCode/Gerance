import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { useAppContext } from '@/context/AppContext';
import { calculateHourlyRate } from '@/utils/calculations';
import { useRouter } from 'expo-router';
import { ArrowLeft, LayoutDashboard } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';

export default function LiveSimulatorScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [amount_of_bb, setAmountOfBb] = useState('');
  const [bb_won, setBbWon] = useState('');
  const [rb_percent, setRbPercent] = useState('');
  const [month_hours, setMonthHours] = useState('');
  const [mensual_fees, setMensualFees] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      loadSimulatorData();
    }
  }, [user?.id]);

  const loadSimulatorData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('simulator_cashgame_live')
        .select('*')
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error loading simulator data:', error);
        Alert.alert('Erreur', 'Impossible de charger vos données');
        return;
      }

      if (data && data.length > 0) {
        const savedData = data[0];
        setAmountOfBb(savedData.amount_of_bb?.toString() || '');
        setBbWon(savedData.bb_won?.toString() || '');
        setRbPercent(savedData.rb_percent?.toString() || '');
        setMonthHours(savedData.month_hours?.toString() || '');
        setMensualFees(savedData.mensual_fees?.toString() || '');
      }
    } catch (error) {
      console.error('Error loading simulator data:', error);
      Alert.alert('Erreur', 'Impossible de charger vos données');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      console.log('No user found, cannot save');
      return;
    }

    try {
      const { data: existingData, error: checkError } = await supabase
        .from('simulator_cashgame_live')
        .select('id')
        .eq('user_id', user.id);

      if (checkError) {
        console.error('Error checking existing data:', checkError);
        Alert.alert('Erreur', 'Impossible de vérifier les données existantes');
        return;
      }

      const dataToSave = {
        user_id: user.id,
        amount_of_bb: amount_of_bb ? parseInt(amount_of_bb) : null,
        bb_won: bb_won ? parseInt(bb_won) : null,
        rb_percent: rb_percent ? parseInt(rb_percent) : null,
        month_hours: month_hours ? parseInt(month_hours) : null,
        mensual_fees: mensual_fees ? parseInt(mensual_fees) : null,
      };

      let result;
      if (existingData && existingData.length > 0) {
        result = await supabase
          .from('simulator_cashgame_live')
          .update(dataToSave)
          .eq('user_id', user.id)
          .select();
      } else {
        result = await supabase
          .from('simulator_cashgame_live')
          .insert(dataToSave)
          .select();
      }

      if (result.error) {
        console.error('Error saving simulator data:', result.error);
        Alert.alert('Erreur', 'Impossible de sauvegarder vos données');
        return;
      }

      Alert.alert('Succès', 'Configuration sauvegardée');
    } catch (error) {
      console.error('Error saving simulator data:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder vos données');
    }
  };

  const handleReset = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('simulator_cashgame_live')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error resetting simulator:', error);
        Alert.alert('Erreur', 'Impossible de réinitialiser la configuration');
        return;
      }

      setAmountOfBb('');
      setBbWon('');
      setRbPercent('');
      setMonthHours('');
      setMensualFees('');

      Alert.alert('Succès', 'Configuration réinitialisée');
    } catch (error) {
      console.error('Error resetting simulator:', error);
      Alert.alert('Erreur', 'Impossible de réinitialiser la configuration');
    }
  };
  
  const hourlyRate = calculateHourlyRate(
    Number(amount_of_bb) || 0,
    Number(bb_won) || 0,
    Number(rb_percent) || 0
  );

  const monthlyEarnings = hourlyRate * (Number(month_hours) || 0);
  const monthlyNetEarnings = monthlyEarnings - (Number(mensual_fees) || 0);

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
        <Text style={styles.title}>Simulateur Live</Text>
      </View>
      
      <Card>
        <Text style={styles.sectionTitle}>Taux horaire estimé</Text>
        
        <Input
          label="Montant de la BB jouée ($)"
          value={amount_of_bb}
          onChangeText={setAmountOfBb}
          keyboardType="decimal-pad"
          placeholder="Entrez le montant de la BB"
        />
        
        <Input
          label="BB gagnées par heure"
          value={bb_won}
          onChangeText={setBbWon}
          keyboardType="decimal-pad"
          placeholder="Entrez le nombre de BB/heure"
        />
        
        <Input
          label="Rakeback (%)"
          value={rb_percent}
          onChangeText={setRbPercent}
          keyboardType="decimal-pad"
          placeholder="Entrez le pourcentage de rakeback"
        />
        
        <Input
          label="Nombre d'heures jouées dans le mois"
          value={month_hours}
          onChangeText={setMonthHours}
          keyboardType="decimal-pad"
          placeholder="Entrez le nombre d'heures par mois"
        />

        <Input
          label="Frais mensuels ($)"
          value={mensual_fees}
          onChangeText={setMensualFees}
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

        <Button
          title="💾 Sauvegarder"
          onPress={handleSave}
          variant="primary"
          style={styles.saveButton}
        />

        <Button
          title="🔄 Réinitialiser"
          onPress={handleReset}
          variant="secondary"
          style={styles.resetButton}
        />
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
  saveButton: {
    marginBottom: 12,
  },
  resetButton: {
    marginTop: 0,
  },
});