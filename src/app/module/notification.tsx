import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle, CheckCircle } from "lucide-react";
import React from "react";

interface NotificationProps {
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
}

export const Notification = ({ type, title, message, onClose }: NotificationProps) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Alert className={`fixed top-4 right-0 w-96 shadow-lg ${
      type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-center gap-2">
        {type === 'success' ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <XCircle className="h-5 w-5 text-red-600" />
        )}
        <AlertTitle>{title}</AlertTitle>
      </div>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};