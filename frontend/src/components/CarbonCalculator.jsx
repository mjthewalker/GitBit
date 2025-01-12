import React, { useState } from 'react';
import { TreePine, Cloud, Droplets, Wind, Car, Home, Plane, ShoppingBag } from 'lucide-react';
import axios from 'axios';

const fetchWolframResult = async (query) => {
  try {
    const response = await axios.get(`/wolfram`, {
      params: {
        query: query
      }
    });
    return response.data.results[query];
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const CarbonCalculator = ({ expanded }) => {
  const [inputs, setInputs] = useState({
    carMiles: 0,
    homeEnergy: 0,
    flightHours: 0,
    meatConsumption: 0
  });

  const [impact, setImpact] = useState({
    co2Emissions: 0,
    treesNeeded: 0,
    waterImpact: 0,
    energyUsage: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateImpact = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fallback calculations if API fails
      const calculateLocalImpact = () => {
        // Car emissions calculation (Average for petrol cars)
        const carEmissionRate = 0.21; // kg CO₂ per mile driven
        const co2FromCar = inputs.carMiles * carEmissionRate;

        // Home energy calculation (Average grid CO₂ emissions per kWh)
        const energyEmissionRate = 0.85; // kg CO₂ per kWh
        const co2FromHome = inputs.homeEnergy * energyEmissionRate;

        // Flight emissions calculation (Average flight emissions per passenger hour)
        const flightEmissionRate = 0.115; // kg CO₂ per seat km
        const averageFlightDistance = 800; // assuming average flight distance of 800 km
        const co2FromFlights = inputs.flightHours * flightEmissionRate * averageFlightDistance;

        // Meat consumption calculation (CO₂ emissions for beef production)
        const meatEmissionRate = 27.0; // kg CO₂ per kg of beef
        const co2FromMeat = inputs.meatConsumption * meatEmissionRate;

        const totalCO2 = co2FromCar + co2FromHome + co2FromFlights + co2FromMeat;

        // Trees needed calculation (Assuming a tree absorbs 22 kg of CO2 per year)
        const treeAbsorptionRate = 22; // kg CO₂ per tree per year
        const treesNeeded = totalCO2 / treeAbsorptionRate;

        // Water impact calculation
        const waterCar = inputs.carMiles * 0.6; // liters per mile
        const waterEnergy = inputs.homeEnergy * 0.1; // liters per kWh
        const waterFlight = inputs.flightHours * 3; // liters per hour
        const waterMeat = inputs.meatConsumption * 15; // liters per kg
        const waterImpact = waterCar + waterEnergy + waterFlight + waterMeat;

        // Energy usage calculation
        const energyCar = inputs.carMiles * 0.04; // kWh per mile
        const energyFlight = inputs.flightHours * 0.2; // kWh per hour
        const energyMeat = inputs.meatConsumption * 0.2; // kWh per kg
        const energyUsage = inputs.homeEnergy + energyCar + energyFlight + energyMeat;

        return {
          totalCO2,
          treesNeeded,
          waterImpact,
          energyUsage
        };
      };

      try {
        // Try Wolfram Alpha API first
        const carQuery = `convert ${inputs.carMiles} miles * average car CO2 emissions per mile to kg`;
        const carData = await fetchWolframResult(carQuery);
        const co2FromCar = parseFloat(carData.queryresult?.pods[1]?.subpods[0]?.plaintext) || 0;

        const homeEnergyQuery = `convert ${inputs.homeEnergy} kWh * average US grid CO2 emissions per kWh to kg`;
        const energyData = await fetchWolframResult(homeEnergyQuery);
        const co2FromHome = parseFloat(energyData.queryresult?.pods[1]?.subpods[0]?.plaintext) || 0;

        const flightQuery = `${inputs.flightHours} hours * average commercial flight CO2 emissions per passenger hour`;
        const flightData = await fetchWolframResult(flightQuery);
        const co2FromFlights = parseFloat(flightData.queryresult?.pods[1]?.subpods[0]?.plaintext) || 0;

        const meatQuery = `${inputs.meatConsumption} kg beef production CO2 equivalent emissions`;
        const meatData = await fetchWolframResult(meatQuery);
        const co2FromMeat = parseFloat(meatData.queryresult?.pods[1]?.subpods[0]?.plaintext) || 0;

        const totalCO2 = co2FromCar + co2FromHome + co2FromFlights + co2FromMeat;

        // Calculate remaining metrics using Wolfram Alpha
        const treeQuery = `${totalCO2} kg CO2 / average CO2 absorption per tree per year`;
        const treeData = await fetchWolframResult(treeQuery);
        const treesNeeded = parseFloat(treeData.queryresult?.pods[1]?.subpods[0]?.plaintext) || 0;

        const waterQuery = `${inputs.carMiles} miles * average water consumption per mile driven + ${inputs.homeEnergy} kWh * average water consumption per kWh + ${inputs.flightHours} hours * average water consumption per flight hour + ${inputs.meatConsumption} kg * water footprint of beef production`;
        const waterData = await fetchWolframResult(waterQuery);
        const waterImpact = parseFloat(waterData.queryresult?.pods[1]?.subpods[0]?.plaintext) || 0;

        const totalEnergyQuery = `${inputs.homeEnergy} kWh + convert ${inputs.carMiles} miles * average car energy consumption per mile to kWh + ${inputs.flightHours} hours * average flight energy consumption per hour + ${inputs.meatConsumption} kg * energy consumption for beef production`;
        const totalEnergyData = await fetchWolframResult(totalEnergyQuery);
        const energyUsage = parseFloat(totalEnergyData.queryresult?.pods[1]?.subpods[0]?.plaintext) || 0;

        setImpact({
          co2Emissions: totalCO2.toFixed(2),
          treesNeeded: Math.ceil(treesNeeded),
          waterImpact: Math.ceil(waterImpact),
          energyUsage: Math.ceil(energyUsage)
        });

      } catch (apiError) {
        console.error('API calculation failed, using local calculations:', apiError);
        // Fallback to local calculations if API fails
        const localResults = calculateLocalImpact();
        setImpact({
          co2Emissions: localResults.totalCO2.toFixed(2),
          treesNeeded: Math.ceil(localResults.treesNeeded),
          waterImpact: Math.ceil(localResults.waterImpact),
          energyUsage: Math.ceil(localResults.energyUsage)
        });
      }
    } catch (error) {
      console.error('Calculation error:', error);
      setError('Failed to calculate environmental impact. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  return (
    <div className={`justify-center py-6 min-h-screen bg-gradient-to-b from-green-50 to-white ${expanded ? "ml-64" : "ml-20"}`}>
      <main className="max-w-7xl mx-auto px-4  py-8">
        <div className="flex items-center space-x-3 mb-8">
          <Cloud className="h-8 w-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Carbon Footprint Calculator</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">Enter Your Data</h3>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-4">
                {/* Input fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Car className="inline-block h-4 w-4 mr-2" />
                    Miles Driven per Month
                  </label>
                  <input
                    type="number"
                    name="carMiles"
                    value={inputs.carMiles}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Home className="inline-block h-4 w-4 mr-2" />
                    Monthly Energy Usage (kWh)
                  </label>
                  <input
                    type="number"
                    name="homeEnergy"
                    value={inputs.homeEnergy}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Plane className="inline-block h-4 w-4 mr-2" />
                    Flight Hours per Year
                  </label>
                  <input
                    type="number"
                    name="flightHours"
                    value={inputs.flightHours}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <ShoppingBag className="inline-block h-4 w-4 mr-2" />
                    Monthly Meat Consumption (kg)
                  </label>
                  <input
                    type="number"
                    name="meatConsumption"
                    value={inputs.meatConsumption}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}

                <button
                  onClick={calculateImpact}
                  disabled={loading}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400"
                >
                  {loading ? 'Calculating...' : 'Calculate Impact'}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">Your Environmental Impact</h3>
            </div>
            <div className="p-6 pt-0">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-md border border-green-100">
                  <Cloud className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">CO₂ Emissions</h3>
                  <p className="text-2xl font-bold text-green-600">{impact.co2Emissions} kg</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-md border border-green-100">
                  <TreePine className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Trees Needed</h3>
                  <p className="text-2xl font-bold text-green-600">{impact.treesNeeded} trees</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-md border border-green-100">
                  <Droplets className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Water Impact</h3>
                  <p className="text-2xl font-bold text-green-600">{impact.waterImpact}L</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-md border border-green-100">
                  <Wind className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Energy Usage</h3>
                  <p className="text-2xl font-bold text-green-600">{impact.energyUsage}kWh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CarbonCalculator;