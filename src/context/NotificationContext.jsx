import { createContext, useContext, useState, useCallback } from "react";
import NotificationToast from "../components/common/NotificationToast";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    // 1. Mark notification as exiting to trigger slide-out animation
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isExiting: true } : n)),
    );

    // 2. Remove from state after animation finishes
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 350); // Matches the 0.35s duration of animate-toast-slide-out
  }, []);

  const showNotification = useCallback(
    ({
      type = "info",
      title = "Thông báo",
      description = "",
      duration = 4000,
    }) => {
      const id = Date.now() + Math.random();

      setNotifications((prev) => [
        ...prev,
        { id, type, title, description, isExiting: false },
      ]);

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }

      return id;
    },
    [removeNotification],
  );

  // Convenience helper methods
  const notificationHelpers = {
    show: showNotification,
    success: (title, description, duration) =>
      showNotification({ type: "success", title, description, duration }),
    error: (title, description, duration) =>
      showNotification({ type: "error", title, description, duration }),
    warning: (title, description, duration) =>
      showNotification({ type: "warning", title, description, duration }),
    info: (title, description, duration) =>
      showNotification({ type: "info", title, description, duration }),
    remove: removeNotification,
  };

  return (
    <NotificationContext.Provider value={notificationHelpers}>
      {children}
      {/* Notifications container */}
      <div className="fixed top-6 right-6 z-[300] flex flex-col gap-3.5 w-full max-w-sm pointer-events-none">
        {notifications.map((n) => (
          <NotificationToast
            key={n.id}
            isOpen={true}
            isExiting={n.isExiting}
            type={n.type}
            title={n.title}
            description={n.description}
            onClose={() => removeNotification(n.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};
