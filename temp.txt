import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Leaf, Brain, TreePine, ArrowRight, Globe } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-green-100">
    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-green-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-green-200 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-200 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center mb-6 animate-fade-in">
            <Sprout className="h-12 w-12 text-green-600 mr-3" />
            <h1 className="text-5xl font-bold text-gray-900">SproutUp</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Where smart investments meet sustainability
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 mb-20 shadow-xl border border-green-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At SproutUp, we're redefining the way you grow your wealth by blending cutting-edge AI solutions 
              like Groclake with a deep commitment to the environment. Our mission is simple: to make investing 
              effortless, intelligent, and eco-conscious.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <FeatureCard
            icon={Brain}
            title="AI-Powered Insights"
            description="Leverage cutting-edge artificial intelligence to make informed investment decisions and optimize your portfolio growth."
          />
          <FeatureCard
            icon={Globe}
            title="Carbon Marketplace"
            description="Take direct action against climate change by trading carbon credits and supporting sustainable environmental projects."
          />
          <FeatureCard
            icon={TreePine}
            title="Sustainable Impact"
            description="Watch your investments grow while contributing to a healthier planet through eco-conscious financial decisions."
          />
        </div>

        {/* Values Section */}
        <div className="bg-green-600 rounded-2xl p-12 text-white mb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80')] opacity-20 bg-cover bg-center" />
          <div className="relative">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center mr-4 shrink-0">
                  <Leaf className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Environmental Stewardship</h3>
                  <p className="text-green-50">We believe that financial growth and environmental protection can and should coexist.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center mr-4 shrink-0">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                  <p className="text-green-50">Using cutting-edge technology to revolutionize sustainable investing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Let's grow together—one smart decision, one green step at a time.
          </h2>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-full text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;