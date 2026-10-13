import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { ArrowLeft, Wallet, CreditCard, DollarSign, Calendar, TrendingUp, Download } from 'lucide-react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { IconCircle } from '@/components/IconCircle';

export default function RiderEarnings() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');

  const earningsData = {
    today: { total: 12500, deliveries: 5, onlineHours: 6.5 },
    week: { total: 87500, deliveries: 32, onlineHours: 42 },
    month: { total: 350000, deliveries: 128, onlineHours: 168 },
  };

  const currentData = earningsData[period];
  const walletBalance = 45000;

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Link href="/rider/dashboard" style={styles.backButton}>
          <ArrowLeft size={24} color="#D91E36" />
        </Link>
        <Text style={styles.pageTitle}>Earnings</Text>
        <View style={{ width: 48 }} />
      </View>

      <Card padding="lg" style={styles.walletCard}>
        <View style={styles.walletHeader}>
          <View style={styles.walletIcon}>
            <Wallet size={28} color="#fff" />
          </View>
          <View>
            <Text style={styles.walletLabel}>Wallet Balance</Text>
            <Text style={styles.walletAmount}>₦{walletBalance.toLocaleString()}</Text>
          </View>
        </View>
        <View style={styles.walletActions}>
          <Button
            title="Withdraw"
            variant="outline"
            size="sm"
            leftIcon={<CreditCard size={16} />}
            onPress={() => {}}
            style={styles.walletButton}
          />
          <Button
            title="Add Funds"
            variant="primary-rider"
            size="sm"
            leftIcon={<DollarSign size={16} />}
            onPress={() => {}}
            style={styles.walletButton}
          />
        </View>
      </Card>

      <View style={styles.periodTabs}>
        {(['today', 'week', 'month'] as const).map(p => (
          <Pressable
            key={p}
            onPress={() => setPeriod(p)}
            style={[
              styles.periodTab,
              period === p ? styles.periodTabActive : styles.periodTabInactive,
            ]}
          >
            <Text style={[
              styles.periodTabLabel,
              period === p ? styles.periodTabLabelActive : styles.periodTabLabelInactive,
            ]}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.statsGrid}>
        <EarningsStatCard
          title="Total Earnings"
          value={`₦${currentData.total.toLocaleString()}`}
          icon={DollarSign}
          color="#D91E36"
          bgColor="rgba(217, 30, 54, 0.1)"
        />
        <EarningsStatCard
          title="Deliveries"
          value={currentData.deliveries.toString()}
          icon={TrendingUp}
          color="#3b82f6"
          bgColor="rgba(59, 130, 246, 0.1)"
        />
        <EarningsStatCard
          title="Hours Online"
          value={`${currentData.onlineHours}h`}
          icon={Calendar}
          color="#10b981"
          bgColor="rgba(16, 185, 129, 0.1)"
        />
      </View>

      <Card padding="lg" style={styles.earningsCard}>
        <View style={styles.earningsHeader}>
          <Text style={styles.earningsTitle}>Earnings Breakdown</Text>
          <Button
            title="Export"
            variant="outline"
            size="sm"
            leftIcon={<Download size={16} />}
            onPress={() => {}}
          />
        </View>
        
        <View style={styles.breakdownList}>
          <BreakdownRow label="Base Earnings" value={`₦${(currentData.total * 0.7).toLocaleString()}`} />
          <BreakdownRow label="Tips" value={`₦${(currentData.total * 0.15).toLocaleString()}`} />
          <BreakdownRow label="Bonuses" value={`₦${(currentData.total * 0.1).toLocaleString()}`} />
          <BreakdownRow label="Referral Bonus" value={`₦${(currentData.total * 0.05).toLocaleString()}`} />
          <BreakdownRow
            label="Total"
            value={`₦${currentData.total.toLocaleString()}`}
            isTotal
          />
        </View>
      </Card>

      <Card padding="lg" style={styles.historyCard}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <View style={styles.transactionList}>
          {([
            { date: 'Today, 2:30 PM', description: 'Delivery #ORD-1245', amount: 2500, type: 'earning' as const },
            { date: 'Today, 11:15 AM', description: 'Delivery #ORD-1243', amount: 1800, type: 'earning' as const },
            { date: 'Yesterday, 4:20 PM', description: 'Delivery #ORD-1240', amount: 3200, type: 'earning' as const },
            { date: 'Yesterday, 10:00 AM', description: 'Weekly Bonus', amount: 5000, type: 'bonus' as const },
            { date: '2 days ago', description: 'Withdrawal to Bank', amount: -20000, type: 'withdrawal' as const },
          ] as const).map((tx, i) => (
            <TransactionRow key={i} transaction={tx} />
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}

interface EarningsStatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

function EarningsStatCard({ title, value, icon: Icon, color, bgColor }: EarningsStatCardProps) {
  return (
    <View style={styles.statCard}>
      <IconCircle size="lg" bgColor={bgColor}>
        <Icon size={28} color={color} />
      </IconCircle>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

interface BreakdownRowProps {
  label: string;
  value: string;
  isTotal?: boolean;
}

function BreakdownRow({ label, value, isTotal }: BreakdownRowProps) {
  return (
    <View style={[styles.breakdownRow, isTotal && styles.breakdownRowTotal]}>
      <Text style={[styles.breakdownLabel, isTotal && styles.breakdownLabelTotal]}>{label}</Text>
      <Text style={[styles.breakdownValue, isTotal && styles.breakdownValueTotal]}>{value}</Text>
    </View>
  );
}

interface TransactionRowProps {
  transaction: {
    date: string;
    description: string;
    amount: number;
    type: 'earning' | 'bonus' | 'withdrawal';
  };
}

function TransactionRow({ transaction }: TransactionRowProps) {
  const isPositive = transaction.amount > 0;
  const iconMap = {
    earning: DollarSign,
    bonus: TrendingUp,
    withdrawal: CreditCard,
  };
  const Icon = iconMap[transaction.type];

  return (
    <View style={styles.transactionRow}>
      <IconCircle size="md" bgColor={isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}>
        <Icon size={20} color={isPositive ? '#10b981' : '#ef4444'} />
      </IconCircle>
      <View style={[styles.transactionInfo, { flex: 1 }]}>
        <Text style={styles.transactionDescription}>{transaction.description}</Text>
        <Text style={styles.transactionDate}>{transaction.date}</Text>
      </View>
      <Text style={[
        styles.transactionAmount,
        isPositive ? styles.transactionAmountPositive : styles.transactionAmountNegative,
      ]}>
        {isPositive ? '+' : ''}₦{Math.abs(transaction.amount).toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#132B5E',
    flex: 1,
    textAlign: 'center',
  },
  walletCard: {
    backgroundColor: '#D91E36',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#D91E36',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  walletIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2,
  },
  walletAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  walletActions: {
    flexDirection: 'row',
    gap: 12,
  },
  walletButton: {
    flex: 1,
  },
  periodTabs: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    gap: 4,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodTabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  periodTabInactive: {},
  periodTabLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  periodTabLabelActive: {
    color: '#D91E36',
  },
  periodTabLabelInactive: {
    color: '#999',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 16,
  },
  statCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#132B5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 12,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  earningsCard: {
    marginBottom: 20,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  earningsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  breakdownList: {
    gap: 0,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  breakdownRowTotal: {
    borderBottomWidth: 0,
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  breakdownLabel: {
    fontSize: 15,
    color: '#555555',
  },
  breakdownLabelTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  breakdownValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  breakdownValueTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#D91E36',
  },
  historyCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  transactionList: {
    gap: 12,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  transactionInfo: {
    gap: 2,
  },
  transactionDescription: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  transactionAmountPositive: {
    color: '#10b981',
  },
  transactionAmountNegative: {
    color: '#ef4444',
  },
});

