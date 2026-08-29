"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

export interface MaintenanceConfig {
  manualOverride: boolean; // Manual turn off toggle
  scheduleType: "one_time" | "recurring";
  // One-time schedule
  autoOffDateTime: string; // ISO string or YYYY-MM-DDTHH:mm
  autoOnDateTime: string; // ISO string or YYYY-MM-DDTHH:mm
  // Recurring schedule
  recurringDays: number[]; // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  recurringStartTime: string; // e.g. "15:00"
  recurringEndTime: string; // e.g. "17:00"
  customMessage: string;
  adminPin: string;
}

const DEFAULT_CONFIG: MaintenanceConfig = {
  manualOverride: false,
  scheduleType: "one_time",
  autoOffDateTime: "",
  autoOnDateTime: "",
  recurringDays: [6, 0], // Default Sat (6) & Sun (0)
  recurringStartTime: "15:00",
  recurringEndTime: "17:00",
  customMessage: "Hệ thống đang bảo trì định kỳ để nâng cấp dữ liệu. Rất mong quý học viên cảm thông!",
  adminPin: "1234",
};

interface MaintenanceContextType {
  config: MaintenanceConfig;
  isMaintenanceActive: boolean;
  activeReason: "manual" | "scheduled" | "none";
  isAdminLoggedIn: boolean;
  verifyPin: (pin: string) => boolean;
  changePin: (newPin: string) => void;
  updateConfig: (newConfig: Partial<MaintenanceConfig>) => void;
  logoutAdmin: () => void;
}

const CONFIG_STORAGE_KEY = "kana_dojo_maintenance_config";
const ADMIN_AUTH_KEY = "kana_dojo_admin_auth";

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<MaintenanceConfig>(DEFAULT_CONFIG);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [now, setNow] = useState<Date>(new Date());

  // Load persisted config and session state
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (savedConfig) {
        setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(savedConfig) });
      }
    } catch (e) {
      console.error("Failed to load maintenance config", e);
    }

    try {
      const authSession = sessionStorage.getItem(ADMIN_AUTH_KEY);
      if (authSession === "true") {
        setIsAdminLoggedIn(true);
      }
    } catch (e) {
      console.error("Failed to load admin auth session", e);
    }
  }, []);

  // Timer to continuously update current time for schedule checking
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 5000); // Check every 5 seconds
    return () => clearInterval(timer);
  }, []);

  // Compute maintenance status
  const { isMaintenanceActive, activeReason } = useMemo(() => {
    // 1. Manual override takes top priority
    if (config.manualOverride) {
      return { isMaintenanceActive: true, activeReason: "manual" as const };
    }

    // 2. Check Recurring Schedule
    if (config.scheduleType === "recurring") {
      if (config.recurringDays && config.recurringDays.length > 0 && config.recurringStartTime && config.recurringEndTime) {
        const currentDay = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
        if (config.recurringDays.includes(currentDay)) {
          const currentMinutes = now.getHours() * 60 + now.getMinutes();

          const [startH, startM] = config.recurringStartTime.split(":").map(Number);
          const [endH, endM] = config.recurringEndTime.split(":").map(Number);

          const startMinutes = (startH || 0) * 60 + (startM || 0);
          const endMinutes = (endH || 0) * 60 + (endM || 0);

          if (startMinutes < endMinutes) {
            if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
              return { isMaintenanceActive: true, activeReason: "scheduled" as const };
            }
          } else if (startMinutes > endMinutes) {
            // Overnight window (e.g. 23:00 to 02:00)
            if (currentMinutes >= startMinutes || currentMinutes < endMinutes) {
              return { isMaintenanceActive: true, activeReason: "scheduled" as const };
            }
          }
        }
      }
      return { isMaintenanceActive: false, activeReason: "none" as const };
    }

    // 3. Check One-time Date/Time Schedule
    if (config.autoOffDateTime && config.autoOnDateTime) {
      const offTime = new Date(config.autoOffDateTime).getTime();
      const onTime = new Date(config.autoOnDateTime).getTime();
      const currentTime = now.getTime();

      if (!isNaN(offTime) && !isNaN(onTime) && currentTime >= offTime && currentTime < onTime) {
        return { isMaintenanceActive: true, activeReason: "scheduled" as const };
      }
    } else if (config.autoOffDateTime && !config.autoOnDateTime) {
      const offTime = new Date(config.autoOffDateTime).getTime();
      const currentTime = now.getTime();
      if (!isNaN(offTime) && currentTime >= offTime) {
        return { isMaintenanceActive: true, activeReason: "scheduled" as const };
      }
    }

    return { isMaintenanceActive: false, activeReason: "none" as const };
  }, [config, now]);

  const saveConfig = (newConfig: MaintenanceConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
    } catch (e) {
      console.error("Failed to save maintenance config", e);
    }
  };

  const updateConfig = (partial: Partial<MaintenanceConfig>) => {
    const updated = { ...config, ...partial };
    saveConfig(updated);
  };

  const verifyPin = (inputPin: string): boolean => {
    if (inputPin.trim() === config.adminPin) {
      setIsAdminLoggedIn(true);
      try {
        sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
      } catch (e) {
        console.error(e);
      }
      return true;
    }
    return false;
  };

  const changePin = (newPin: string) => {
    if (newPin.trim()) {
      updateConfig({ adminPin: newPin.trim() });
    }
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    try {
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <MaintenanceContext.Provider
      value={{
        config,
        isMaintenanceActive,
        activeReason,
        isAdminLoggedIn,
        verifyPin,
        changePin,
        updateConfig,
        logoutAdmin,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const ctx = useContext(MaintenanceContext);
  if (!ctx) {
    throw new Error("useMaintenance must be used within MaintenanceProvider");
  }
  return ctx;
}
