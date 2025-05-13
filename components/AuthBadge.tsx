import React from 'react'
import { Pressable, View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { useAuth } from '@/context/AuthContext'
import { LogIn, LogOut, User as UserIcon } from 'lucide-react-native'
import { Link } from 'expo-router'

export const AuthBadge: React.FC = () => {
    const { user, loading, signOut } = useAuth()

    if (loading) return <ActivityIndicator style={{ marginRight: 12 }} />

    if (user)
        return (
            <Pressable style={styles.badge} onPress={signOut}>
                <UserIcon size={14} color="#10B981" />
                <Text style={styles.text}>{user.email}</Text>
                <LogOut size={14} color="#ef4444" style={{ marginLeft: 4 }} />
            </Pressable>
        )

    return (
        <Link href="/login" asChild>
            <Pressable style={[styles.badge, styles.signIn]}>
                <LogIn size={14} color="#3B82F6" />
                <Text style={styles.text}>Se connecter</Text>
            </Pressable>
        </Link>
    )
}

const styles = StyleSheet.create({
    badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 16, backgroundColor: '#f1f5f9' },
    signIn: { backgroundColor: '#e0f2fe' },
    text: { marginLeft: 4, fontSize: 12, color: '#0f172a' },
})
