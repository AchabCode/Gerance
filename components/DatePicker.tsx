import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DatePickerProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  error,
}) => {
  const [show, setShow] = React.useState(false);

  const handleChange = (_: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {Platform.OS === 'web' ? (
        <input
          type="date"
          value={format(value, 'yyyy-MM-dd')}
          onChange={(e) => onChange(new Date(e.target.value))}
          style={styles.webInput}
        />
      ) : (
        <>
          <TouchableOpacity
            onPress={() => setShow(true)}
            style={[styles.button, error && styles.errorBorder]}
          >
            <Text style={styles.buttonText}>
              {format(value, 'dd MMMM yyyy', { locale: fr })}
            </Text>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              value={value}
              mode="date"
              display="default"
              onChange={handleChange}
            />
          )}
        </>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 6,
  },
  button: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
  },
  buttonText: {
    fontSize: 14,
    color: '#0f172a',
  },
  errorBorder: {
    borderColor: '#ef4444',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  webInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#0f172a',
    width: '100%',
  },
});