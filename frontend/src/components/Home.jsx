// components/Home.jsx
import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-700 to-emerald-600 relative text-white flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-semibold mb-4">Welcome to EcoLife</h1>
        <p className="text-lg">Empowering you to make sustainable choices for a better planet.</p>
        <div className="mt-8">
          <button className="px-6 py-3 bg-emerald-700 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-all duration-300">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
