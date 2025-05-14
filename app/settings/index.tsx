import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Key, User, ArrowLeft } from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Se déconnecter', 
          style: 'destructive',
          onPress: () => signOut()
        },
      ]
    );
  };

  const handleChangePassword = () => {
    // To be implemented
    Alert.alert('À venir', 'Cette fonctionnalité sera bientôt disponible');
  };

  const handleAccountSettings = () => {
    // To be implemented
    Alert.alert('À venir', 'Cette fonctionnalité sera bientôt disponible');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.title}>Paramètres</Text>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Compte</Text>
        
        <TouchableOpacity style={styles.option} onPress={handleAccountSettings}>
          <User size={20} color="#64748b" />
          <Text style={styles.optionText}>Informations du compte</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleChangePassword}>
          <Key size={20} color="#64748b" />
          <Text style={styles.optionText}>Changer le mot de passe</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.option, styles.logoutOption]} onPress={handleSignOut}>
          <LogOut size={20} color="#ef4444" />
          <Text style={[styles.optionText, styles.logoutText]}>Se déconnecter</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  optionText: {
    fontSize: 16,
    color: '#0f172a',
    marginLeft: 12,
  },
  logoutOption: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  logoutText: {
    color: '#ef4444',
  },
});