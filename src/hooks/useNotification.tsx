import { useState } from "react";

interface Notification {
  type: "success" | "error";
  message: string;
}

export const useNotification = () => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Auto-dismiss after 3 seconds
  };

  const NotificationComponent = () => {
    if (!notification) return null;

    return (
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-100">
        <div
          className={`px-6 py-4 rounded-full shadow-lg backdrop-blur-md border flex items-center gap-3 animate-in fade-in slide-in-from-top ${
            notification.type === "success"
              ? "bg-emerald-100/90 border-emerald-300 text-emerald-800"
              : "bg-red-100/90 border-red-300 text-red-800"
          }`}
        >
          <span className="text-xl">
            {notification.type === "success" ? "✓" : "✕"}
          </span>
          <span className="font-medium text-sm sm:text-base">
            {notification.message}
          </span>
        </div>
      </div>
    );
  };

  return {
    notification,
    showNotification,
    NotificationComponent,
  };
};
