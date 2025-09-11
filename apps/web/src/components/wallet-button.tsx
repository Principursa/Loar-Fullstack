import { useConnect, useDisconnect, useAccount } from "wagmi";
import { Button } from "./ui/button";
import { Wallet, Zap, Settings } from "lucide-react";
import { useState, useEffect } from "react";

export function WalletButton() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const [showSettings, setShowSettings] = useState(false);
  const [passkeyEnabled, setPasskeyEnabled] = useState(true);

  useEffect(() => {
    // Load passkey preference from localStorage
    const savedPreference = localStorage.getItem('porto-passkey-enabled');
    if (savedPreference !== null) {
      setPasskeyEnabled(savedPreference === 'true');
    }
  }, []);

  const handleConnect = () => {
    const portoConnector = connectors.find(connector => connector.name === 'Porto');
    if (portoConnector) {
      connect({ connector: portoConnector });
    }
  };

  const togglePasskeyPreference = () => {
    const newValue = !passkeyEnabled;
    setPasskeyEnabled(newValue);
    localStorage.setItem('porto-passkey-enabled', newValue.toString());
    
    // Trigger the dynamic passkey function
    if (typeof window !== 'undefined' && (window as any).makePasskeyDynamic) {
      (window as any).makePasskeyDynamic();
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/20 px-3 py-1 rounded-full">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span className="text-xs font-mono text-green-700 dark:text-green-300">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button 
        onClick={handleConnect} 
        size="sm"
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg"
      >
        <Zap className="mr-2 h-4 w-4" />
        Connect Porto
      </Button>
      
      {/* Settings dropdown */}
      <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Porto Settings</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="h-6 w-6 p-0"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={passkeyEnabled}
              onChange={togglePasskeyPreference}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Enable Passkey Authentication</span>
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {passkeyEnabled 
              ? "Passkey options will be shown in the modal" 
              : "Only email authentication will be available"
            }
          </p>
        </div>
      </div>
    </div>
  );
}
