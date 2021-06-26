import { useState } from "react";
import { createContext, ReactNode, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { auth, firebase } from "../services/firebase";

type User = {
    id: string;
    name: string;
    avatar: string | null;
  }
  
  
  type AuthContextType = {
    user: User | undefined ;
    signInWithGoogle: () => Promise<void>;
  }
  
  
  export const AuthContext = createContext({} as AuthContextType);


  type AuthContextProvederProps = {
      children: ReactNode;
  }
export function AuthContextProvider(props: AuthContextProvederProps){
    const [user, setUser] = useState<User>();
    const {addToast} = useToasts();
    const history = useHistory();

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if(user){
          const {displayName, photoURL, uid} = user;
          
          if(!displayName || !photoURL){
           addToast('Dados do google faltando!', {appearance:'error'})
           history.push('/')
           return;
          }
  
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL,
          })
        }
      })
  
  
      return () => {
        unsubscribe();
      }
    }, [addToast, history])
  
    async function signInWithGoogle(){
      const provider = new firebase.auth.GoogleAuthProvider();
  
  
      const result = await auth.signInWithPopup(provider);
      
    
          if(result.user){
            const {displayName, photoURL, uid} = result.user;
          
           if(!displayName || !photoURL){
             throw new Error('Missing information from Google Account.');
           }
  
           setUser({
             id: uid,
             name: displayName,
             avatar: photoURL,
           })
          }
     
    }

    return (
        <AuthContext.Provider value={{user, signInWithGoogle}}>
            {props.children}
      </AuthContext.Provider>
    );
}