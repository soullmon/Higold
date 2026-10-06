export type CategoryId = string;

export type SubcategoryId = string;

export type ProductSeries = 'Diamond' | 'Shearer' | 'Arena' | 'Fashion' | 'Stainless 304' | string;

export type CMSAccessRole = 'admin' | 'cs_support';

export type UserRole = 'admin' | 'cs_support' | 'customer_pro' | 'customer_regular';

// 7 Explicit Account Types requested:
// Admin, CS, Pelanggan, Kontraktor, Retailer, Konsultan, Konsultan & Kontraktor
export type OfficialAccountType = 
  | 'Admin'
  | 'CS'
  | 'Pelanggan'
  | 'Kontraktor'
  | 'Retailer'
  | 'Konsultan'
  | 'Konsultan & Kontraktor';

// User Categories
export type UserCategoryType = 
  | 'kontraktor' 
  | 'retailer' 
  | 'user' 
  | 'konsultan' 
  | 'konsultan_dan_kontraktor';

export type RoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export type AccountStatus = 'active' | 'pending_approval' | 'suspended';

export interface RoyaltyVoucher {
  id: string;
  code: string;
  title: string;
  discountPercent: number;
  minSpend: number;
  maxDiscount: number;
  validUntil: string;
}

export interface PointRewardItem {
  id: string;
  title: string;
  category: 'travel' | 'gold_bar' | 'hardware' | 'voucher';
  pointsRequired: number;
  description: string;
  stock: number;
  imageUrl?: string;
  badge?: string;
}

export interface PromotionCampaign {
  id: string;
  title: string;
  code: string;
  discountPercent: number;
  minSpend: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'scheduled';
  targetAudience: 'all' | 'kontraktor' | 'retailer' | 'konsultan';
  usedCount: number;
}

export interface PointRedemptionClaim {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  rewardId: string;
  rewardTitle: string;
  pointsSpent: number;
  claimDate: string;
  status: 'pending' | 'approved' | 'shipped';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string; // Nomor WhatsApp
  avatarUrl?: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    deliveryNotes?: string;
  };
  accountType: 'retail' | 'b2b';
  officialAccountType?: OfficialAccountType;
  userCategory?: UserCategoryType;
  royaltyTier?: RoyaltyTier;
  royaltyPoints?: number;
  points?: number;
  royaltyVouchers?: RoyaltyVoucher[];
  isEmailVerified: boolean;
  joinedDate: string;
}

export interface CMSUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  officialAccountType?: OfficialAccountType;
  userCategory?: UserCategoryType;
  royaltyTier?: RoyaltyTier;
  royaltyPoints?: number;
  status: AccountStatus;
  companyOrProject?: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  lastLogin?: string;
  notes?: string;
}

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  tagline: string;
  description: string;
  subcategories: { id: SubcategoryId; name: string }[];
  heroImage: string;
  iconUrl?: string; // Uploaded icon image (PNG/SVG/JPG)
  iconType?: string; // Built-in icon type: 'corner-units' | 'larder-units' | 'base-units' | 'midway-units' | 'sink-faucets' | string
  isCustom?: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  status: 'published' | 'pending' | 'rejected';
  reply?: {
    author: string;
    role: CMSAccessRole;
    text: string;
    date: string;
  };
}

export interface CustomerReportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerContact: string;
  type: 'warranty_claim' | 'installation_help' | 'product_inquiry' | 'complaint' | 'quotation';
  title: string;
  description: string;
  relatedProduct?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  notes?: string;
  responses?: {
    id: string;
    sender: string;
    senderRole: CMSAccessRole;
    message: string;
    timestamp: string;
  }[];
}

export type MediaItemType = 'image' | 'video' | 'dimension';

export interface ProductMediaItem {
  id: string;
  type: MediaItemType;
  url: string;
  title?: string;
  thumbnailUrl?: string;
}

// Every size can have a distinct SKU number (Higold CMS requirement)
export interface ProductSizeVariant {
  sizeWidth: number; // e.g. 600, 700, 800, 900 mm
  sku: string; // Distinct SKU per size
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  dimensions: {
    width: number;
    depth: number;
    height: number;
  };
}

export interface Product {
  id: string;
  sku: string; // Base / default SKU
  name: string;
  categoryId: CategoryId;
  subcategoryId: SubcategoryId;
  series: ProductSeries;
  shortDesc: string;
  fullDesc: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  cabinetWidths: number[]; // e.g. [450, 600, 800, 900] mm
  variants?: ProductSizeVariant[]; // Individual SKU and price per size
  minCabinetDims: {
    width: number;
    depth: number;
    height: number;
  };
  openingDirections?: ('Kiri (Left)' | 'Kanan (Right)' | 'Universal')[];
  finishOptions: string[];
  material: string;
  loadCapacity: string;
  softCloseMechanism: string;
  warranty: string;
  features: string[];
  inStock: boolean;
  leadTime?: string;
  isFeatured?: boolean;
  imageUrl?: string;
  galleryImages?: string[];
  videoUrl?: string;
  dimensionImageUrl?: string;
  mediaList?: ProductMediaItem[];
  // Official Higold product display fields:
  location?: string; // e.g. "Jakarta Barat", "Surabaya", "Tangerang"
  soldCount?: number; // e.g. 250
  rating?: number; // e.g. 5.0
  promoBadge?: string; // e.g. "Beli Lokal", "Guncang 11.11", "Exclusive Deals", "Terlaris"
  isFreeOngkir?: boolean;
  svgVisualType: 
    | 'magic-corner' 
    | 'swing-tray' 
    | 'show-hand' 
    | 'revolving' 
    | 'tall-larder' 
    | 'swivel-tall' 
    | 'base-basket' 
    | 'pandora' 
    | 'garbage-cleaning' 
    | 'midway-rack' 
    | 'sink' 
    | 'faucet';
}

export interface CartItem {
  id: string; // unique item composite key
  productId: string;
  product: Product;
  selectedWidth: number;
  selectedSku: string; // Specific SKU of the selected size
  selectedOpening?: string;
  selectedFinish: string;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  companyOrProject?: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  distanceKm?: number;
  notes?: string;
}

export type OrderTrackingStatus = 
  | 'diproses' 
  | 'qc_gudang' 
  | 'diserahkan_kurir' 
  | 'dalam_pengiriman' 
  | 'sampai_tujuan';

export interface OrderTrackingStep {
  status: OrderTrackingStatus;
  title: string;
  description: string;
  time: string;
  completed: boolean;
}

export type OrderWorkflowStatus = 
  | 'menunggu_pembayaran' 
  | 'diproses' 
  | 'selesai' 
  | 'dibatalkan';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  shippingCarrier: string;
  shippingCost: number;
  isFreeShipping: boolean;
  distanceKm?: number;
  trackingNumber: string; // No Resi Pengiriman
  trackingStatus: OrderTrackingStatus;
  trackingTimeline: OrderTrackingStep[];
  totalAmount: number;
  // User specified: "Saya ingin menggunakan payment dengan no rek dan QR saja"
  paymentMethod: 'bank_transfer_bca' | 'bank_transfer_mandiri' | 'qris' | 'bca_transfer' | 'bca_va';
  paymentStatus: 'pending_verification' | 'confirmed' | 'processing';
  orderStatus?: OrderWorkflowStatus; // Workflow: Menunggu Pembayaran -> Di Proses -> Selesai / Dibatalkan
  paymentDeadline?: string; // Batas bayar 24 jam
  invoiceNumber?: string;
  orderNotes?: string;
  whatsappConfirmationSent?: boolean;
}

export interface CSContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  whatsappNumber: string;
  avatarColor: string;
  status: string;
  specialty: string;
}

export interface ShowroomBooking {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  projectType: string;
  preferredDate: string;
  preferredTime: string;
  numberOfGuests: number;
  notes?: string;
  status: 'confirmed' | 'pending';
}

export interface PdfCatalogItem {
  id: string;
  title: string;
  filename: string;
  category: 'master' | 'technical' | 'sink' | 'manual';
  categoryLabel: string;
  fileSize: string;
  pageCount: number;
  year: string;
  thumbnailUrl?: string;
  description: string;
  downloadCount: number;
  downloadUrl?: string;
}

export interface CompanyOfficialConfig {
  bankName: string;
  bankBranch: string;
  bankAccountNumber: string;
  bankAccountName: string;
  mandiriAccountNumber: string;
  mandiriAccountName: string;
  qrisMerchantName: string;
  freeShippingMaxDistanceKm: number;
  showroomTitle: string;
  showroomAddress: string;
  showroomDistrict: string;
  showroomOperatingHours: string;
  showroomPhone: string;
  showroomWhatsapp: string;
  welcomeVoucherAmount: number;
  memberDiscountPercent: number;
  proDiscountPercent: number;
}
