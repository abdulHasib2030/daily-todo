import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import React from 'react';
import { useState } from 'react';
import { createContext } from 'react';
import { auth } from '../firebase/firebase';
import { useEffect } from 'react';

const provider = new GoogleAuthProvider();
export  const AuthContext = createContext()
const AuthProviders = ({children}) => {
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const subscribe = onAuthStateChanged(auth,( currentuser)=>{
            currentuser ? setUser(currentuser) : setUser(null)
            setLoading(false)

        })
        return ()=>{
            subscribe()
        }
    }, [])

    const createUser = (email, password) =>{
      
     return  createUserWithEmailAndPassword(auth, email, password)
 
    }
    const login = (email, password)=>{
       
        return signInWithEmailAndPassword(auth, email, password)
    }
    const google = () =>{
      return  signInWithPopup(auth, provider)
    }
    const logout = () =>{
        return signOut(auth)
    }
    const authInfo = {
     user,
     createUser, login, google,  logout, loading
    }
    return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
};

export default AuthProviders;