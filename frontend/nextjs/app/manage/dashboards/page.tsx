'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';

type Row = { status: string; count: number };
type StatusLabel = {
  key: string;
  label: string;
  color: string;
};

const statusLabels: StatusLabel[] = [
  { key: 'new', label: 'Новое', color: '#3B82F6' },
  { key: 'in_progress', label: 'В работе', color: '#F59E0B' },
  { key: 'waiting', label: 'Ждём инфо', color: '#EF4444' },
  { key: 'closed', label: 'Закрыто', color: '#10B981' },
];

export default function AdminDashboards() {
  const [rows, setRows] = useState<Row[]>([]);
  const [dailyData, setDailyData] = useState<Array<{ date: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [stats, setStats] = useState({
