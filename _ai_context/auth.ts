import { auth, db } from '../../config/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp,
  updateDoc 
} from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { UserProfile } from '../../types';

/**
 * Sinkronisasi User ke Firestore.
 * Menjamin profil user tersimpan permanen di database.
 */
export const syncUserProfile = async (user: FirebaseUser, rolePreference?: 'buyer' | 'seller') => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Jika user baru pertama kali login
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      nama: user.displayName || 'User Baru',
      foto: user.photoURL || '',
      role: rolePreference || 'buyer', // Default jadi buyer kalau belum pilih
      createdAt: serverTimestamp(),
    };
    await setDoc(userRef, newProfile);
    
    // Buat juga Wallet untuk user baru
    await setDoc(doc(db, 'wallets', user.uid), {
      uid: user.uid,
      saldo: 0,
      updatedAt: serverTimestamp()
    });

    return newProfile;
  } else {
    // Jika user sudah ada, kembalikan profil yang ada
    return userSnap.data() as UserProfile;
  }
};

/**
 * Update Role User (Misal dari Buyer jadi Seller).
 * Inilah yang menjamin "Account Toko" tersimpan permanen.
 */
export const updateUserRole = async (uid: string, newRole: 'buyer' | 'seller') => {
  const userRef = doc(db, 'users', uid);
  try {
    await updateDoc(userRef, {
      role: newRole,
      updatedAt: serverTimestamp()
    });
    console.log(`Role updated to ${newRole} for user ${uid}`);
    return true;
  } catch (error) {
    console.error("Gagal update role:", error);
    throw error;
  }
};