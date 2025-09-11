import { useAccount, useConnect, useConnectors } from "wagmi";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Copy, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const navigate = Route.useNavigate();

  const handleConnect = () => {
    const portoConnector = connectors.find(connector => connector.name === 'Porto');
    if (portoConnector) {
      connect({ connector: portoConnector });
    }
  };

  useEffect(() => {
    if (!isConnected) {
      navigate({
        to: "/",
      });
    }
  }, [isConnected, navigate]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  const openExplorer = () => {
    if (address) {
      window.open(`https://basescan.org/address/${address}`, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Connecting wallet...</p>
        </div>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleConnect} className="w-full">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Porto
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">LOAR Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Information
            </CardTitle>
            <CardDescription>
              Your connected wallet details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Address</label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {address}
                            </code>
                <Button variant="ghost" size="sm" onClick={copyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={openExplorer}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Network</label>
                          <p className="text-sm mt-1">Base</p>
                        </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Name</label>
                          <p className="text-sm mt-1">Porto User</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Address</label>
                          <p className="text-sm mt-1 font-mono">{address}</p>
                        </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Narrative Flow Editor</CardTitle>
          <CardDescription>
            Create and manage your narrative universe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Access the narrative flow editor to create and connect characters, plot points, and media elements.</p>
          <Button>
            Open Narrative Editor
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
