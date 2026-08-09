// ============================================
// Enums / Union types — schema se match
// ============================================
export type PackageCategory = "Economy" | "Deluxe" | "VIP";
export type RoomType = "Quad" | "Triple" | "Double" | "Single";
export type PaymentStatus = "Pending" | "Partially Paid" | "Paid" | "Refunded";
export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";
export type VisaStatus = "Not Submitted" | "Processing" | "Approved" | "Rejected";
export type UserRole = "admin" | "agent" | "customer";
export type PreferredLanguage = "en" | "ur" | "ar";
export type LeadSource = "Website" | "WhatsApp" | "Facebook" | "Referral" | "Walk-in";
export type LeadStatus = "New" | "Contacted" | "Follow-up" | "Converted" | "Lost";
export type PaymentMethod = "JazzCash" | "Easypaisa" | "Bank Transfer" | "Cash" | "Card";
export type TransactionStatus = "Pending" | "Verified" | "Failed";
export type NotificationChannel = "WhatsApp" | "SMS" | "Email";
export type NotificationStatus = "Sent" | "Failed" | "Delivered";

// ============================================
// 1. PROFILE
// ============================================
export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  cnic: string | null;
  role: UserRole;
  preferred_language: PreferredLanguage;
  agent_commission_rate: number;
  created_at: string;
}

// ============================================
// 2. PACKAGE
// ============================================
export interface RoomPricing {
  id?: string;
  package_id?: string;
  room_type: RoomType;
  price: number;
  currency: string;
}

export interface Package {
  id: string;
  title: string;
  slug: string;
  category: PackageCategory;
  duration_days: number;
  departure_city: string;
  hotel_makkah: string;
  hotel_madinah: string;
  makkah_distance: string | null;
  madinah_distance: string | null;
  flights_included: boolean;
  visa_included: boolean;
  transport_included: boolean;
  ziyarat_included: boolean;
  cover_image_url?: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  /** Joined from package_room_pricing */
  room_pricing: RoomPricing[];
}

// ============================================
// 3. LEAD (CRM)
// ============================================
export interface Lead {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  message: string | null;
  source: LeadSource;
  interested_package_id: string | null;
  assigned_agent_id: string | null;
  status: LeadStatus;
  created_at: string;
  /** Joined */
  packages?: { title: string; category: PackageCategory } | null;
  assigned_agent?: { full_name: string } | null;
}

// ============================================
// 4. BOOKING
// ============================================
export interface Booking {
  id: string;
  booking_number: string;
  user_id: string;
  package_id: string;
  agent_id: string | null;
  room_type: RoomType;
  total_amount: number;
  paid_amount: number;
  payment_status: PaymentStatus;
  booking_status: BookingStatus;
  cancellation_reason: string | null;
  refund_amount: number;
  created_at: string;
  /** Joined */
  packages?: { title: string; category: PackageCategory; hotel_makkah: string; hotel_madinah: string } | null;
  profiles?: { full_name: string; phone: string } | null;
}

// ============================================
// 5. PASSENGER
// ============================================
export interface Passenger {
  id: string;
  booking_id: string;
  full_name: string;
  cnic: string | null;
  passport_number: string;
  passport_expiry: string;
  passport_file_url: string | null;
  photo_file_url: string | null;
  visa_status: VisaStatus;
  visa_file_url: string | null;
  expiry_alert_sent: boolean;
  created_at: string;
}

// ============================================
// 6. TRANSACTION
// ============================================
export interface Transaction {
  id: string;
  booking_id: string;
  amount: number;
  method: PaymentMethod;
  reference_number: string | null;
  status: TransactionStatus;
  verified_by: string | null;
  receipt_url: string | null;
  created_at: string;
  /** Joined */
  bookings?: { booking_number: string; user_id: string } | null;
}

// ============================================
// 7. NOTIFICATION LOG
// ============================================
export interface NotificationLog {
  id: string;
  recipient_phone: string;
  channel: NotificationChannel;
  template_name: string;
  related_booking_id: string | null;
  status: NotificationStatus;
  sent_at: string;
}

// ============================================
// 8. REVIEW
// ============================================
export interface Review {
  id: string;
  booking_id: string | null;
  customer_name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
}
