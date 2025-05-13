import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BankrollItem, BankrollItemType } from '../types';
import { Input } from './Input';
import { Button } from './Button';
import { Card } from './Card';
import { useAppContext } from '../context/AppContext';

interface BankrollItemFormProps {
  item?: BankrollItem;
  type: BankrollItemType;
  onClose: () => void;
}

export const BankrollItemForm: React.FC<BankrollItemFormProps> = ({ item, type, onClose }) => {
  const { addBankrollItem, updateBankrollItem } = useAppContext();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{ name?: string; amount?: string }>({});

  useEffect(() => {
    if (item) {
      setName(item.name);
      setAmount(item.amount.toString());
    }
  }, [item]);

  const getTypeLabel = (): string => {
    switch (type) {
      case 'cash':
        return 'Cash';
      case 'poker_site':
        return 'Site de poker';
      case 'bank_account':
        return 'Compte bancaire';
      case 'crypto':
        return 'Crypto';
      default:
        return 'Item';
    }
  };

  const validate = (): boolean => {
    const newErrors: { name?: string; amount?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Le montant est requis';
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) < 0) {
      newErrors.amount = 'Montant invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const itemData = {
      type,
      name,
      amount: parseFloat(amount),
    };

    if (item) {
      updateBankrollItem({ ...itemData, id: item.id });
    } else {
      addBankrollItem(itemData);
    }

    onClose();
  };

  return (
    <Card>
      <Text style={styles.title}>{item ? 'Modifier' : 'Ajouter'} {getTypeLabel()}</Text>
      
      <Input
        label="Nom"
        value={name}
        onChangeText={setName}
        placeholder={type === 'poker_site' ? 'Winamax' : type === 'bank_account' ? 'Compte courant' : ''}
        error={errors.name}
      />
      
      <Input
        label="Montant (€)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        placeholder="0.00"
        error={errors.amount}
      />
      
      <View style={styles.buttons}>
        <Button
          title="Annuler"
          onPress={onClose}
          variant="secondary"
          style={styles.cancelButton}
        />
        <Button
          title="Enregistrer"
          onPress={handleSubmit}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#0f172a',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  cancelButton: {
    marginRight: 12,
  },
});