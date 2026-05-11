import { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile as updateFirebaseProfile,
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../../config/firebase';
import { UserProfile } from '../../types';
import { FirebaseError } from 'firebase/app';

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    // Try sign in first
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    // If user not found, create account automatically
    const firebaseError = error as FirebaseError;
    if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/invalid-credential') {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Set display name from email
      await updateFirebaseProfile(result.user, {
        displayName: email.split('@')[0],
      });
      return result.user;
    }
    console.error('Email login error:', error);
    throw error;
  }
};

export const loginAsDemo = async () => {
  try {
    const result = await signInAnonymously(auth);
    await updateFirebaseProfile(result.user, {
      displayName: 'Demo User',
    });
    return result.user;
  } catch (error) {
    console.error('Demo login error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};

export const createUserProfile = async (user: FirebaseUser, role: 'seller' | 'buyer'): Promise<UserProfile> => {
  const profileData: UserProfile = {
    uid: user.uid,
    email: user.email || null,
    role,
    createdAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'users', user.uid), profileData);
  return profileData;
};

export const updateProfile = async (uid: string, data: Partial<UserProfile>) => {
  const docRef = doc(db, 'users', uid);
  await setDoc(docRef, data, { merge: true });
};
