import React from 'react';
import { Leaf, TreePine, Globe } from 'lucide-react';

const MarketNav = () => {
  return (
    <nav className="bg-green-50 border-b border-green-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <TreePine className="h-6 w-6 text-green-700" />
            <span className="text-xl font-semibold text-green-800">Carbon Credit Exchange</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center text-green-700">
              <Globe className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Global Impact</span>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MarketNav;