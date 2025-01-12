// import React, { useState, useEffect } from 'react';
// import MarketNav from './MarketNav';
// import MarketSellerCard from './MarketSellerCard';
// import MarketSellerDetails from './MarketSellerDetails';
// import { TreePine, Search, AlertCircle } from 'lucide-react';
import carbon from "../../../public/carbon.json";
// import { ethers } from 'ethers';
// const CONTRACT_ADDRESS = "0x92b91918D53C8f12A39907b976c6BFf34466F5c8";

// const MarketplacePage = ({expanded}) => {
//   const [sellers, setSellers] = useState([]);
//   const [selectedSeller, setSelectedSeller] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     fetchSellers();
//   }, []);

//   const fetchSellers = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await fetch('http://localhost:8000/market/sellers');
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       if (Array.isArray(data)) {
//         setSellers(data);
//       } else {
//         throw new Error('Invalid data format received');
//       }
//     } catch (error) {
//       console.error('Error fetching sellers:', error);
//       setError(error.message);
//       setSellers([]); // Reset sellers on error
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const filteredSellers = sellers.filter(seller =>
//     seller.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     seller.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     seller.creditType?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//     const dosomething = async () => {
//     try {
//       let signer = null;

//       let provider;
//       if (window.ethereum == null) {
//         // If MetaMask is not installed, we use the default provider,
//         // which is backed by a variety of third-party services (such
//         // as INFURA). They do not have private keys installed,
//         // so they only have read-only access
//         console.log("MetaMask not installed; using read-only defaults");
//         provider = ethers.getDefaultProvider();
//       } else {
//         // Connect to the MetaMask EIP-1193 object. This is a standard
//         // protocol that allows Ethers access to make all read-only
//         // requests through MetaMask.
//         provider = new ethers.BrowserProvider(window.ethereum);

//         // It also provides an opportunity to request access to write
//         // operations, which will be performed by the private key
//         // that MetaMask manages for the user.
//         signer = await provider.getSigner();

//       }
//       const contract = new ethers.Contract(
//         CONTRACT_ADDRESS,
//         carbon.abi,
//         signer || provider
//       );

//       const x = await contract.transferOwnership("0x92b91918D53C8f12A39907b976c6BFf34466F5c8");

//       console.log(x);
//     } catch (error) {
//       console.error("Error adding transaction:", error);
//     }
//   };

//   return (
//     <div      className={`justify-center py-6 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-green-50 to-white ${expanded ? "ml-64" : "ml-20"
//     }`}>
//       <MarketNav />

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
//           <div className="flex items-center space-x-3">
//             <TreePine className="h-8 w-8 text-green-600" />
//             <h1 className="text-2xl font-bold text-gray-900">Carbon Credit Marketplace</h1>
//           </div>

//           <div className="relative w-full sm:w-auto">
//             <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//             <input
//               type="text"
//               placeholder="Search by name, location, or credit type..."
//               value={searchTerm}
//               onChange={handleSearch}
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-80 focus:ring-2 focus:ring-green-500 focus:border-green-500"
//             />
//           </div>
//         </div>

//         {loading ? (
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600">Loading marketplace data...</p>
//           </div>
//         ) : error ? (
//           <div className="text-center py-12">
//             <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
//             <p className="mt-4 text-gray-800 font-medium">Error loading marketplace data</p>
//             <p className="mt-2 text-gray-600">{error}</p>
//             <button
//               onClick={fetchSellers}
//               className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//             >
//               Try Again
//             </button>
//           </div>
//         ) : filteredSellers.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-600">
//               {sellers.length === 0
//                 ? "No sellers available in the marketplace."
//                 : "No sellers match your search criteria."}
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredSellers.map((seller) => (
//               <MarketSellerCard
//                 key={seller.id}
//                 seller={seller}
//                 onClick={() => setSelectedSeller(seller)}
//               />
//             ))}
//           </div>
//         )}

//         {selectedSeller && (
//           <MarketSellerDetails
//             seller={selectedSeller}
//             onClose={() => setSelectedSeller(null)}
//           />
//         )}
//       </main>
//     </div>
//   );
// };

// export default MarketplacePage;

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  TreePine,
  Users,
  UserCheck,
  Leaf,
  PlusCircle,
  Search,
  RefreshCcw,
} from "lucide-react";

const CONTRACT_ADDRESS = "0x92b91918D53C8f12A39907b976c6BFf34466F5c8";

function MarketplacePage({ expanded }) {
  const [activeTab, setActiveTab] = useState("holders");
  const [creditHolders, setCreditHolders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [verifiers, setVerifiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [holderForm, setHolderForm] = useState({
    name: "",
    holderId: "",
    creditsHeld: "",
    pricePerCredit: "",
    creditValidityPeriod: "",
  });

  const [customerForm, setCustomerForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
  });

  const [verifierForm, setVerifierForm] = useState({
    name: "",
    homeCountry: "",
    regNo: "",
    licenseNo: "",
  });

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }
      await window.ethereum.request({ method: "eth_requestAccounts" });
      return new ethers.BrowserProvider(window.ethereum);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  };

  const getContract = async () => {
    const provider = await connectWallet();
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, carbon.abi, signer);
  };

  const registerCreditHolder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const contract = await getContract();
      await contract.registerCreditHolder(
        holderForm.name,
        holderForm.holderId,
        holderForm.creditsHeld,
        holderForm.pricePerCredit,
        holderForm.creditValidityPeriod
      );
      // Reset form and refresh data
      setHolderForm({
        name: "",
        holderId: "",
        creditsHeld: "",
        pricePerCredit: "",
        creditValidityPeriod: "",
      });
      fetchCreditHolders();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const registerCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const contract = await getContract();
      await contract.registerCustomer(
        customerForm.firstName,
        customerForm.lastName,
        customerForm.email,
        customerForm.contact
      );
      setCustomerForm({
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
      });
      fetchCustomers();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const registerVerifier = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const contract = await getContract();
      const tx = await contract.registerVerifiers(
        verifierForm.name,
        verifierForm.homeCountry,
        Number(verifierForm.regNo),
        Number(verifierForm.licenseNo)
      );
      console.log("Transaction Submitted:", tx);

      await tx.wait(); // Wait for the transaction to be confirmed
      console.log("Transaction Mined:", tx);

      setVerifierForm({
        name: "",
        homeCountry: "",
        regNo: "",
        licenseNo: "",
      });

      await fetchVerifiers(); // Fetch the updated list after confirmation
    } catch (error) {
      setError(error.message);
      console.error("Error registering verifier:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCreditHolders = async () => {
    try {
      const contract = await getContract();
      const holders = await contract.getCreditHolders();
      console.log("Credit holders:", holders);
      setCreditHolders(holders);
    } catch (error) {
      console.error("Error fetching credit holders:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const contract = await getContract();

      const owner = await contract.owner()

      const customers = await contract.customers(owner);


      console.log(customers);
      // Get the total number of customers
      // const totalCustomers = await contract.customercount();
      // console.log("Total customers:", totalCustomers.toString());

      // const fetchedCustomers = [];
      // for (let i = 1; i <= totalCustomers; i++) {
      //   const customer = await contract.customers(i); // Query individual customer
      //   fetchedCustomers.push(customer);
      // }

      // Update state with fetched customers
      // setCustomers(fetchedCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchVerifiers = async () => {
    try {
      const contract = await getContract();
      const verifierList = await contract.getVerifiers();
      console.log("verifierList", verifierList);
      setVerifiers(verifierList);
    } catch (error) {
      console.error("Error fetching verifiers:", error);
    }
  };

  useEffect(() => {
    fetchCreditHolders();
    fetchCustomers();
    fetchVerifiers();
  }, []);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pb-14 px-10 min-h-screen bg-gradient-to-b from-green-50 to-white ${
        expanded ? "ml-64" : "ml-20"
      } transition-all`}
    >
      <nav className=" text-green-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TreePine className="h-8 w-8 pl-3" />
            <h1 className="text-2xl font-bold">Carbon Credit Platform</h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("holders")}
              className={`flex items-center space-x-1 px-4 py-2 rounded-lg bg-green-100 ${
                activeTab === "holders"
                  ? "bg-green-700 text-white"
                  : "hover:bg-green-600 hover:text-white"
              }`}
            >
              <Leaf className="h-5 w-5" />
              <span>Credit Holders</span>
            </button>
            <button
              onClick={() => setActiveTab("customers")}
              className={`flex items-center space-x-1 px-4 py-2 rounded-lg bg-green-100 ${
                activeTab === "customers"
                  ? "bg-green-700 text-white"
                  : "hover:bg-green-600 hover:text-white"
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Customers</span>
            </button>
            <button
              onClick={() => setActiveTab("verifiers")}
              className={`flex items-center space-x-1 px-4 py-2 rounded-lg bg-green-100 ${
                activeTab === "verifiers"
                  ? "bg-green-700 text-white"
                  : "hover:bg-green-600 hover:text-white"
              }`}
            >
              <UserCheck className="h-5 w-5" />
              <span>Verifiers</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {activeTab === "holders" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Register New Credit Holder
              </h2>
              <form
                onSubmit={registerCreditHolder}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={holderForm.name}
                  onChange={(e) =>
                    setHolderForm({ ...holderForm, name: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Holder ID"
                  value={holderForm.holderId}
                  onChange={(e) =>
                    setHolderForm({ ...holderForm, holderId: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Credits Held"
                  value={holderForm.creditsHeld}
                  onChange={(e) =>
                    setHolderForm({
                      ...holderForm,
                      creditsHeld: e.target.value,
                    })
                  }
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Price per Credit"
                  value={holderForm.pricePerCredit}
                  onChange={(e) =>
                    setHolderForm({
                      ...holderForm,
                      pricePerCredit: e.target.value,
                    })
                  }
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Credit Validity Period"
                  value={holderForm.creditValidityPeriod}
                  onChange={(e) =>
                    setHolderForm({
                      ...holderForm,
                      creditValidityPeriod: e.target.value,
                    })
                  }
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <RefreshCcw className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <PlusCircle className="h-5 w-5" />
                      <span>Register Holder</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Credit Holders
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {creditHolders.map(
                  (holder, index) =>
                    holder.name && (
                      <div
                        key={index}
                        className="bg-white p-6 rounded-lg shadow-md"
                      >
                        <h3 className="text-xl font-semibold mb-2">
                          {holder.name}
                        </h3>
                        <p className="text-gray-600">
                          ID: {holder[1].toString()}
                        </p>
                        <p className="text-gray-600">
                          Credits: {holder[3].toString()}
                        </p>
                        <p className="text-gray-600">
                          Price/Credit: {holder[4].toString()}
                        </p>
                        <p className="text-gray-600">
                          Validity: {holder[5].toString()}
                        </p>
                      </div>
                    )
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "customers" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Register New Customer
              </h2>
              <form
                onSubmit={registerCustomer}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <input
                  type="text"
                  placeholder="First Name"
                  value={customerForm.firstName}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      firstName: e.target.value,
                    })
                  }
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={customerForm.lastName}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      lastName: e.target.value,
                    })
                  }
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={customerForm.email}
                  onChange={(e) =>
                    setCustomerForm({ ...customerForm, email: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="tel"
                  placeholder="Contact"
                  value={customerForm.contact}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      contact: e.target.value,
                    })
                  }
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <RefreshCcw className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <PlusCircle className="h-5 w-5" />
                      <span>Register Customer</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Customers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map((customer, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <h3 className="text-xl font-semibold mb-2">{`${customer.firstName} ${customer.lastName}`}</h3>
                    <p className="text-gray-600">Email: {customer.email}</p>
                    <p className="text-gray-600">Contact: {customer.contact}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "verifiers" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Register New Verifier
              </h2>
              <form
                onSubmit={registerVerifier}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={verifierForm.name}
                  onChange={(e) =>
                    setVerifierForm({ ...verifierForm, name: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Home Country"
                  value={verifierForm.homeCountry}
                  onChange={(e) =>
                    setVerifierForm({
                      ...verifierForm,
                      homeCountry: e.target.value,
                    })
                  }
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Registration Number"
                  value={verifierForm.regNo}
                  onChange={(e) =>
                    setVerifierForm({ ...verifierForm, regNo: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="License Number"
                  value={verifierForm.licenseNo}
                  onChange={(e) =>
                    setVerifierForm({
                      ...verifierForm,
                      licenseNo: e.target.value,
                    })
                  }
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <RefreshCcw className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <PlusCircle className="h-5 w-5" />
                      <span>Register Verifier</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Verifiers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {verifiers.map((verifier, index) => (
                  verifier.name && (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      {verifier.name}
                    </h3>
                    <p className="text-gray-600">
                      Country: {verifier.homeCountry}
                    </p>
                    <p className="text-gray-600">Reg. No: {verifier[2].toString()}</p>
                    <p className="text-gray-600">
                      License: {verifier[3].toString()}
                    </p>
                  </div>
                  )
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default MarketplacePage;
