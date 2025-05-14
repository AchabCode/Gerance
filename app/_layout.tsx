import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useFrameworkReady } from '@/hooks/useFrameworkReady'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { AppProvider } from '@/context/AppContext'

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) router.replace('/login')
    }, [loading, user])

    if (loading) return null
    return <>{children}</>
}

const KeyedProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth()
    return <AppProvider key={user?.id}>{children}</AppProvider>
}

export default function TabsLayout() {
    useFrameworkReady()

    return (
        <AuthProvider>
            <KeyedProviders>
                <Protected>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    </Stack>
                </Protected>

                <StatusBar style="auto" />
            </KeyedProviders>
        </AuthProvider>
    )
}