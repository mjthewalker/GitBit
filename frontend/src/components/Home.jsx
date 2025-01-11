import { useEffect, useState } from 'react';

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8000/user/userData', {
          method: 'GET',
          credentials: 'include', // Include cookies with the request
        });

        if (response.ok) {
          const data = await response.json();
          console.log("User data:", data);
          setUser(data.user);
        } else {
          // Handle error if not authenticated
          console.log("Error fetching user data:", await response.json());
        }
      } catch (error) {
        console.log("Network error:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    // <div className="min-h-screen bg-gradient-to-b from-green-700 to-emerald-600 relative text-white flex items-center justify-center">
    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    //     <h1 className="text-5xl font-semibold mb-4">Welcome to EcoLife</h1>
    //     <p className="text-lg">Empowering you to make sustainable choices for a better planet.</p>


    //   </div>
    // </div>
    <div className='flex justify-center py-6 sm:px-6 lg:px-8'>
    <p>Hello world</p>
    
    </div>
  );
};

export default Home;