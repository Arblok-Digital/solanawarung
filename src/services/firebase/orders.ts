import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Order, OrderStatus } from '../../types';

const COLLECTION_NAME = 'orders';

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
  return await addDoc(collection(db, COLLECTION_NAME), {
    ...orderData,
    createdAt: serverTimestamp(),
  });
};

export const updateOrderStatus = async (id: string, status: OrderStatus, signature?: string) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const updateData: any = { status };
  if (signature) {
    updateData.transactionSignature = signature;
  }
  await updateDoc(docRef, updateData);
};

export const subscribeToUserOrders = (userId: string, role: 'buyer' | 'seller', callback: (orders: Order[]) => void) => {
  const field = role === 'buyer' ? 'buyerId' : 'sellerId';
  const q = query(collection(db, COLLECTION_NAME), where(field, '==', userId));
  
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
    callback(orders);
  });
};
