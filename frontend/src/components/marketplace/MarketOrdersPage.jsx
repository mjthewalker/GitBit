import React, { useState, useEffect } from 'react';
import MarketNav from './MarketNav';
import { TreePine, Leaf, Cloud, Droplets, Wind } from 'lucide-react';

const ImpactCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-xl p-6 shadow-md border border-green-100">
    <Icon className="h-8 w-8 text-green-600 mb-2" />
    <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-2xl font-bold text-green-600">{value}</p>
  </div>
);

const MarketOrdersPage = ({expanded}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalImpact, setTotalImpact] = useState({
    treesPlanted: 0,
    co2Reduced: 0,
    waterSaved: 0,
    energySaved: 0
  });
  const [userId, setUserId] = useState(null);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8000/user/userData', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUserId(data.user._id);
        } else {
          console.log("Error fetching user data:", await response.json());
        }
      } catch (error) {
        console.log("Network error:", error);
      }
    };

    fetchUserData();
  }, []);

  // Fetch orders after userId is set
  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  // Function to fetch orders
  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:8000/market/orders/${userId}`);
      const data = await response.json();
      setOrders(data);

      // Calculate total impact
      const impact = data.reduce((acc, order) => ({
        treesPlanted: acc.treesPlanted + (order.impact?.treesPlanted || 0),
        co2Reduced: acc.co2Reduced + (order.impact?.co2Reduced || 0),
        waterSaved: acc.waterSaved + (order.impact?.waterSaved || 0),
        energySaved: acc.energySaved + (order.impact?.energySaved || 0)
      }), {
        treesPlanted: 0,
        co2Reduced: 0,
        waterSaved: 0,
        energySaved: 0
      });

      setTotalImpact(impact);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div       className={`justify-center py-6 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-green-50 to-white ${expanded ? "ml-64" : "ml-20"} transition-all`}>
      <MarketNav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <TreePine className="h-8 w-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Your Environmental Impact</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ImpactCard
            title="Trees Equivalent"
            value={`${totalImpact.treesPlanted} trees`}
            icon={TreePine}
          />
          <ImpactCard
            title="CO₂ Reduced"
            value={`${totalImpact.co2Reduced} tons`}
            icon={Cloud}
          />
          <ImpactCard
            title="Water Saved"
            value={`${totalImpact.waterSaved}L`}
            icon={Droplets}
          />
          <ImpactCard
            title="Energy Saved"
            value={`${totalImpact.energySaved}kWh`}
            icon={Wind}
          />
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-green-100">
          <div className="px-6 py-4 border-b border-green-100">
            <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your orders...</p>
            </div>
          ) : (
            <div className="divide-y divide-green-100">
              {orders.map((order) => (
                <div key={order.orderId} className="p-6 hover:bg-green-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{order.projectName}</h3>
                      <p className="text-sm text-gray-600">Order ID: {order.orderId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Credits Purchased</p>
                      <div className="flex items-center">
                        <Leaf className="h-4 w-4 text-green-600 mr-1" />
                        <span className="font-semibold">{order.quantity}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-semibold">${order.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-semibold">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Project Location</p>
                      <p className="font-semibold">{order.location}</p>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-800 mb-2">Environmental Impact</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Trees Planted</p>
                        <p className="font-semibold text-green-700">{order.impact?.treesPlanted} trees</p>
                      </div>
                      <div>
                        <p className="text-gray-600">CO₂ Reduced</p>
                        <p className="font-semibold text-green-700">{order.impact?.co2Reduced} tons</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Water Saved</p>
                        <p className="font-semibold text-green-700">{order.impact?.waterSaved}L</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Energy Saved</p>
                        <p className="font-semibold text-green-700">{order.impact?.energySaved}kWh</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MarketOrdersPage;