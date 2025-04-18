import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Auth,
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile as firebaseUpdateProfile,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface AuthContextProps {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserData>) => Promise<void>;
}

export interface UserData {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: string;
  lastLogin: string;
  bio?: string;
  location?: string;
  website?: string;
  fullName?: string;
  age?: number;
  gender?: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const createUserDocument = async (user: User) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    const timestamp = new Date().toISOString();
    
    if (!userSnap.exists()) {
      const newUser: UserData = {
        uid: user.uid,
        displayName: user.displayName || "Anonymous User",
        email: user.email,
        photoURL: user.photoURL,
        createdAt: timestamp,
        lastLogin: timestamp,
      };
      
      await setDoc(userRef, newUser);
      setUserData(newUser);
    } else {
      const existingUser = userSnap.data() as UserData;
      await updateDoc(userRef, { lastLogin: timestamp });
      setUserData({...existingUser, lastLogin: timestamp});
    }
  };

  const fetchUserData = async (user: User) => {
    if (!user) return null;
    
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as UserData;
      setUserData(userData);
      return userData;
    }
    
    return null;
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      const result = await signInWithPopup(auth, provider);
      await createUserDocument(result.user);
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        console.log("Popup closed by user");
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.log("Multiple popup requests");
      }
      throw error;
    }
  };

  const signInWithGithub = async () => {
    try {
      const provider = new GithubAuthProvider();
      provider.addScope('user');
      
      const result = await signInWithPopup(auth, provider);
      await createUserDocument(result.user);
    } catch (error: any) {
      console.error("Error signing in with GitHub:", error);
      if (error.code === 'auth/account-exists-with-different-credential') {
        console.log("Account exists with different credentials");
      }
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await createUserDocument(result.user);
    } catch (error) {
      console.error("Error signing in with email:", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      if (result.user) {
        await firebaseUpdateProfile(result.user, {
          displayName: displayName
        });
        
        const updatedUser = auth.currentUser;
        if (updatedUser) {
          await createUserDocument(updatedUser);
        }
      }
    } catch (error) {
      console.error("Error signing up with email:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserData(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<UserData>) => {
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, { ...data });
      
      if (data.displayName && currentUser) {
        await firebaseUpdateProfile(currentUser, {
          displayName: data.displayName
        });
      }
      
      if (data.email && currentUser && data.email !== currentUser.email) {
        await firebaseUpdateEmail(currentUser, data.email);
      }
      
      setUserData(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await fetchUserData(user);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  const value: AuthContextProps = {
    currentUser,
    userData,
    loading,
    signInWithGoogle,
    signInWithGithub,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
