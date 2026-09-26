import type { AnnouncementCategory, AnnouncementPriority } from '@/types';

export const CATEGORY_LABELS: Record<AnnouncementCategory, string> = {
  GENERAL: 'General',
  MEETING: 'Meeting',
  PRAYER: 'Prayer',
  BIBLE_STUDY: 'Bible Study',
  EVANGELISM: 'Evangelism',
  FELLOWSHIP: 'Fellowship',
  IMPORTANT: 'Important',
  EMERGENCY: 'Emergency',
};

export const PRIORITY_VARIANT: Record<AnnouncementPriority, 'default' | 'gold' | 'urgent'> = {
  LOW: 'default',
  NORMAL: 'default',
  HIGH: 'gold',
  URGENT: 'urgent',
};
