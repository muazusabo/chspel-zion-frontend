export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';
export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type GivingType =
  | 'OFFERING'
  | 'TITHE'
  | 'DONATION'
  | 'SPECIAL_CONTRIBUTION'
  | 'BUILDING_PROJECT'
  | 'OTHER';
export type PaymentStatus = 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
export type ReceiptRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type AnnouncementCategory =
  | 'GENERAL' | 'MEETING' | 'PRAYER' | 'BIBLE_STUDY'
  | 'EVANGELISM' | 'FELLOWSHIP' | 'IMPORTANT' | 'EMERGENCY';
export type AnnouncementPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type GalleryCategory =
  | 'WORSHIP' | 'BIBLE_STUDY' | 'PRAYER' | 'EVANGELISM'
  | 'RETREAT' | 'FELLOWSHIP' | 'OUTREACH' | 'EVENTS' | 'EXECUTIVES';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  studentId?: string | null;
  department?: string | null;
  faculty?: string | null;
  level?: string | null;
  profilePicture?: string | null;
  role: Role;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  status: ContentStatus;
  publishedAt?: string | null;
  createdAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  featuredImage?: string | null;
  excerpt?: string | null;
  content: string;
  category?: string | null;
  status: ContentStatus;
  publishedAt?: string | null;
  author?: { id: string; fullName: string } | null;
}

export interface FcsEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime?: string | null;
  venue: string;
  imageUrl?: string | null;
  organizer?: string | null;
  status: EventStatus;
}

export interface Executive {
  id: string;
  fullName: string;
  position: string;
  department?: string | null;
  level?: string | null;
  photoUrl?: string | null;
  biography?: string | null;
  order: number;
  isActive: boolean;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  caption?: string | null;
  category: GalleryCategory;
  isFeatured: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  reference: string;
  amount: string;
  givingType: GivingType;
  note?: string | null;
  status: PaymentStatus;
  createdAt: string;
  metadata?: { transactionScreenshotUrl?: string | null; transferReference?: string | null; transferDate?: string | null } | null;
  receipt?: { id: string; receiptNumber: string; pdfUrl?: string | null } | null;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  verificationCode: string;
  requestedName?: string | null;
  amount?: string | number | null;
  paymentType?: GivingType | null;
  paymentMethod?: string | null;
  issuedAt?: string | null;
  pdfUrl?: string | null;
  createdAt: string;
  transaction: Transaction;
  user?: { fullName: string; email: string };
}

export interface ReceiptRequest {
  id: string;
  userId: string;
  transactionId: string;
  requestedName: string;
  status: ReceiptRequestStatus;
  adminNote?: string | null;
  requestedAt: string;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  receiptId?: string | null;
  receipt?: Receipt | null;
  transaction: Transaction;
  user?: { id: string; fullName: string; email: string } | null;
}

export interface ChapelAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface HomepageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription?: string | null;
  heroImageUrl?: string | null;
  welcomeMessage?: string | null;
  welcomeImageUrl?: string | null;
  missionPreview?: string | null;
  visionPreview?: string | null;
}

export interface AboutContent {
  whoWeAre?: string | null;
  mission?: string | null;
  vision?: string | null;
  values?: string | null;
  whatWeDo?: string | null;
}

export interface Scripture {
  verseText: string;
  reference: string;
}

export interface FellowshipSettings {
  fcsName: string;
  chapelName?: string | null;
  logoUrl?: string | null;
  contactEmail?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  whatsappUrl?: string | null;
  youtubeUrl?: string | null;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  timestamp: string;
}
