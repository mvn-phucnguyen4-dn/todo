import { createContext, useContext, useState, useCallback } from "react";

const defaultIsAuthenticated = false;
export const AuthContext = createContext({
  isAuthenticated: defaultIsAuthenticated,
  setIsAuthenticated: () => {},
  checkAuth: () => Promise.resolve(),
  logoutClient: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    defaultIsAuthenticated
  );

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token')

    if (token) setIsAuthenticated(true);
  }, []);

  const logoutClient = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
  };

  const authContextData = {
    isAuthenticated,
    setIsAuthenticated,
    checkAuth,
    logoutClient,
  };

  return (
    <AuthContext.Provider value={authContextData}>
      {children}{" "}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
