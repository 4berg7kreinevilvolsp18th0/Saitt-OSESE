'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabaseClient';
import { SCHOOLS, getSchoolByCode } from '../../../../lib/schools';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface SchoolStats {
  code: string;
  name: string;
  total: number;
  by_status: {
    new: number;
    in_progress: number;
    waiting: number;
    closed: number;
  };
  by_priority: {
    low: number;
    normal: number;
    high: number;
    urgent: number;
  };
}

export default function SchoolsDashboard() {
  const [schoolsData, setSchoolsData] = useState<SchoolStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    loadSchoolStats();
  }, [dateRange]);

  async function loadSchoolStats() {
    try {
