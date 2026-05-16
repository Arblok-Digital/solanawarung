import { Timestamp } from 'firebase/firestore';

export enum OrderStatus {
  PENDING_ESCROW = 'PENDING_ESCROW',
  PREPARING = 'PREPARING',
  SHIPPING = 'SHIPPING',
  ESCROW = 'ESCROW',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Product {
  id?: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  sellerId: string;
  createdAt?: Timestamp;
}

export interface Order {
  id?: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  productName: string;
  amount: number;
  status: OrderStatus;
  deliveryStatus?: 'PREPARING' | 'SHIPPING';
  transactionSignature?: string;
  createdAt?: Timestamp;
}

export interface UserProfile {
  uid: string;
  role: 'buyer' | 'seller';
  walletAddress?: string;
  warungName?: string;
  location?: string;
  category?: string;
  email?: string | null;
  createdAt?: any;
}

export interface ProductAnalysis {
  name: string;
  category: string;
  description: string;
  estimatedPrice: number;
}