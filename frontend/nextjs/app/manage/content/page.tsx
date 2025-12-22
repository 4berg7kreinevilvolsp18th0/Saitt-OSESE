'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import Badge from '../../../components/Badge';
import { DIRECTIONS } from '../../../lib/directions';
import SearchBar from '../../../components/SearchBar';
import { useToast } from '../../../components/ToastProvider';

type ContentItem = {
  id: string;
  type: 'news' | 'guide' | 'faq';
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  direction_id: string | null;
  direction_title?: string;
};

export default function AdminContentPage() {
  const toast = useToast();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [filterType, setFilterType] = useState<'all' | 'news' | 'guide' | 'faq'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    try {
      setLoading(true);
