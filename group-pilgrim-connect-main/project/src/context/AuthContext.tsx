import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, UserFormData, AuthState } from '@/types/user';
import { useAppContext } from './AppContext';
import { toast } from 'sonner';
import bcrypt from 'bcryptjs';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  createUser: (userData: UserFormData) => Promise<void>;
  updateUser: (id: string, userData: UserFormData) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'nusuk_auth';
const ADMIN_KEY = 'nusuk_admin_setup';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useAppContext();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // Load auth state from localStorage on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const { user, isAuthenticated } = JSON.parse(stored);
          setState(prev => ({
            ...prev,
            user,
            isAuthenticated,
            isLoading: false
          }));
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadAuthState();
  }, []);

  // Save auth state to localStorage when it changes
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }));
    }
  }, [state.user, state.isAuthenticated, state.isLoading]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('nusuk_users') || '[]');
      const user = users.find((u: User) => u.username === credentials.username);

      if (!user || !user.isActive) {
        throw new Error(language === 'en' 
          ? 'Invalid credentials or account is inactive' 
          : 'بيانات غير صحيحة أو الحساب غير نشط'
        );
      }

      // Verify password
      const isValid = await bcrypt.compare(credentials.password, user.password);
      if (!isValid) {
        throw new Error(language === 'en' 
          ? 'Invalid credentials' 
          : 'بيانات غير صحيحة'
        );
      }

      // Update last login
      user.lastLogin = new Date().toISOString();
      user.rememberMe = credentials.rememberMe;

      // Update user in storage
      const updatedUsers = users.map((u: User) => 
        u.id === user.id ? user : u
      );
      localStorage.setItem('nusuk_users', JSON.stringify(updatedUsers));

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });

      toast.success(language === 'en' 
        ? 'Login successful' 
        : 'تم تسجيل الدخول بنجاح'
      );
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }));
      toast.error(language === 'en' 
        ? 'Login failed' 
        : 'فشل تسجيل الدخول'
      );
    }
  };

  const logout = () => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
    toast.success(language === 'en' 
      ? 'Logged out successfully' 
      : 'تم تسجيل الخروج بنجاح'
    );
  };

  const createUser = async (userData: UserFormData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Check if user exists
      const users = JSON.parse(localStorage.getItem('nusuk_users') || '[]');
      if (users.some((u: User) => u.username === userData.username)) {
        throw new Error(language === 'en' 
          ? 'Username already exists' 
          : 'اسم المستخدم موجود بالفعل'
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password!, 10);

      // Create new user
      const newUser: User = {
        id: crypto.randomUUID(),
        ...userData,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        isActive: true
      };

      // Save to storage
      localStorage.setItem('nusuk_users', JSON.stringify([...users, newUser]));

      toast.success(language === 'en' 
        ? 'User created successfully' 
        : 'تم إنشاء المستخدم بنجاح'
      );
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }));
      toast.error(language === 'en' 
        ? 'Failed to create user' 
        : 'فشل في إنشاء المستخدم'
      );
    }
  };

  const updateUser = async (id: string, userData: UserFormData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const users = JSON.parse(localStorage.getItem('nusuk_users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === id);

      if (userIndex === -1) {
        throw new Error(language === 'en' 
          ? 'User not found' 
          : 'لم يتم العثور على المستخدم'
        );
      }

      // Update user data
      const updatedUser: User = {
        ...users[userIndex],
        ...userData,
        password: userData.password 
          ? await bcrypt.hash(userData.password, 10)
          : users[userIndex].password
      };

      // Update in storage
      users[userIndex] = updatedUser;
      localStorage.setItem('nusuk_users', JSON.stringify(users));

      // Update current user if it's the logged-in user
      if (state.user?.id === id) {
        setState(prev => ({
          ...prev,
          user: updatedUser,
          isLoading: false
        }));
      }

      toast.success(language === 'en' 
        ? 'User updated successfully' 
        : 'تم تحديث المستخدم بنجاح'
      );
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }));
      toast.error(language === 'en' 
        ? 'Failed to update user' 
        : 'فشل في تحديث المستخدم'
      );
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const users = JSON.parse(localStorage.getItem('nusuk_users') || '[]');
      const filteredUsers = users.filter((u: User) => u.id !== id);

      if (filteredUsers.length === users.length) {
        throw new Error(language === 'en' 
          ? 'User not found' 
          : 'لم يتم العثور على المستخدم'
        );
      }

      // Update storage
      localStorage.setItem('nusuk_users', JSON.stringify(filteredUsers));

      // Logout if deleted user is the current user
      if (state.user?.id === id) {
        logout();
      }

      toast.success(language === 'en' 
        ? 'User deleted successfully' 
        : 'تم حذف المستخدم بنجاح'
      );
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }));
      toast.error(language === 'en' 
        ? 'Failed to delete user' 
        : 'فشل في حذف المستخدم'
      );
    }
  };

  const resetPassword = async (email: string) => {
    // TODO: Implement password reset functionality
    toast.info(language === 'en' 
      ? 'Password reset functionality coming soon' 
      : 'سيتم إضافة وظيفة إعادة تعيين كلمة المرور قريباً'
    );
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        createUser,
        updateUser,
        deleteUser,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 