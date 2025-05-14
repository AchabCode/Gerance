import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.replace('/(tabs)');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!email) {
        setError('Veuillez entrer votre email');
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setResetSent(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Connexion</Text>
        <Text style={styles.subtitle}>Bienvenue sur votre gestionnaire de bankroll</Text>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      {resetSent && (
        <Text style={styles.success}>
          Un email de réinitialisation a été envoyé à {email}
        </Text>
      )}

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="votre@email.com"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Input
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        placeholder="Votre mot de passe"
        secureTextEntry
      />

      <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
      </TouchableOpacity>

      <Button
        title="Se connecter"
        onPress={handleLogin}
        loading={loading}
        style={styles.button}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Pas encore de compte ?</Text>
        <Link href="/register" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>S'inscrire</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  error: {
    color: '#ef4444',
    marginBottom: 16,
  },
  success: {
    color: '#10b981',
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#64748b',
    marginRight: 8,
  },
  link: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#64748b',
    fontSize: 14,
  },
});