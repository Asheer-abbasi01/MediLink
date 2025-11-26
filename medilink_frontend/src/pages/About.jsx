import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-teal-600 to-blue-600 py-20 px-6">
                <div className="max-w-7xl mx-auto text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">About MediLink</h1>
                    <p className="text-teal-100 text-xl max-w-3xl mx-auto leading-relaxed">
                        Revolutionizing healthcare access through technology and compassion
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
                        <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center text-3xl mb-6">
                            🎯
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Mission</h2>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            To make quality healthcare accessible to everyone by connecting patients with the best medical professionals
                            and services through a seamless digital platform. We believe healthcare should be simple, transparent, and
                            available to all.
                        </p>
                    </div>
                    <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-6">
                            👁️
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Vision</h2>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            To become the most trusted healthcare platform, empowering millions to take control of their health journey.
                            We envision a future where geographical and financial barriers no longer prevent anyone from receiving
                            excellent medical care.
                        </p>
                    </div>
                </div>
            </section>

            {/* Key Features */}
            <section className="bg-white py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose MediLink?</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            We're committed to providing the best healthcare experience
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-8">
                            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                                ✓
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Verified Professionals</h3>
                            <p className="text-slate-600">
                                All doctors and healthcare providers are thoroughly verified and licensed
                            </p>
                        </div>
                        <div className="text-center p-8">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                                🔒
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Secure & Private</h3>
                            <p className="text-slate-600">
                                Your health data is encrypted and protected with industry-leading security
                            </p>
                        </div>
                        <div className="text-center p-8">
                            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                                ⚡
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Fast & Convenient</h3>
                            <p className="text-slate-600">
                                Book appointments, order medicines, and access services in minutes
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-3xl p-12 md:p-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                        <div>
                            <h3 className="text-4xl md:text-5xl font-bold mb-2">80K+</h3>
                            <p className="text-teal-100">Happy Patients</p>
                        </div>
                        <div>
                            <h3 className="text-4xl md:text-5xl font-bold mb-2">3,000+</h3>
                            <p className="text-teal-100">Verified Doctors</p>
                        </div>
                        <div>
                            <h3 className="text-4xl md:text-5xl font-bold mb-2">200+</h3>
                            <p className="text-teal-100">Partner Hospitals</p>
                        </div>
                        <div>
                            <h3 className="text-4xl md:text-5xl font-bold mb-2">25+</h3>
                            <p className="text-teal-100">Cities Covered</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact/CTA */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="bg-white rounded-3xl p-12 md:p-16 text-center shadow-xl border border-gray-100">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Ready to Get Started?</h2>
                    <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto">
                        Join thousands of satisfied users who trust MediLink for their healthcare needs
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-10 py-4 bg-teal-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-teal-700 hover:shadow-xl transition-all transform hover:-translate-y-1"
                        >
                            Create Account
                        </button>
                        <button
                            onClick={() => navigate('/doctors')}
                            className="px-10 py-4 bg-white text-teal-700 border-2 border-teal-600 rounded-xl font-bold text-lg hover:bg-teal-50 transition-all"
                        >
                            Find a Doctor
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-12 text-center text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} MediLink. All rights reserved.</p>
            </footer>
        </div>
    );
}
