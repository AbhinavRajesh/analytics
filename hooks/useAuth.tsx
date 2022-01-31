import Loading from "@components/Loading";
import { onIdTokenChanged, signOut, User } from "firebase/auth";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "utils/firebase";

interface ContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  user: User | null;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<ContextProps>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  logout: () => {},
  loading: true,
});

interface Props {
  children: JSX.Element;
}

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged((user) => {
      setUser(user);
      setIsAuthenticated(true);
      setLoading(false);
      setInitialLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    setLoading(true);
    signOut(auth)
      .then(() => setIsAuthenticated(false))
      .finally(() => setLoading(false));
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, logout, loading }}
    >
      {initialLoading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): ContextProps => {
  const { isAuthenticated, setIsAuthenticated, user, logout, loading } =
    useContext(AuthContext);

  return { user, isAuthenticated, setIsAuthenticated, logout, loading };
};

export default AuthProvider;
