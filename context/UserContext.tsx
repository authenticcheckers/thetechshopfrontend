import { createContext, useState, ReactNode } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
}

// ✅ Export UserContext
export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
