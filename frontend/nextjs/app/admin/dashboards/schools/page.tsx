'use client';

import React, { useEffect, useState } from 'react';
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
