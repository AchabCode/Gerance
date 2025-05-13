// components/AuthStatus.tsx
import React from 'react'
import {
    TouchableOpacity,
    Text,
    Alert,
    StyleSheet,
    Platform,
} from 'react-native'
import { User as UserIcon } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/context/AuthContext'

export const AuthStatus: React.FC = () => {
    const { user, loading, signOut } = useAuth()
    const router = useRouter()

    if (loading) return null
    if (user) {
        const askLogout = () => {
            if (Platform.OS === 'web') {
                if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) signOut()
            } else {
                Alert.alert(
                    'Déconnexion',
                    'Voulez-vous vraiment vous déconnecter ?',
                    [
                        { text: 'Annuler', style: 'cancel' },
                        { text: 'Se déconnecter', style: 'destructive', onPress: signOut },
                    ],
                )
            }
        }

        return (
            <TouchableOpacity style={styles.badge} onPress={askLogout}>
                <UserIcon size={14} color="#10B981" />
                <Text style={styles.email}>{user.email}</Text>
            </TouchableOpacity>
        )
    }
    return (
        <TouchableOpacity
            style={[styles.badge, styles.signIn]}
            onPress={() => router.replace('/login')}
        >
            <Text style={styles.link}>Se connecter</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#f1f5f9',
    },
    signIn: { backgroundColor: '#e0f2fe' },
    email: { marginLeft: 6, fontSize: 12, color: '#0f172a' },
    link: { fontSize: 12, color: '#3B82F6', fontWeight: '500' },
})
