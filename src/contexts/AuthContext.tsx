import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, UserRole, RegisterData, RiderVerificationData } from '../types';
import { api } from '../services/api';
import { storage } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  verifyRider: (data: RiderVerificationData) => Promise<void>;
  uploadProfilePicture: (file: any) => Promise<string>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const storedUser = await storage.getUser();
      const storedToken = await storage.getToken();
      
      if (storedUser && storedToken) {
        api.setToken(storedToken);
        setUser(storedUser);
      } else {
        api.setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
      setUser(null);
      api.setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const initAuth = async () => {
      await refreshUser();
      if (mounted) {
        setLoading(false);
      }
    };
    initAuth();
    return () => { mounted = false; };
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.login(email, password, role);
      setUser(res.user);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.register(data);
      setUser(res.user);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    storage.clearAll();
    api.setToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const updatedUser = { ...user, ...data };
      await storage.setUser(updatedUser);
      setUser(updatedUser);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const verifyRider = useCallback(async (data: RiderVerificationData) => {
    if (!user || user.role !== 'rider') return;
    
    setLoading(true);
    try {
      const updatedUser = { 
        ...user, 
        isVerified: true,
        licenseNumber: data.licenseNumber,
        vehicleType: data.vehicleType,
        vehiclePlate: data.vehiclePlate,
        profileComplete: true
      };
      
      await storage.setUser(updatedUser);
      setUser(updatedUser);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const uploadProfilePicture = useCallback(async (file: any): Promise<string> => {
    const res = await api.uploadAvatar(file);
    return res.url;
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    verifyRider,
    uploadProfilePicture,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}