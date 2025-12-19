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
      setLoading(true);
      setError(null);

      // Вычисляем дату начала
      let startDate: Date | null = null;
      if (dateRange !== 'all') {
        const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
        startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
      }

      // Получаем все обращения
      let query = supabase.from('appeals').select('id, status, priority, institute, created_at');

      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data: appeals, error: appealsError } = await query;

      if (appealsError) {
        setError(appealsError.message);
        setLoading(false);
        return;
      }

      // Группируем по школам
      const schoolsMap = new Map<string, SchoolStats>();

      // Инициализируем все школы
      SCHOOLS.forEach((school) => {
        schoolsMap.set(school.code, {
          code: school.code,
          name: school.shortName,
          total: 0,
          by_status: { new: 0, in_progress: 0, waiting: 0, closed: 0 },
          by_priority: { low: 0, normal: 0, high: 0, urgent: 0 },
        });
      });

      // Обрабатываем обращения
      (appeals || []).forEach((appeal: any) => {
        const institute = appeal.institute || '';
        let schoolCode: string | null = null;

        // Ищем школу по коду или названию
        for (const school of SCHOOLS) {
          if (
            institute.toLowerCase().includes(school.code.toLowerCase()) ||
            institute.toLowerCase().includes(school.shortName.toLowerCase()) ||
            school.fullName.toLowerCase().includes(institute.toLowerCase())
          ) {
            schoolCode = school.code;
            break;
          }
        }

        if (!schoolCode) {
          schoolCode = 'Другое';
        }

        if (!schoolsMap.has(schoolCode)) {
          schoolsMap.set(schoolCode, {
            code: schoolCode,
            name: schoolCode,
            total: 0,
            by_status: { new: 0, in_progress: 0, waiting: 0, closed: 0 },
            by_priority: { low: 0, normal: 0, high: 0, urgent: 0 },
          });
        }

        const schoolStats = schoolsMap.get(schoolCode)!;
        schoolStats.total += 1;
        schoolStats.by_status[appeal.status as keyof typeof schoolStats.by_status] += 1;
        if (appeal.priority) {
          schoolStats.by_priority[appeal.priority as keyof typeof schoolStats.by_priority] += 1;
        }
      });

      // Преобразуем в массив и сортируем
      const schoolsArray = Array.from(schoolsMap.values())
        .filter((s) => s.total > 0 || SCHOOLS.some((sch) => sch.code === s.code))
        .sort((a, b) => b.total - a.total);

      setSchoolsData(schoolsArray);
    } catch (err) {
      setError('Произошла ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  }

  const selectedSchoolData = selectedSchool
    ? schoolsData.find((s) => s.code === selectedSchool)
    : null;

  const pieData = schoolsData
    .filter((s) => s.total > 0)
    .map((s) => ({
      name: s.name,
      value: s.total,
    }));

  const COLORS = [
    '#D11F2A',
    '#2A7FFF',
    '#2E8B57',
    '#F5B301',
    '#1F2A44',
    '#6B7280',
    '#8B5CF6',
    '#EC4899',
    '#14B8A6',
    '#F97316',
    '#6366F1',
    '#84CC16',
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold font-sf-display light:text-gray-900">
            Статистика по школам ДВФУ
          </h1>
          <p className="mt-2 text-sm sm:text-base text-white/70 max-w-3xl light:text-gray-600">
            Распределение обращений по школам и институтам ДВФУ
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl sm:rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-xs sm:text-sm text-red-400 light:bg-red-50 light:border-red-200 light:text-red-700">
          {error}
        </div>
      )}

      {/* Фильтр по датам */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setDateRange('7d')}
          className={`px-4 py-2 rounded-lg border text-sm transition ${
            dateRange === '7d'
              ? 'border-oss-red bg-oss-red/20 text-white'
              : 'border-white/20 text-white/80 hover:border-white/40'
          }`}
        >
          7 дней
        </button>
        <button
          onClick={() => setDateRange('30d')}
          className={`px-4 py-2 rounded-lg border text-sm transition ${
            dateRange === '30d'
              ? 'border-oss-red bg-oss-red/20 text-white'
              : 'border-white/20 text-white/80 hover:border-white/40'
          }`}
        >
          30 дней
        </button>
        <button
          onClick={() => setDateRange('90d')}
          className={`px-4 py-2 rounded-lg border text-sm transition ${
            dateRange === '90d'
              ? 'border-oss-red bg-oss-red/20 text-white'
              : 'border-white/20 text-white/80 hover:border-white/40'
          }`}
        >
          90 дней
        </button>
        <button
          onClick={() => setDateRange('all')}
          className={`px-4 py-2 rounded-lg border text-sm transition ${
            dateRange === 'all'
              ? 'border-oss-red bg-oss-red/20 text-white'
              : 'border-white/20 text-white/80 hover:border-white/40'
          }`}
        >
          Все время
        </button>
      </div>

      {/* Общая статистика */}
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
          <div className="text-xs sm:text-sm text-white/60 light:text-gray-500">Всего школ</div>
          <div className="mt-2 text-2xl sm:text-3xl font-semibold light:text-gray-900">
            {loading ? '…' : schoolsData.filter((s) => s.total > 0).length}
          </div>
        </div>
        <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
          <div className="text-xs sm:text-sm text-white/60 light:text-gray-500">Всего обращений</div>
          <div className="mt-2 text-2xl sm:text-3xl font-semibold light:text-gray-900">
            {loading ? '…' : schoolsData.reduce((sum, s) => sum + s.total, 0)}
          </div>
        </div>
        <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
          <div className="text-xs sm:text-sm text-white/60 light:text-gray-500">Среднее на школу</div>
          <div className="mt-2 text-2xl sm:text-3xl font-semibold light:text-gray-900">
            {loading
              ? '…'
              : Math.round(
                  schoolsData.reduce((sum, s) => sum + s.total, 0) /
                    Math.max(schoolsData.filter((s) => s.total > 0).length, 1)
                )}
          </div>
        </div>
        <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
          <div className="text-xs sm:text-sm text-white/60 light:text-gray-500">Лидер</div>
          <div className="mt-2 text-lg sm:text-xl font-semibold light:text-gray-900">
            {loading
              ? '…'
              : schoolsData.length > 0
                ? schoolsData[0].name
                : '—'}
          </div>
        </div>
      </div>

      {/* График распределения по школам */}
      <section className="mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold font-sf-display light:text-gray-900">
          Распределение обращений по школам
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-white/70 light:text-gray-600">
          Количество обращений от каждой школы за выбранный период.
        </p>
        {loading ? (
          <div className="mt-4 sm:mt-6 h-64 sm:h-72 flex items-center justify-center text-white/50 text-sm sm:text-base light:text-gray-500">
            Загрузка данных...
          </div>
        ) : schoolsData.length === 0 ? (
          <div className="mt-4 sm:mt-6 h-64 sm:h-72 flex items-center justify-center text-white/50 text-sm sm:text-base light:text-gray-500">
            Нет данных за выбранный период
          </div>
        ) : (
          <>
            <div className="mt-4 sm:mt-6 h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={schoolsData.filter((s) => s.total > 0)}>
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: '#fff', fontSize: 10 }}
                  />
                  <YAxis tick={{ fill: '#fff' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="total" fill="#D11F2A" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Круговая диаграмма */}
            {pieData.length > 0 && (
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </section>

      {/* Детальная таблица по школам */}
      <section className="mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold font-sf-display light:text-gray-900 mb-4">
          Детальная статистика по школам
        </h2>
        {loading ? (
          <div className="text-center text-white/50 py-8 light:text-gray-500">Загрузка...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 light:border-gray-200">
                  <th className="text-left py-3 px-4 text-white/80 light:text-gray-700">Школа</th>
                  <th className="text-center py-3 px-4 text-white/80 light:text-gray-700">Всего</th>
                  <th className="text-center py-3 px-4 text-white/80 light:text-gray-700">Новых</th>
                  <th className="text-center py-3 px-4 text-white/80 light:text-gray-700">В работе</th>
                  <th className="text-center py-3 px-4 text-white/80 light:text-gray-700">Закрыто</th>
                </tr>
              </thead>
              <tbody>
                {schoolsData
                  .filter((s) => s.total > 0)
                  .map((school, index) => (
                    <tr
                      key={school.code}
                      className={`border-b border-white/5 light:border-gray-100 cursor-pointer hover:bg-white/5 light:hover:bg-gray-50 ${
                        selectedSchool === school.code ? 'bg-oss-red/10' : ''
                      }`}
                      onClick={() => setSelectedSchool(selectedSchool === school.code ? null : school.code)}
                    >
                      <td className="py-3 px-4 font-medium text-white/90 light:text-gray-900">
                        {school.name}
                      </td>
                      <td className="py-3 px-4 text-center text-white/80 light:text-gray-700">
                        {school.total}
                      </td>
                      <td className="py-3 px-4 text-center text-blue-400 light:text-blue-600">
                        {school.by_status.new}
                      </td>
                      <td className="py-3 px-4 text-center text-yellow-400 light:text-yellow-600">
                        {school.by_status.in_progress}
                      </td>
                      <td className="py-3 px-4 text-center text-green-400 light:text-green-600">
                        {school.by_status.closed}
                      </td>
                    </tr>
                  ))}
                {schoolsData.filter((s) => s.total > 0).length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-white/50 light:text-gray-500">
                      Нет данных за выбранный период
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Детали выбранной школы */}
      {selectedSchoolData && (
        <section className="mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 light:bg-white light:border-gray-200 light:shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold font-sf-display light:text-gray-900">
              Детали: {selectedSchoolData.name}
            </h2>
            <button
              onClick={() => setSelectedSchool(null)}
              className="text-white/60 hover:text-white light:text-gray-500 light:hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-white/60 light:text-gray-500">По статусам</div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-white/80 light:text-gray-700">Новых:</span>
                  <span className="text-blue-400 light:text-blue-600">{selectedSchoolData.by_status.new}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/80 light:text-gray-700">В работе:</span>
                  <span className="text-yellow-400 light:text-yellow-600">
                    {selectedSchoolData.by_status.in_progress}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/80 light:text-gray-700">Закрыто:</span>
                  <span className="text-green-400 light:text-green-600">{selectedSchoolData.by_status.closed}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs text-white/60 light:text-gray-500">По приоритетам</div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-white/80 light:text-gray-700">Низкий:</span>
                  <span>{selectedSchoolData.by_priority.low}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/80 light:text-gray-700">Обычный:</span>
                  <span>{selectedSchoolData.by_priority.normal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/80 light:text-gray-700">Высокий:</span>
                  <span className="text-orange-400 light:text-orange-600">
                    {selectedSchoolData.by_priority.high}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/80 light:text-gray-700">Срочный:</span>
                  <span className="text-red-400 light:text-red-600">
                    {selectedSchoolData.by_priority.urgent}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

