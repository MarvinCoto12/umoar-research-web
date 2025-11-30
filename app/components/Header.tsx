import React from 'react';
import Link from 'next/link';
import Navbar from './Navbar';
import { User } from '@/types';

interface HeaderProps {
  user?: User | null; 
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="bg-secondary-dark shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-3xl font-extrabold text-accent-purple hover:text-accent-pink transition-colors duration-300">
          {/* Aquí se puede poner un logo */}
        </Link>

        {/* Pasamos el usuario hacia abajo al Navbar */}
        <Navbar user={user || null} />

      </div>
    </header>
  );
};

export default Header;