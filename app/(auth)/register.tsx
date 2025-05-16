import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { supabase } from '@/lib/supabase';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validateUsername = (username: string) => {
    return /^[a-zA-Z0-9]+$/.test(username);
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError(null);

      if (password !== confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      if (!validateUsername(username)) {
        throw new Error('Le pseudo ne peut contenir que des lettres et des chiffres');
      }

      // Check if username exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingUser) {
        throw new Error('Ce pseudo est déjà utilisé');
      }

      // Sign up user
      const { error: signUpError, data: { user } } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      // Update profile with username
      if (user) {
        const { error: updateError } = await supabase
          .from('users')
          .update({ username })
          .eq('id', user.id);

        if (updateError) throw updateError;
      }

      router.replace('/(tabs)');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inscription</Text>
        <Text style={styles.subtitle}>Créez votre compte pour commencer</Text>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <Input
        label="Pseudo"
        value={username}
        onChangeText={setUsername}
        placeholder="Choisissez un pseudo"
        autoCapitalize="none"
      />

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
        placeholder="Choisissez un mot de passe"
        secureTextEntry
      />

      <Input
        label="Confirmer le mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirmez votre mot de passe"
        secureTextEntry
      />

      <Button
        title="S'inscrire"
        onPress={handleRegister}
        loading={loading}
        style={styles.button}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Déjà un compte ?</Text>
        <Link href="/login" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>Se connecter</Text>
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
});