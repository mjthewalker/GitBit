import React, { useState, useEffect } from 'react';
import MarketNav from './MarketNav';
import MarketSellerCard from './MarketSellerCard';
import MarketSellerDetails from './MarketSellerDetails';
import { TreePine, Search, AlertCircle } from 'lucide-react';

const MarketplacePage = ({expanded}) => {
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8000/market/sellers');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setSellers(data);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
      setError(error.message);
      setSellers([]); // Reset sellers on error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSellers = sellers.filter(seller => 
    seller.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.creditType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div      className={`justify-center py-6 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-green-50 to-white ${expanded ? "ml-64" : "ml-20"
    }`}>
      <MarketNav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center space-x-3">
            <TreePine className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Carbon Credit Marketplace</h1>
          </div>
          
          <div className="relative w-full sm:w-auto">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, location, or credit type..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-80 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading marketplace data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <p className="mt-4 text-gray-800 font-medium">Error loading marketplace data</p>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={fetchSellers}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredSellers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {sellers.length === 0 
                ? "No sellers available in the marketplace."
                : "No sellers match your search criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSellers.map((seller) => (
              <MarketSellerCard
                key={seller.id}
                seller={seller}
                onClick={() => setSelectedSeller(seller)}
              />
            ))}
          </div>
        )}

        {selectedSeller && (
          <MarketSellerDetails
            seller={selectedSeller}
            onClose={() => setSelectedSeller(null)}
          />
        )}
      </main>
    </div>
  );
};

export default MarketplacePage;