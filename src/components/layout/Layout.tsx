// filepath: c:\Users\HEMAVATHI\OneDrive\Desktop\expense manager\summit-save-40\src\components\layout\Layout.tsx
import React from "react";
import { GlobalHeader } from "./GlobalHeader";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <main>{children}</main>
    </div>
  );
}

export { Layout };