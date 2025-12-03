import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { User } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  user?: User | null;
}

const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar fijo en la parte superior */}
      <Navbar user={user || null} />

      <main className="grow container mx-auto px-4 pb-2 pt-19">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;