import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Product } from '../../types';

const COLLECTION_NAME = 'products';

export const createProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
  return await addDoc(collection(db, COLLECTION_NAME), {
    ...product,
    createdAt: serverTimestamp(),
  });
};

export const updateProduct = async (id: string, data: Partial<Product>) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, data);
};

export const deleteProduct = async (id: string) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};

export const subscribeToSellerProducts = (sellerId: string, callback: (products: Product[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), where('sellerId', '==', sellerId));
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    callback(products);
  });
};

export const getAllProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
};
