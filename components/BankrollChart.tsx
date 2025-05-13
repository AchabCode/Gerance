import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { format, subDays, subMonths, subYears, startOfDay, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BankrollHistory } from '../types';

type TimeRange = 'daily' | 'monthly' | 'yearly';

interface BankrollChartProps {
  data: BankrollHistory[];
}

export const BankrollChart: React.FC<BankrollChartProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [selectedPoint, setSelectedPoint] = useState<BankrollHistory | null>(null);

  const filterDataByTimeRange = (range: TimeRange) => {
    const now = new Date();
    const startDate = startOfDay(
      range === 'daily'
        ? subDays(now, 30)
        : range === 'monthly'
        ? subMonths(now, 12)
        : subYears(now, 5)
    );

    return data
      .filter(point => isAfter(new Date(point.date), startDate))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const formatDate = (date: string) => {
    switch (timeRange) {
      case 'daily':
        return format(new Date(date), 'dd/MM', { locale: fr });
      case 'monthly':
        return format(new Date(date), 'MMM yy', { locale: fr });
      case 'yearly':
        return format(new Date(date), 'yyyy', { locale: fr });
    }
  };

  const filteredData = filterDataByTimeRange(timeRange);
  const chartData = {
    labels: filteredData.map(point => formatDate(point.date)),
    datasets: [
      {
        data: filteredData.map(point => point.amount),
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const handleDataPointClick = (data: { index: number }) => {
    setSelectedPoint(filteredData[data.index]);
  };

  // Calculate max value for Y axis
  const maxValue = Math.max(...filteredData.map(point => point.amount));
  const yAxisMax = Math.ceil(maxValue / 5000) * 5000;
  const yAxisStep = yAxisMax / 5;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Évolution de la bankroll</Text>
        <View style={styles.timeRangeButtons}>
          <TouchableOpacity
            style={[styles.button, timeRange === 'daily' && styles.activeButton]}
            onPress={() => setTimeRange('daily')}
          >
            <Text style={[styles.buttonText, timeRange === 'daily' && styles.activeButtonText]}>
              Jour
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, timeRange === 'monthly' && styles.activeButton]}
            onPress={() => setTimeRange('monthly')}
          >
            <Text style={[styles.buttonText, timeRange === 'monthly' && styles.activeButtonText]}>
              Mois
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, timeRange === 'yearly' && styles.activeButton]}
            onPress={() => setTimeRange('yearly')}
          >
            <Text style={[styles.buttonText, timeRange === 'yearly' && styles.activeButtonText]}>
              Année
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {filteredData.length > 0 ? (
        <>
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#f1f5f9',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#3B82F6',
              },
              count: 6,
              stepSize: yAxisStep,
              formatYLabel: (value) => {
                const num = parseInt(value);
                if (num >= 1000000) {
                  return `${Math.round(num / 1000000)}M`;
                }
                if (num >= 1000) {
                  return `${Math.round(num / 1000)}k`;
                }
                return num.toString();
              }
            }}
            bezier
            style={styles.chart}
            onDataPointClick={handleDataPointClick}
            segments={5}
            fromZero
          />

          {selectedPoint && (
            <View style={styles.tooltip}>
              <Text style={styles.tooltipDate}>
                {format(new Date(selectedPoint.date), 'dd/MM/yyyy', { locale: fr })}
              </Text>
              <Text style={styles.tooltipAmount}>
                {selectedPoint.amount.toLocaleString('fr-FR')} €
              </Text>
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Aucune donnée disponible pour cette période
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  timeRangeButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#f1f5f9',
  },
  activeButton: {
    backgroundColor: '#3B82F6',
  },
  buttonText: {
    fontSize: 14,
    color: '#64748b',
  },
  activeButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  tooltip: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  tooltipDate: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  tooltipAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3B82F6',
  },
  emptyState: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
});