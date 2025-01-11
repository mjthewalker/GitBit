import React, { useEffect, useState } from 'react';
import { X, TreePine, Globe, Award, Leaf, ArrowRight, CheckCircle, Cookie } from 'lucide-react';
import { use } from 'react';
import Cookies from 'js-cookie'; 

const MarketSellerDetails = ({ seller, onClose, onPurchase }) => {
  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userId, setUserId] = useState('');

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

  const handlePurchase = async () => {
    try {
      // Step 1: Place the order
      const orderResponse = await fetch('http://localhost:8000/market/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: seller._id,
          quantity,
          totalPrice: quantity * seller.pricePerCredit,
          buyerId: userId
        })
      });
  
      const orderData = await orderResponse.json();
  
      // Check if the order was placed successfully
      if (orderResponse.ok) {
        console.log('Order placed successfully:', orderData);
        
        // Step 2: Show confirmation that the order was placed
        setShowConfirmation(true);  // Show confirmation for order placement
  
        // You can also display a message or update the UI to show the order was placed
        alert('Order placed successfully! Payment is pending.');
      } else {
        console.error('Order placement failed:', orderData.message);
      }
  
      // Step 3: Skip the payment part for now
      // (You can re-enable payment logic once ready)
  
      // Optional: if you decide to do the payment later, you can send a request like this:
      // const paymentResponse = await fetch('http://localhost:8000/market/payment', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ orderId: orderData.orderId })
      // });
  
      // if (paymentResponse.ok) {
      //   console.log('Payment processed');
      // }
      
    } catch (error) {
      console.error('Error processing purchase:', error);
    }
  };  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button 
          onClick={() => onClose?.()}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10 bg-white shadow-md"
          aria-label="Close details"
        >
          <X className="h-6 w-6 text-gray-600" />
        </button>
        
        <div className="h-64 relative">
          <img 
            src={seller.coverImage || 'https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'} 
            alt={seller.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <h2 className="text-2xl font-bold text-white">{seller.name}</h2>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-green-600">
                <Globe className="h-5 w-5 mr-1" />
                <span className="font-medium">{seller.location}</span>
              </div>
              <div className="flex items-center text-green-600">
                <Award className="h-5 w-5 mr-1" />
                <span className="font-medium">Verified Seller</span>
              </div>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
              {seller.creditType}
            </div>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-gray-600">{seller.description}</p>
          </div>
          
          {!showConfirmation ? (
            <div className="bg-green-50 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Price per Credit</p>
                  <p className="text-2xl font-bold text-green-600">${seller.pricePerCredit}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">{seller.availableCredits}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max={seller.availableCredits}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-green-200">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(quantity * seller.pricePerCredit).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={handlePurchase}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Purchase Credits
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 rounded-xl p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Purchase Successful!</h3>
              <p className="text-gray-600">
                Thank you for contributing to a sustainable future.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketSellerDetails;