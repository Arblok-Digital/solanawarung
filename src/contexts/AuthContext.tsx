import React, { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { UserProfile } from '../types';
import { getUserProfile, loginWithGoogle, loginWithEmail, loginAsDemo, logoutUser, createUserProfile } from '../services/firebase/auth';
import { seedDemoData } from '../services/firebase/seed';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  login: () => Promise<void>;
  loginEmail: (email: string, password: string) => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => Promise<void>;
  registerRole: (role: 'seller' | 'buyer') => Promise<void>;
  switchRole: (role: 'seller' | 'buyer') => Promise<void>;
  seedData: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userProfile = await getUserProfile(currentUser.uid);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    await loginWithGoogle();
  };

  const loginEmailHandler = async (email: string, password: string) => {
    await loginWithEmail(email, password);
  };

  const loginDemoHandler = async () => {
    await loginAsDemo();
  };

  const logout = async () => {
    await logoutUser();
  };

  const registerRole = async (role: 'seller' | 'buyer') => {
    if (!user) return;
    const newProfile = await createUserProfile(user, role);
    setProfile(newProfile);
  };

  const switchRole = async (role: 'seller' | 'buyer') => {
    if (!user || !profile) return;
    const updatedProfile = { ...profile, role };
    await setDoc(doc(db, 'users', user.uid), updatedProfile);
    setProfile(updatedProfile);
  };

  const seedData = async () => {
    if (!user) return;
    await seedDemoData(user.uid);
    // Refresh profile to trigger UI update
    const p = await getUserProfile(user.uid);
    setProfile(p);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, loginEmail: loginEmailHandler, loginDemo: loginDemoHandler, logout, registerRole, switchRole, seedData }}>
      {children}
    </AuthContext.Provider>
  );
};
