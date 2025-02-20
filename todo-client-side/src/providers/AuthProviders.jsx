import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import React from 'react';
import { useState } from 'react';
import { createContext } from 'react';
import { auth } from '../firebase/firebase';
import { useEffect } from 'react';

export  const AuthContext = createContext()
const AuthProviders = ({children}) => {
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        const subscribe = onAuthStateChanged(auth,( currentuser)=>{
            currentuser ? setUser(currentuser) : setUser(null)
            setLoading(false)
        })
    }, [])

    const createUser = (email, password) =>{
      setLoading(true)
     return  createUserWithEmailAndPassword(auth, email, password)
 
    }
    const login = (email, password)=>{
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }
    const authInfo = {
     user,
     createUser, login
    }
    return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
};

export default AuthProviders;