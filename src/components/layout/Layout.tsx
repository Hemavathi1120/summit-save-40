// filepath: c:\Users\HEMAVATHI\OneDrive\Desktop\expense manager\summit-save-40\src\components\layout\Layout.tsx
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <main>{children}</main>
    </div>
  );
}

export { Layout };