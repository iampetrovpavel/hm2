import React from 'react';
import { Link } from 'react-router-dom';
import { Hammer } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gray-900 shadow-lg p-4">
      <div className="max-w-3xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-white">Heavy Materials</h1>
          {/* <Hammer className="h-6 w-6 text-red-400" /> */}
        </div>
        <Link 
          to="/login" 
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          Login
        </Link>
      </div>
    </header>
  );
}