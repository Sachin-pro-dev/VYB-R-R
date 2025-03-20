
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, Search } from 'lucide-react';
import ConnectWalletButton from './ConnectWalletButton';
import { Button } from '@/components/ui/button';
import VybiumBalanceDisplay from './vybium/VybiumBalanceDisplay';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Create', path: '/create' },
    { name: 'VYBium', path: '/vybium' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold tracking-widest">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] via-[#D946EF] to-[#F97316] font-orbitron animate-pulse">
                  VYB<span className="opacity-50">-</span>R8R
                </span>
              </h1>
            </Link>
          </div>

          <div className="hidden md:flex space-x-8 ml-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all duration-300 hover:text-glow ${
                  location.pathname === link.path
                    ? 'text-white border-b-2 border-white'
                    : 'text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <VybiumBalanceDisplay />
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
              <Bell className="h-5 w-5" />
            </Button>
            <ConnectWalletButton />
          </div>

          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden glass pt-2 pb-4 px-4 absolute w-full animate-fade-in">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-base font-medium hover-scale ${
                  location.pathname === link.path
                    ? 'bg-white/10 text-white'
                    : 'text-gray-200'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center justify-between py-2">
              <ConnectWalletButton />
              <div className="flex space-x-3">
                <VybiumBalanceDisplay />
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
