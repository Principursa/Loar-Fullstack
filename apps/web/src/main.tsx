import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import Loader from "./components/loader";
import { routeTree } from "./routeTree.gen";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient, trpc } from "./utils/trpc";

import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "./lib/wagmi";

// Handle ethereum property conflicts and other wallet-related errors
if (typeof window !== 'undefined') {
  // Suppress ethereum property redefinition errors
  const originalError = console.error;
  console.error = (...args) => {
    const errorMessage = args[0]?.toString?.() || '';
    if (errorMessage.includes('Cannot redefine property: ethereum') ||
        errorMessage.includes('Cannot delete property') ||
        errorMessage.includes('evmAsk.js') ||
        errorMessage.includes('WebAuthnP256.js')) {
      return; // Suppress these specific errors
    }
    originalError.apply(console, args);
  };

  // Global error handler for uncaught errors
  window.addEventListener('error', (event) => {
    if (event.message?.includes('Cannot redefine property: ethereum') ||
        event.message?.includes('evmAsk.js')) {
      event.preventDefault();
      return false;
    }
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('Cannot redefine property: ethereum') ||
        event.reason?.message?.includes('evmAsk.js')) {
      event.preventDefault();
      return false;
    }
  });

  // Function to make passkey elements dynamic based on user preferences
  const makePasskeyDynamic = () => {
    // Check user preference for passkey (stored in localStorage)
    const passkeyPreference = localStorage.getItem('porto-passkey-enabled');
    const shouldShowPasskey = passkeyPreference === null ? true : passkeyPreference === 'true';
    
    // Check device capabilities
    const hasWebAuthn = window.PublicKeyCredential && 
                       typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function';
    
    // Check if user is on mobile (more likely to have biometrics)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Determine if passkey should be shown
    const showPasskey = shouldShowPasskey && (hasWebAuthn || isMobile);
    
    const selectors = [
      '[class*="passkey"]',
      '[class*="webauthn"]',
      '[class*="biometric"]',
      '[class*="fingerprint"]',
      '[class*="face-id"]',
      '[class*="touch-id"]',
      'button[class*="passkey"]',
      'button[class*="webauthn"]',
      'button[class*="biometric"]',
      '[data-testid*="passkey"]',
      '[data-testid*="webauthn"]',
      '[aria-label*="passkey"]',
      '[aria-label*="biometric"]',
      '[title*="passkey"]',
      '[title*="biometric"]'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element instanceof HTMLElement) {
          if (showPasskey) {
            // Show passkey elements
            element.style.display = '';
            element.style.visibility = '';
            element.style.opacity = '';
            element.style.height = '';
            element.style.width = '';
            element.style.margin = '';
            element.style.padding = '';
            element.style.overflow = '';
          } else {
            // Hide passkey elements
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.style.opacity = '0';
            element.style.height = '0';
            element.style.width = '0';
            element.style.margin = '0';
            element.style.padding = '0';
            element.style.overflow = 'hidden';
          }
        }
      });
    });
  };

  // Monitor for Porto modal appearance and make passkey dynamic
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            // Check if this is a Porto modal or contains one
            if (node.querySelector('[class*="porto"]') || 
                node.classList.toString().includes('porto') ||
                node.querySelector('iframe[src*="porto"]')) {
              // Wait a bit for the modal to fully load
              setTimeout(makePasskeyDynamic, 100);
              setTimeout(makePasskeyDynamic, 500);
              setTimeout(makePasskeyDynamic, 1000);
            }
          }
        });
      }
    });
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Also run on page load
  document.addEventListener('DOMContentLoaded', makePasskeyDynamic);
  
  // Expose function globally for external access
  (window as any).makePasskeyDynamic = makePasskeyDynamic;
}

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPendingComponent: () => <Loader />,
  context: { trpc, queryClient },
  Wrap: function WrapComponent({ children }: { children: React.ReactNode }) {
    return (
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    );
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Root element not found");
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
