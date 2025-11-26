import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import img1 from "../assets/Home/img3.jpg";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    { icon: "🩺", title: "Find Doctors", desc: "Book appointments with top specialists near you." },
    { icon: "🏥", title: "Hospital Services", desc: "Access top-tier hospital records and departments." },
    { icon: "💊", title: "Pharmacy", desc: "Order medicines online and get them delivered fast." },
    { icon: "🧪", title: "Lab Tests", desc: "Book diagnostic tests and view reports digitally." },
  ];

  const stats = [
    { value: "80K+", label: "Patients Served" },
    { value: "3,000+", label: "Verified Doctors" },
    { value: "200+", label: "Hospitals" },
    { value: "25+", label: "Cities" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-center lg:text-left space-y-6">
            <div className="inline-block px-4 py-1.5 bg-teal-50 text-teal-700 font-semibold rounded-full text-sm mb-2">
              👋 Welcome to MediLink
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              Your Health, <br />
              <span className="text-teal-600">Simplified.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Connect with the best doctors, hospitals, and pharmacies in one seamless platform.
              Experience the future of healthcare today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button
                onClick={() => navigate('/choose-role')}
                className="px-8 py-4 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-200 hover:bg-teal-700 hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/about')}
                className="px-8 py-4 bg-white text-teal-700 border-2 border-teal-100 rounded-xl font-bold hover:border-teal-200 hover:bg-teal-50 transition-all"
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="absolute inset-0 bg-teal-500 rounded-full opacity-10 blur-3xl transform translate-x-10 translate-y-10"></div>
            <img
              src={img1}
              alt="Doctor and Patient"
              className="relative z-10 w-full max-w-lg mx-auto rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-teal-600 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-1">
              <h3 className="text-4xl font-bold">{stat.value}</h3>
              <p className="text-teal-100 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Complete Healthcare Ecosystem</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Everything you need for your well-being, all in one place.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Get started with MediLink in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Create Account</h3>
                <p className="text-slate-600">Sign up in seconds and choose your role - patient or healthcare provider</p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-teal-300"></div>
            </div>
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Find Services</h3>
                <p className="text-slate-600">Browse doctors, book appointments, or order medicines with ease</p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-teal-300"></div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Get Care</h3>
              <p className="text-slate-600">Receive quality healthcare services and manage everything online</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What Our Patients Say</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Trusted by thousands of satisfied patients across the country</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">★</span>
              ))}
            </div>
            <p className="text-slate-600 mb-6 italic">"MediLink made it so easy to find a specialist and book an appointment. The entire process was seamless!"</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold">
                SA
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Sarah Ahmed</h4>
                <p className="text-sm text-slate-500">Patient</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">★</span>
              ))}
            </div>
            <p className="text-slate-600 mb-6 italic">"As a doctor, MediLink helps me manage my appointments efficiently. Highly recommended!"</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                AK
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Dr. Ali Khan</h4>
                <p className="text-sm text-slate-500">Cardiologist</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">★</span>
              ))}
            </div>
            <p className="text-slate-600 mb-6 italic">"Ordering medicines online has never been easier. Fast delivery and great prices!"</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold">
                FH
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Fatima Hassan</h4>
                <p className="text-sm text-slate-500">Patient</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-teal-600 to-blue-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5 pattern-dots"></div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to prioritize your health?</h2>
          <p className="text-lg text-teal-100 mb-10 max-w-2xl mx-auto relative z-10">
            Join thousands of satisfied users who trust MediLink for their healthcare needs.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-10 py-4 bg-white text-teal-700 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1 relative z-10"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} MediLink. All rights reserved.</p>
      </footer>
    </div>
  );
}