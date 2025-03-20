import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import { useVybiumToken } from "@/hooks/useVybiumToken";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const VybiumBalanceDisplay: React.FC = () => {
  const { isConnected } = useAccount();
  const { balance, getBalance, isLoading } = useVybiumToken();

  useEffect(() => {
    if (isConnected) {
      getBalance();
    }
  }, [isConnected, getBalance]);

  if (!isConnected) return null;

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20 transition"
    >
      <img
        src="/lovable-uploads/e176984a-2f50-4512-862c-de219621bd47.png"
        alt="VYB"
        className="h-6 w-6 rounded-full"
      />
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <span className="text-sm font-medium">
          {Number(balance).toFixed(2)} VYB
        </span>
      )}
    </Button>
  );
};

export default VybiumBalanceDisplay;
