import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Registro con Correo y Contraseña
  const registerWithEmail = async (email, password, displayName = '') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Guardar documento del usuario en Firestore
    const userRef = doc(db, 'users', user.uid);
    const initialData = {
      uid: user.uid,
      email: user.email,
      displayName: displayName || email.split('@')[0],
      balanceUsdt: 0.00,
      createdAt: serverTimestamp(),
      role: 'user', // user | merchant | p2p_agent
      lastLogin: serverTimestamp()
    };

    await setDoc(userRef, initialData);
    setUserProfile(initialData);
    return user;
  };

  // Inicio de Sesión
  const loginWithEmail = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  // Cerrar Sesión
  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  // Cargar perfil desde Firestore cuando cambie la sesión de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          } else {
            // Si no existe perfil en Firestore, crearlo con saldo 0
            const fallbackProfile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email.split('@')[0],
              balanceUsdt: 0.00,
              createdAt: serverTimestamp()
            };
            await setDoc(userDocRef, fallbackProfile);
            setUserProfile(fallbackProfile);
          }
        } catch (e) {
          console.warn("Firestore fetch notice (posible modo offline/reglas):", e);
          setUserProfile({
            uid: user.uid,
            email: user.email,
            displayName: user.email.split('@')[0],
            balanceUsdt: 0.00
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    setUserProfile,
    registerWithEmail,
    loginWithEmail,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
