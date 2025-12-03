import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import BookAppointmentModal from "../components/BookAppointmentModal";

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [specialtyFilter, setSpecialtyFilter] = useState("All");
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/doctors");
            setDoctors(res.data.doctors || res.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching doctors:", err);
            setLoading(false);
        }
    };

    // Get unique specialties
    const specialties = ["All", ...new Set(doctors.map(doc => doc.specialty).filter(Boolean))];

    // Filter doctors
    const filteredDoctors = doctors.filter(doc => {
        const matchesSearch = doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.specialty?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = specialtyFilter === "All" || doc.specialty === specialtyFilter;
        return matchesSearch && matchesSpecialty;
    });

    const navigate = useNavigate();

    // Handle booking modal
    const handleBookAppointment = (doctor) => {
        // Check if user is logged in
        const token = localStorage.getItem("token");
        if (!token) {
            // Optionally save the intended destination or doctor to redirect back after login
            // For now, just redirect to login
            if (window.confirm("You need to login to book an appointment. Go to login page?")) {
                navigate("/login");
            }
            return;
        }
        setSelectedDoctor(doctor);
        setIsModalOpen(true);
    };

    const handleBookingSuccess = () => {
        // Optionally refresh data or show success message
        console.log("Appointment booked successfully");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header */}
            <section className="bg-gradient-to-r from-teal-600 to-blue-600 py-16 px-6">
                <div className="max-w-7xl mx-auto text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Doctor</h1>
                    <p className="text-teal-100 text-lg max-w-2xl mx-auto">
                        Connect with verified specialists and book appointments instantly
                    </p>
                </div>
            </section>

            {/* Search & Filter */}
            <section className="max-w-7xl mx-auto px-6 -mt-8">
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by name or specialty..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50"
                            />
                        </div>
                        <select
                            value={specialtyFilter}
                            onChange={(e) => setSpecialtyFilter(e.target.value)}
                            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50"
                        >
                            {specialties.map(specialty => (
                                <option key={specialty} value={specialty}>{specialty}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* Doctors Grid */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-600 mt-4">Loading doctors...</p>
                    </div>
                ) : filteredDoctors.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-slate-600 text-lg">No doctors found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredDoctors.map((doctor) => (
                            <div
                                key={doctor._id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                            >
                                <div className="h-48 bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
                                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-teal-600 shadow-lg">
                                        {doctor.name?.charAt(0) || "D"}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{doctor.name}</h3>
                                    <p className="text-teal-600 font-semibold mb-3">{doctor.specialty}</p>
                                    {doctor.yearsExperience && (
                                        <p className="text-sm text-slate-600 mb-2">
                                            <span className="font-semibold">Experience:</span> {doctor.yearsExperience} years
                                        </p>
                                    )}
                                    {doctor.licenseNumber && (
                                        <p className="text-sm text-slate-600 mb-4">
                                            <span className="font-semibold">License:</span> {doctor.licenseNumber}
                                        </p>
                                    )}
                                    <button
                                        onClick={() => handleBookAppointment(doctor)}
                                        className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors shadow-md"
                                    >
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Booking Modal */}
            <BookAppointmentModal
                doctor={selectedDoctor}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleBookingSuccess}
            />

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-12 text-center text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} MediLink. All rights reserved.</p>
            </footer>
        </div>
    );
}
