import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MockWalletContextType {
  user: { address: string; name: string } | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  address: string | null;
}

const MockWalletContext = createContext<MockWalletContextType | undefined>(undefined);

export const MockWalletProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ address: string; name: string } | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = () => {
    const mockUser = {
      address: '0x1234567890abcdef1234567890abcdef12345678',
      name: 'Mock User'
    };
    setUser(mockUser);
    setIsConnected(true);
    console.log('Mock wallet connected:', mockUser);
  };

  const disconnect = () => {
    setUser(null);
    setIsConnected(false);
    console.log('Mock wallet disconnected');
  };

  return (
    <MockWalletContext.Provider 
      value={{ 
        user, 
        isConnected, 
        connect, 
        disconnect, 
        address: user?.address || null 
      }}
    >
      {children}
    </MockWalletContext.Provider>
  );
};

export const useMockWallet = () => {
  const context = useContext(MockWalletContext);
  if (context === undefined) {
    throw new Error('useMockWallet must be used within a MockWalletProvider');
  }
  return context;
};

