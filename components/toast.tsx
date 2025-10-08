"use client";

import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import SuccessIcon from "@/assets/icons/success-icon.svg";
import ErrorIcon from "@/assets/icons/error-icon.svg";
import WarningIcon from "@/assets/icons/warning-icon.svg";
import InfoIcon from "@/assets/icons/info-icon.svg";

export type ToastVariant = "success" | "error" | "warning" | "info";
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

interface ToastProps {
  title: string;
  description: string;
  variant?: ToastVariant;
  position?: ToastPosition;
  duration?: number;
  onClose?: () => void;
  createdAt?: number;
}

type ToastOptions = Omit<ToastProps, "title" | "description" | "onClose">;

const defaultOptions: ToastOptions = {
  variant: "success",
  position: "top-right",
  duration: 3000,
};

function Toast({
  title,
  description,
  variant = "success",
  position = "top-right",
  duration = 3000,
  onClose,
  createdAt,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    setIsMounted(true);
    const toastCreatedAt = createdAt ?? Date.now();
    const now = Date.now();
    const elapsed = now - toastCreatedAt;
    const remaining = Math.max(0, duration - elapsed);
    if (remaining === 0) {
      handleClose();
      return;
    }
    const timer = setTimeout(() => {
      handleClose();
    }, remaining);
    // Progress bar animation
    let frame: number;
    function animate() {
      const current = Date.now();
      const percent = Math.max(
        0,
        100 - ((current - toastCreatedAt) / duration) * 100
      );
      setProgress(percent);
      if (percent > 0 && !isExiting) {
        frame = requestAnimationFrame(animate);
      }
    }
    frame = requestAnimationFrame(animate);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [createdAt, duration, handleClose, isExiting]);

  if (!isVisible) return null;

  return (
    <div
      onClick={handleClose}
      aria-label="Close toast"
      className={clsx(
        "transition-all duration-300 ease-in-out cursor-pointer",
        {
          "translate-x-0 opacity-100": isMounted && !isExiting,
          "translate-x-full opacity-0":
            (!isMounted || isExiting) &&
            (position === "top-right" || position === "bottom-right"),
          "-translate-x-full opacity-0":
            (!isMounted || isExiting) &&
            (position === "top-left" || position === "bottom-left"),
        }
      )}
    >
      <div
        className={clsx(
          "shadow-xl rounded-xl overflow-hidden p-4 w-96 relative border-2 backdrop-blur-md bg-opacity-80 flex flex-col gap-2 transition-all duration-300",
          {
            "bg-green-100 border-green-500": variant === "success",
            "bg-red-100 border-red-500": variant === "error",
            "bg-yellow-100 border-yellow-500": variant === "warning",
            "bg-blue-100 border-blue-500": variant === "info",
          }
        )}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close toast"
          className="absolute top-2 right-2 text-black/60 hover:text-black/90 rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-black/20"
          tabIndex={0}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 6L14 14M6 14L14 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="flex items-start gap-3">
          <div
            className={clsx(
              "flex items-center justify-center w-10 h-10 rounded-lg mt-0.5",
              {
                "bg-green-200": variant === "success",
                "bg-red-200": variant === "error",
                "bg-yellow-200": variant === "warning",
                "bg-blue-200": variant === "info",
              }
            )}
          >
            {variant === "success" && (
              <SuccessIcon className="w-5 h-5 text-green-600" />
            )}
            {variant === "error" && (
              <ErrorIcon className="w-5 h-5 text-red-600" />
            )}
            {variant === "warning" && (
              <WarningIcon className="w-5 h-5 text-yellow-600" />
            )}
            {variant === "info" && (
              <InfoIcon className="w-5 h-5 text-blue-600" />
            )}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <h3 className="text-base font-semibold text-black leading-tight truncate">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-black/80 leading-snug mt-0.5 break-words">
                {description}
              </p>
            )}
          </div>
        </div>
        {/* Progress Bar */}
        <div className="absolute left-0 bottom-0 w-full h-1 bg-black/10 rounded-b-2xl overflow-hidden">
          <div
            className={clsx("h-full transition-all duration-300", {
              "bg-green-500": variant === "success",
              "bg-red-500": variant === "error",
              "bg-yellow-500": variant === "warning",
              "bg-blue-500": variant === "info",
            })}
            style={{
              width: isExiting ? 0 : `${progress}%`,
              transition: isExiting ? "width 300ms linear" : "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Toast Manager
class ToastManager {
  private static instance: ToastManager;
  private toasts: Map<string, ToastProps> = new Map();
  private listeners: Set<(toasts: Map<string, ToastProps>) => void> = new Set();

  private constructor() {}

  static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  subscribe(listener: (toasts: Map<string, ToastProps>) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.toasts));
  }

  private createToast(config: ToastProps): string {
    const id = Math.random().toString(36).substring(7);
    this.toasts = new Map(this.toasts);
    this.toasts.set(id, { ...config, createdAt: Date.now() });
    this.notify();
    return id;
  }

  remove(id: string) {
    this.toasts = new Map(this.toasts);
    this.toasts.delete(id);
    this.notify();
  }

  success(title: string, description?: string, options?: ToastOptions) {
    return this.createToast({
      ...defaultOptions,
      ...options,
      title,
      description: description || "",
      variant: "success",
    });
  }

  error(title: string, description?: string, options?: ToastOptions) {
    return this.createToast({
      ...defaultOptions,
      ...options,
      title,
      description: description || "",
      variant: "error",
    });
  }

  warning(title: string, description?: string, options?: ToastOptions) {
    return this.createToast({
      ...defaultOptions,
      ...options,
      title,
      description: description || "",
      variant: "warning",
    });
  }

  info(title: string, description?: string, options?: ToastOptions) {
    return this.createToast({
      ...defaultOptions,
      ...options,
      title,
      description: description || "",
      variant: "info",
    });
  }
}

export const toast = ToastManager.getInstance();

// Toast Container Component
export function ToastContainer() {
  const [toasts, setToasts] = useState<Map<string, ToastProps>>(new Map());
  useEffect(() => {
    return toast.subscribe((newToasts) => {
      setToasts(newToasts);
    });
  }, []);

  const groupedToasts = Array.from(toasts.entries()).reduce(
    (acc, [id, config]) => {
      const position = config.position || "top-right";
      if (!acc[position]) {
        acc[position] = [];
      }
      acc[position].push({ id, ...config });
      return acc;
    },
    {} as Record<ToastPosition, Array<{ id: string } & ToastProps>>
  );
  console.log(groupedToasts);

  return (
    <>
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <div
          key={position}
          className={clsx("fixed p-4 flex flex-col gap-2", {
            "top-0 right-0": position === "top-right",
            "top-0 left-0": position === "top-left",
            "bottom-0 right-0": position === "bottom-right",
            "bottom-0 left-0": position === "bottom-left",
            "top-0 left-1/2 -translate-x-1/2": position === "top-center",
            "bottom-0 left-1/2 -translate-x-1/2": position === "bottom-center",
          })}
        >
          {positionToasts.map((toastConfig) => (
            <Toast
              key={toastConfig.id}
              {...toastConfig}
              onClose={() => toast.remove(toastConfig.id)}
            />
          ))}
        </div>
      ))}
    </>
  );
}

export default Toast;
