import { Info } from "lucide-react";
import { Form } from "../form/index.js";
import { Alert, AlertDescription, AlertTitle } from "../shadcn/alert.js";
import { Button } from "../shadcn/button.js";

export function MsgSenderInput() {
  return (
    <div className="mt-4">
      <Form.Text
        name="msgSender"
        label={
          <span className="font-bold text-base">Msg Sender (Optional)</span>
        }
        placeholder="0x..."
        className="w-4xl"
      />
    </div>
  );
}

export function ConnectWalletAlert() {
  return (
    <Alert className="mb-4">
      <Info className="h-4 w-4" />
      <AlertTitle>Connect your wallet</AlertTitle>
      <AlertDescription>
        Connect your wallet to execute this write function
      </AlertDescription>
    </Alert>
  );
}

interface ActionButtonsProps {
  isWrite: boolean;
  callData: string | undefined;
  isSimulating: boolean;
  isExecuting: boolean;
  isConnected: boolean;
  hasSimulate: boolean;
  simulate?: () => void;
  execute: () => void;
}

export function ActionButtons({
  isWrite,
  callData,
  isSimulating,
  isExecuting,
  isConnected,
  hasSimulate,
  simulate,
  execute,
}: ActionButtonsProps) {
  return (
    <div className="mt-6 flex justify-center gap-2">
      {isWrite ? (
        <>
          {hasSimulate && (
            <Button
              type="button"
              disabled={!callData || isSimulating || isExecuting}
              onClick={() => simulate?.()}
            >
              Simulate
            </Button>
          )}
          <Button
            type="button"
            disabled={!isConnected || !callData || isExecuting || isSimulating}
            onClick={() => execute()}
          >
            Execute
          </Button>
        </>
      ) : (
        <Button
          type="button"
          disabled={!callData || isExecuting}
          onClick={() => execute()}
        >
          Call
        </Button>
      )}
    </div>
  );
}
