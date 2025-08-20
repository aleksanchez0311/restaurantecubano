import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  updateProfile
} from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
import { app } from '../services/firebase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const auth = getAuth(app)
  const db = getFirestore(app)

  // Función para obtener el rol del usuario
  const getUserRole = async (user) => {
    if (!user) return null
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        return userDoc.data().role || 'cliente'
      }
      return 'cliente'
    } catch (error) {
      console.error('Error al obtener rol de usuario:', error)
      return 'cliente'
    }
  }

  // Registrar usuario
  async function register(email, password, name) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Actualizar el perfil con el nombre
      await updateProfile(user, { displayName: name })
      
      // Crear documento de usuario en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role: 'cliente', // Por defecto todos son clientes
        createdAt: new Date(),
        lastLogin: new Date()
      })
      
      setCurrentUser({ ...user, displayName: name })
      setUserRole('cliente')
      return user
    } catch (error) {
      throw error
    }
  }

  // Iniciar sesión
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Actualizar última fecha de inicio de sesión
      await setDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date()
      }, { merge: true })
      
      const role = await getUserRole(user)
      setCurrentUser(user)
      setUserRole(role)
      return user
    } catch (error) {
      throw error
    }
  }

  // Iniciar sesión con Google
  async function loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      const user = userCredential.user
      
      // Verificar si es la primera vez que el usuario inicia sesión
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (!userDoc.exists()) {
        // Crear documento de usuario si no existe
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: 'cliente', // Por defecto todos son clientes
          createdAt: new Date(),
          lastLogin: new Date()
        })
      } else {
        // Actualizar última fecha de inicio de sesión
        await setDoc(doc(db, 'users', user.uid), {
          lastLogin: new Date()
        }, { merge: true })
      }
      
      const role = await getUserRole(user)
      setCurrentUser(user)
      setUserRole(role)
      return user
    } catch (error) {
      throw error
    }
  }

  // Cerrar sesión
  async function logout() {
    try {
      await signOut(auth)
      setCurrentUser(null)
      setUserRole(null)
    } catch (error) {
      throw error
    }
  }

  // Cambiar rol de usuario (solo para administradores)
  async function changeUserRole(userId, newRole) {
    try {
      await setDoc(doc(db, 'users', userId), {
        role: newRole
      }, { merge: true })
      
      // Si el usuario actual es el que está cambiando de rol, actualizar el estado
      if (currentUser && currentUser.uid === userId) {
        setUserRole(newRole)
      }
    } catch (error) {
      throw error
    }
  }

  // Verificar si el usuario tiene un rol específico
  function hasRole(requiredRole) {
    if (!userRole) return false
    
    const roles = ['cliente', 'vendedor', 'promotor', 'administrador', 'superadministrador']
    const userRoleIndex = roles.indexOf(userRole)
    const requiredRoleIndex = roles.indexOf(requiredRole)
    
    return userRoleIndex >= requiredRoleIndex
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const role = await getUserRole(user)
        setCurrentUser(user)
        setUserRole(role)
      } else {
        setCurrentUser(null)
        setUserRole(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userRole,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    changeUserRole,
    hasRole
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}