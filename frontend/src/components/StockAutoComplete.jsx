import React, { useState, useEffect } from 'react';

const StockAutocomplete = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await fetch('/companies.csv');
        const csvText = await response.text();
        
        const parsedCompanies = csvText
          .split('\n')
          .filter(line => line.trim())
          .map(line => {
            const [ticker, name] = line.split(',').map(item => item.trim());
            return { ticker, name };
          });
        
        setCompanies(parsedCompanies);
      } catch (error) {
        console.error('Error loading companies:', error);
        setCompanies([]);
      }
    };

    loadCompanies();
  }, []);

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(inputValue.toLowerCase()) ||
    company.ticker.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (company) => {
    setInputValue(`${company.ticker} - ${company.name}`);
    setIsOpen(false);
    // Pass ticker as assetCode along with other fields
    onChange({ 
      assetName: company.name,
      assetCode: company.ticker,
      ticker: company.ticker // keeping this for backward compatibility if needed
    });
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-green-700 mb-2">
        Asset Name
      </label>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className="w-full p-3 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/90"
        placeholder="Search for a stock..."
      />
      
      {isOpen && filteredCompanies.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredCompanies.map((company) => (
            <button
              key={company.ticker}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              onClick={() => handleSelect(company)}
            >
              <span className="font-medium">{company.ticker}</span> - {company.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockAutocomplete;