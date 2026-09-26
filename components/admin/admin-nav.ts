import {
  LayoutDashboard,
  Users,
  Megaphone,
  CalendarDays,
  UserSquare2,
  Images,
  Receipt,
  HandCoins,
  Wallet,
  Home,
  Info,
  BookMarked,
  Landmark,
  Mail,
  Shield,
  History,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import type { Role } from '@/types';

export type AdminNavBadgeKey = 'pendingReceiptRequests' | 'pendingPayments' | 'unreadMessages';

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles?: Role[];
  badgeKey?: AdminNavBadgeKey;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: '',
    items: [{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
  },
  {
    label: 'Content',
    items: [
      { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
      { label: 'Events', href: '/admin/events', icon: CalendarDays },
      { label: 'Executives', href: '/admin/executives', icon: UserSquare2 },
      { label: 'Gallery', href: '/admin/gallery', icon: Images },
    ],
  },
  {
    label: 'Giving',
    items: [
      { label: 'Receipt Requests', href: '/admin/receipts-requests', icon: Receipt, badgeKey: 'pendingReceiptRequests' },
      { label: 'Payments', href: '/admin/payments', icon: Wallet, badgeKey: 'pendingPayments' },
      { label: 'Donations', href: '/admin/donations', icon: HandCoins },
      { label: 'Offerings', href: '/admin/offerings', icon: Wallet },
    ],
  },
  {
    label: 'Site Content',
    items: [
      { label: 'Homepage', href: '/admin/homepage', icon: Home },
      { label: 'About FCS', href: '/admin/about', icon: Info },
      { label: 'Scripture', href: '/admin/scripture', icon: BookMarked },
      { label: 'Chapel Account', href: '/admin/chapel', icon: Landmark },
    ],
  },
  {
    label: '',
    items: [{ label: 'Contact Messages', href: '/admin/messages', icon: Mail, badgeKey: 'unreadMessages' }],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Users', href: '/admin/users', icon: Users },
      { label: 'Admins', href: '/admin/admins', icon: Shield, roles: ['SUPER_ADMIN'] },
      { label: 'Activity Logs', href: '/admin/logs', icon: History },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];
