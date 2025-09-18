import React from "react";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
        {children}
      </main>
    </div>
  );
};

export default Layout;
