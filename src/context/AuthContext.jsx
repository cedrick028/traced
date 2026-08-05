/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { supabase } from "../service/supabase";

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [isSignInLoading, setIsSignInLoading] = useState(false);
  const [isSignOutLoading, setIsSignOutLoading] = useState(false);
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const getSession = async () => {
      setIsAuthLoading(true)
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) throw error;

        setSession(session);
        setUser(session?.user ?? null)
        setDisplayName(session?.user?.user_metadata?.display_name ?? "")
      } catch (error) {
        console.log(error)
        setSession(null)
        setUser(null)
        setDisplayName("")
      } finally {
        setIsAuthLoading(false)
      }
    }

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null)
      setDisplayName(session?.user?.user_metadata?.display_name ?? "")
    });

    return () => {
      subscription.unsubscribe();
    }
  }, [])


  const signUp = async (name, username, password) => {
    setIsSignUpLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: username,
        password: password,
        options: {
          data: {
            display_name: name
          }
        }
      })

      if (error) throw error;

      return { data, error: null }
    } catch (error) {
      console.log(error)
      return { data: null, error }
    } finally {
      setIsSignUpLoading(false)
    }
  }

  const signIn = async (username, password) => {
    setIsSignInLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password
      })

      if (error) throw error;

      return { data, error: null }
    } catch (error) {
      console.log(error)
      return { data: null, error }
    } finally {
      setIsSignInLoading(false)
    }
    
  }

  const signOut = async () => {
    setIsSignOutLoading(true)
    try {
      const { error } = await supabase.auth.signOut()

      if (error) throw error;
    } finally {
      setIsSignOutLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ signUp, signIn, signOut, isAuthLoading, isSignUpLoading, isSignInLoading, isSignOutLoading, user, session, displayName }}>
      { children }
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }