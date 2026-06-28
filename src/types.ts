/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  category: string;
  tags: string[];
  sellerId: string;
  rating: number;
  reviewsCount: number;
  isFakeReviewAudited?: boolean;
  competitorPrice?: number;
}

export interface Auction {
  id: string;
  productId: string;
  title: string;
  description: string;
  image: string;
  startingPrice: number;
  currentBid: number;
  minIncrement: number;
  endTime: string; // ISO string
  sellerId: string;
  highBidder: string | null;
  bidsCount: number;
  status: 'active' | 'ended';
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  isSuspicious: boolean;
  suspicionReason?: string;
}

export interface Order {
  id: string;
  buyerName: string;
  deliveryAddress: {
    street: string;
    city: string;
    pincode: string;
  };
  items: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  totalAmount: number;
  loyaltyPointsEarned: number;
  status: 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  createdAt: string;
  trackingTimeline: {
    status: string;
    time: string;
    description: string;
  }[];
  qrCodeData: string;
}

export interface Seller {
  id: string;
  shopName: string;
  ownerName: string;
  rating: number;
  badges: string[]; // 'Top Rated', 'Fast Shipper', 'New Arrival'
  isVerified: boolean;
  verificationStatus: 'unsubmitted' | 'pending' | 'verified' | 'rejected';
  verificationDocUrl?: string;
  revenue: number;
  salesCount: number;
  analytics: {
    salesHeatmap: { day: string; hour: string; sales: number }[];
    reorderAlerts: { productId: string; title: string; currentStock: number; suggestedReorder: number }[];
    revenueForecast: { date: string; amount: number }[];
  };
}

export interface Dispute {
  id: string;
  orderId: string;
  buyerName: string;
  sellerId: string;
  reason: string;
  details: string;
  status: 'pending' | 'resolved_refunded' | 'resolved_dismissed';
  createdAt: string;
  resolutionNotes?: string;
}

export interface LiveStream {
  id: string;
  sellerId: string;
  shopName: string;
  title: string;
  viewerCount: number;
  isActive: boolean;
  streamUrl: string;
  featuredProductId: string;
  messages: { userName: string; text: string; time: string }[];
}
