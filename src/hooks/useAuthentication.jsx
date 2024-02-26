import {db} from "../firebase/config";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
    sendPasswordResetEmail
} from 'firebase/auth'

import { useState, useEffect } from 'react'

export const useAuthentication = () => {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)

    // cleanup
    // deal with memory leak

    const [cancelled, setCancelled] = useState(false)

    const auth = getAuth()

    function checkIfIsCancelled() {
        if (cancelled) {
            return;
        }
    }
    // Register
    const createUser = async (data) => {
        checkIfIsCancelled();
    
        setError(null);
    
        try {
            setLoading(true); // Coloque setLoading(true) aqui
            const { user } = await createUserWithEmailAndPassword (
                auth,
                data.email,
                data.password
            )
    
            await updateProfile(user, {
                displayName: data.displayName
            });
    
            return user // Retorne aqui
    
        } catch (error) {
            console.log(error.message)
    
            let systemErrorMessage;
    
            if(error.message.includes("Password")) {
                systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres."
            } else if (error.message.includes("email-already")) {
                systemErrorMessage = "E-mail já cadastrado."
            } else {
                systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
            }
    
            setError(systemErrorMessage)
    
            throw error; // Lance o erro novamente
        } finally {
            setLoading(false); // Coloque setLoading(false) no finally para garantir que sempre seja chamado
        }
    };

    

    // logout
    const logout = () => {

        checkIfIsCancelled();
        signOut(auth);
    };

    // login

    const login = async(data) => {
        checkIfIsCancelled()

        setLoading(true)
        setError(false)

        try {
            await signInWithEmailAndPassword(auth, data.email, data.password)
            setLoading(false)

        } catch (error) {
            
            let systemErrorMessage;

            if(error.message.includes('user-not-found')) {
                systemErrorMessage = "Usuário não encontrado.";
            } else if(error.message.includes('wrong-password')) {
                systemErrorMessage = "Senha incorreta.";
            } else {
                systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde."
            }

            setError(systemErrorMessage);
            setLoading(false);
         }
    }   
    
    
    // esqueci minha senha
    const resetPassword = async (email) => {
        const auth = getAuth();
        return sendPasswordResetEmail(auth, email);
      };

    useEffect(() => {
        return () => setCancelled(true);
    }, []);

    return {
        auth,
        createUser,
        error,
        loading,
        logout,
        login,
        resetPassword,
    };
};
