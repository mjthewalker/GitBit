import React from 'react';
import { TreePine, Globe, Award, Leaf } from 'lucide-react';

const MarketSellerCard = ({ seller, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-green-100 overflow-hidden group"
    >
      <div className="h-48 bg-green-50 relative overflow-hidden">
        <img 
          src={seller.coverImage || 'https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'} 
          alt={seller.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {seller.creditType}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{seller.name}</h3>
            <div className="flex items-center text-sm text-gray-600">
              <Globe className="h-4 w-4 mr-1" />
              <span>{seller.location}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Award className="h-5 w-5 text-green-600" />
            <span className="ml-1 text-sm font-medium text-green-600">Verified</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-sm text-gray-500">Available Credits</p>
            <div className="flex items-center">
              <Leaf className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-lg font-semibold text-gray-900">{seller.availableCredits}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Price per Credit</p>
            <p className="text-lg font-bold text-green-600">${seller.pricePerCredit}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketSellerCard;