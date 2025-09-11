import { porto } from 'porto/wagmi'
import { http, createConfig, createStorage } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'

// Suppress ethereum property redefinition errors
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0]?.includes?.('Cannot redefine property: ethereum') || 
        args[0]?.includes?.('Cannot delete property')) {
      return; // Suppress these specific errors
    }
    originalError.apply(console, args);
  };
}

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    porto({
      appName: import.meta.env.VITE_PORTO_APP_NAME || 'LOAR Fullstack',
      appUrl: import.meta.env.VITE_PORTO_APP_URL || 'http://localhost:3001',
      // Modal configuration
      modal: {
        size: 'compact',
        theme: 'dark',
      },
    })
  ], 
  storage: createStorage({ storage: localStorage }),
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  // Prevent conflicts with other wallet providers
  ssr: false,
})
