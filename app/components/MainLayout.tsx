import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { User } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  user?: User | null; 
}

const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Pasamos el usuario al Header */}
      <Header user={user} />
      
      <main className="grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;