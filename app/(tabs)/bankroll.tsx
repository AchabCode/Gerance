import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { BankrollItemForm } from '@/components/BankrollItemForm'
import { useAppContext } from '@/context/AppContext'
import { calculateTotalBankroll } from '@/utils/calculations'
import { BankrollItem, BankrollItemType } from '@/types'
import { Trash2, Eye, EyeOff } from 'lucide-react-native'

export default function BankrollScreen() {
  const { bankrollItems, deleteBankrollItem } = useAppContext()
  const [selectedType, setSelectedType] = useState<BankrollItemType | null>(null)
  const [editingItem, setEditingItem] = useState<BankrollItem | null>(null)
  const [showAmounts, setShowAmounts] = useState(false)

  const groupedItems: Record<BankrollItemType, BankrollItem[]> = {
    cash: bankrollItems.filter(i => i.type === 'cash'),
    poker_site: bankrollItems.filter(i => i.type === 'poker_site'),
    bank_account: bankrollItems.filter(i => i.type === 'bank_account'),
    crypto: bankrollItems.filter(i => i.type === 'crypto'),
  }

  const handleAddItem = (type: BankrollItemType) => {
    setSelectedType(type)
    setEditingItem(null)
  }

  const handleEditItem = (item: BankrollItem) => {
    setSelectedType(item.type)
    setEditingItem(item)
  }

  const handleDeleteItem = (item: BankrollItem) => {
    const ok = typeof window !== 'undefined' ? window.confirm(`Êtes-vous sûr de vouloir supprimer ${item.name} ?`) : true
    if (ok) deleteBankrollItem(item.id)
  }

  const closeForm = () => {
    setSelectedType(null)
    setEditingItem(null)
  }

  const getLabel = (t: BankrollItemType) => {
    switch (t) {
      case 'cash':
        return 'Cash'
      case 'poker_site':
        return 'Sites de poker'
      case 'bank_account':
        return 'Comptes bancaires'
      case 'crypto':
        return 'Crypto'
      default:
        return ''
    }
  }

  const formatAmount = (amount: number) => {
    return showAmounts ? amount.toLocaleString('fr-FR') : '*****';
  };

  const subtotals = {
    cash: calculateTotalBankroll(groupedItems.cash),
    poker_site: calculateTotalBankroll(groupedItems.poker_site),
    bank_account: calculateTotalBankroll(groupedItems.bank_account),
    crypto: calculateTotalBankroll(groupedItems.crypto),
  }

  const totalBankroll = calculateTotalBankroll(bankrollItems)

  const renderItemList = (type: BankrollItemType) => {
    const items = groupedItems[type]
    return (
      <Card key={type} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{getLabel(type)}</Text>
          <Text style={[styles.sectionTotal, subtotals[type] >= 0 && styles.positiveTotal]}>
            {formatAmount(subtotals[type])} €
          </Text>
        </View>
        {items.length === 0 ? (
          <Text style={styles.emptyText}>Aucun {getLabel(type).toLowerCase()} enregistré</Text>
        ) : (
          <View style={styles.itemsList}>
            {items.map(item => (
              <View key={item.id} style={styles.item}>
                <TouchableOpacity style={styles.editZone} onPress={() => handleEditItem(item)}>
                  <Text style={styles.itemName}>{item.name}</Text>
                </TouchableOpacity>
                <View style={styles.itemActions}>
                  <Text style={[styles.itemAmount, item.amount >= 0 && styles.positiveAmount]}>
                    {formatAmount(item.amount)} €
                  </Text>
                  <Pressable hitSlop={10} style={styles.deleteButton} onPress={() => handleDeleteItem(item)}>
                    <Trash2 size={16} color="#ef4444" />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
        <Button 
          title={`Ajouter ${getLabel(type).toLowerCase()}`} 
          onPress={() => handleAddItem(type)} 
          variant="secondary" 
          size="small" 
          style={styles.addButton} 
        />
      </Card>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Détail Bankroll</Text>
          <TouchableOpacity onPress={() => setShowAmounts(!showAmounts)} style={styles.eyeButton}>
            {showAmounts ? (
              <EyeOff size={24} color="#64748b" />
            ) : (
              <Eye size={24} color="#64748b" />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.totalLabel}>
          Total: <Text style={[styles.totalValue, totalBankroll >= 0 && styles.positiveTotal]}>
            {formatAmount(totalBankroll)} €
          </Text>
        </Text>
      </View>
      {selectedType ? (
        <BankrollItemForm type={selectedType} item={editingItem || undefined} onClose={closeForm} />
      ) : (
        <>
          {renderItemList('cash')}
          {renderItemList('poker_site')}
          {renderItemList('bank_account')}
          {renderItemList('crypto')}
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  contentContainer: { padding: 16 },
  header: { marginTop: 16, marginBottom: 24 },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#0f172a', marginRight: 12 },
  eyeButton: {
    padding: 8,
  },
  totalLabel: { fontSize: 16, color: '#64748b' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#3B82F6' },
  positiveTotal: { color: '#2b9553' },
  section: { marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#0f172a' },
  sectionTotal: { fontSize: 18, fontWeight: '600', color: '#10B981' },
  itemsList: { marginBottom: 12 },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  editZone: { flex: 1 },
  itemName: { fontSize: 16, color: '#0f172a', flexShrink: 1 },
  itemActions: { flexDirection: 'row', alignItems: 'center' },
  itemAmount: { fontSize: 16, fontWeight: '500', color: '#0f172a', marginRight: 12 },
  positiveAmount: { color: '#2b9553' },
  deleteButton: { padding: 4 },
  addButton: { marginTop: 8 },
  emptyText: { fontSize: 14, color: '#94a3b8', marginBottom: 12, fontStyle: 'italic' },
})