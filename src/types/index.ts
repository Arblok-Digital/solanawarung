export interface UserProfile {
  uid: string;
  email: string | null;
  role: 'seller' | 'buyer';
  walletAddress?: string;
  warungName?: string;
  location?: string;
  category?: string;
  profileImage?: string;
  createdAt: any;
}

export interface Product {
  id?: string;
  sellerId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt: any;
}

export interface ProductAnalysis {
  name: string;
  category: string;
  description: string;
  estimatedPrice: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PENDING_ESCROW = 'PENDING_ESCROW',
  ESCROW = 'ESCROW',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Order {
  id?: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  productName: string;
  amount: number;
  status: OrderStatus;
  txHash?: string;
  transactionSignature?: string;
  createdAt: any;
  updatedAt?: any;
}
