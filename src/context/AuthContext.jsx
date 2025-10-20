import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, doc, getDoc, serverTimestamp, setDoc } from '../firebase/config';


const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveUserToLocalStorage = (user) => {
    if (user) {
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        provider: user.providerData[0]?.providerId,
        lastLogin: new Date().toISOString()
      };
      localStorage.setItem('currentUser', JSON.stringify(userData));
    } else {
      localStorage.removeItem('currentUser');
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('Loaded user from localStorage:', userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    if (displayName) {
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
    }

    return userCredential;
  };

  const login = async (email, password) => {
    const resultNative = await signInWithEmailAndPassword(auth, email, password);
    saveUserToLocalStorage(resultNative.data)
  };

  const logout = async () => {
    localStorage.removeItem('currentUser');
    await signOut(auth);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Add this function to save user to Firestore
const saveUserToFirestore = async (user) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLoginAt: serverTimestamp(),
      provider: 'google.com',
    };

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        ...userData,
        role: 'user', 
        createdAt: serverTimestamp(),
        plan: 'free',
        totalGenerations: 0,
      });
      console.log('New user saved to Firestore:', user.email);
    } else {
      await setDoc(userRef, userData, { merge: true });
      console.log('User login updated in Firestore:', user.email);
    }
  } catch (error) {
    console.error('Error saving user to Firestore:', error);
  }
};

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const resultGoogle = await signInWithPopup(auth, provider);
    const user = resultGoogle.user
    saveUserToLocalStorage(user);
    console.log('Google user saved to localStorage:', {
      name: resultGoogle.user.displayName,
      email: resultGoogle.user.email,
      photo: resultGoogle.user.photoURL
    });
    await saveUserToFirestore(user);
    return resultGoogle;
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      // Sync with localStorage
      if (user) {
        saveUserToLocalStorage(user);
      } else {
        localStorage.removeItem('currentUser');
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    signInWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}