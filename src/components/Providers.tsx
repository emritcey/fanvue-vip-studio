"use client";

import { ToastProvider, ToastViewport, TooltipProvider } from "@fanvue/ui";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <ToastProvider>
        {children}
        <ToastViewport />
      </ToastProvider>
    </TooltipProvider>
  );
}
