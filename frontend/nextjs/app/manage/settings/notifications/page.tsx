'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import { getCurrentUser } from '../../../../lib/auth';
import { useToast } from '../../../../components/ToastProvider';

interface NotificationSettings {
  id?: string;
  // Email
  email_enabled: boolean;
  email_appeal_status: boolean;
  email_appeal_assigned: boolean;
  email_appeal_comment: boolean;
  email_appeal_new: boolean;
  email_appeal_overdue: boolean;
  email_appeal_escalated: boolean;
  email_daily_summary: boolean;
  // Push
  push_enabled: boolean;
  push_appeal_status: boolean;
  push_appeal_assigned: boolean;
  push_appeal_comment: boolean;
  push_appeal_new: boolean;
  push_appeal_overdue: boolean;
  push_appeal_escalated: boolean;
