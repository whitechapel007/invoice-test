import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  AuthError,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth } from "../services/firebase";

// 1. Define the types for the context state and methods
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Auth Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listener for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Add this useEffect to handle redirect result
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User signed in successfully
          console.log("Google login successful:", result.user);
        }
      } catch (err) {
        handleAuthError(err);
      }
    };

    handleRedirectResult();
  }, []);

  // --- Helper: Handle Auth Errors ---
  const handleAuthError = (err: unknown) => {
    const firebaseError = err as AuthError;
    const message =
      firebaseError.message || "An unknown authentication error occurred.";
    setError(message.replace("Firebase: Error (auth/", "").replace(").", ""));
    console.error("Auth Error:", err);

    setTimeout(() => {
      setError(null);
    }, 4000);

    throw err;
  };

  // --- Auth Methods ---
  const login = async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      handleAuthError(err);
    }
  };

  const signup = async (email: string, password: string) => {
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      handleAuthError(err);
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      handleAuthError(err);
    }
  };

  // --- Google Login ---
  const loginWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({ prompt: "select_account" });

      // Use redirect instead of popup
      await signInWithRedirect(auth, provider);
    } catch (err) {
      const firebaseError = err as AuthError;

      // Handle "popup cancelled" gracefully

      // Other errors → show them
      handleAuthError(firebaseError);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    loginWithGoogle,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
