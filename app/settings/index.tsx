import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Key, User, ArrowLeft, Check } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        throw new Error('Mot de passe actuel incorrect');
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
        
        <View style={styles.emailContainer}>
          <User size={20} color="#64748b" />
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <TouchableOpacity 
          style={styles.option} 
          onPress={() => setShowPasswordForm(!showPasswordForm)}
        >
          <Key size={20} color="#64748b" />
          <Text style={styles.optionText}>Changer le mot de passe</Text>
          {success && (
            <View style={styles.successIcon}>
              <Check size={20} color="#10b981" />
            </View>
          )}
        </TouchableOpacity>

        {showPasswordForm && (
          <View style={styles.passwordForm}>
            {error && <Text style={styles.error}>{error}</Text>}
            
            <Input
              label="Mot de passe actuel"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholder="Entrez votre mot de passe actuel"
            />

            <Input
              label="Nouveau mot de passe"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="Entrez votre nouveau mot de passe"
            />

            <TouchableOpacity 
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleChangePassword}
              disabled={loading || !currentPassword || !newPassword}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Modification...' : 'Modifier le mot de passe'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.option, styles.logoutOption]} 
          onPress={handleSignOut}
        >
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
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  email: {
    fontSize: 16,
    color: '#64748b',
    marginLeft: 12,
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
    flex: 1,
  },
  logoutOption: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  logoutText: {
    color: '#ef4444',
  },
  passwordForm: {
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  error: {
    color: '#ef4444',
    marginBottom: 16,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  successIcon: {
    marginLeft: 'auto',
  },
});