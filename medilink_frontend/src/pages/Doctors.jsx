import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import Navbar from "../components/Navbar";
import BookAppointmentModal from "../components/BookAppointmentModal";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Loader";

export default function Doctors() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await client.get("/api/doctors");

        console.log("Response:", res.data);
        console.log("Doctors:", res.data.doctors);
        console.log("Is Array:", Array.isArray(res.data.doctors));
        console.log("Full Response:", res.data);

        const doctorsData = Array.isArray(res.data?.doctors)
          ? res.data.doctors
          : [];

        console.log("Doctors Array:", doctorsData);

        setDoctors(doctorsData);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // ---------------- FIXED ----------------

  const doctorList = Array.isArray(doctors) ? doctors : [];

  const specialties = [
    "All",
    ...new Set(doctorList.map((doc) => doc.specialty).filter(Boolean)),
  ];

  const filteredDoctors = doctorList.filter((doc) => {
    const matchesSearch =
      doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty =
      specialtyFilter === "All" ||
      doc.specialty === specialtyFilter;

    return matchesSearch && matchesSpecialty;
  });

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  // ---------------------------------------

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Hero */}
        <section className="bg-gradient-to-r from-teal-600 to-teal-800 py-16 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 opacity-10 pattern-dots"></div>
          <div className="max-w-7xl mx-auto text-center text-white relative z-10 space-y-4">
            <Badge
              variant="success"
              size="sm"
              className="!bg-teal-500/20 !text-teal-100 !border-teal-400/20"
            >
              🩺 CLINICAL STAFF
            </Badge>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Find Your Specialist
            </h1>

            <p className="text-teal-100 text-sm md:text-base max-w-xl mx-auto font-medium">
              Connect with verified clinical doctors and book appointment slots
              instantly.
            </p>
          </div>
        </section>

        {/* Filter */}
        <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
          <Card bodyClass="p-5 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
              />
            </div>

            <div className="flex flex-col gap-1 w-full md:max-w-xs justify-center">
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
              >
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          </Card>
        </section>

        {/* Doctors */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Skeleton className="h-72 rounded-2xl" />
              <Skeleton className="h-72 rounded-2xl" />
              <Skeleton className="h-72 rounded-2xl" />
              <Skeleton className="h-72 rounded-2xl" />
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400 shadow-sm max-w-xl mx-auto">
              <span className="text-5xl block mb-3">👨‍⚕️</span>
              <p className="font-semibold text-lg">
                No matching specialist profiles found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-200">
              {filteredDoctors.map((doc) => (
                <Card
                  key={doc._id}
                  hoverEffect
                  bodyClass="p-0 flex flex-col justify-between h-full"
                  className="overflow-hidden"
                >
                  <div className="p-6 text-center space-y-4">
                    <div className="w-20 h-20 bg-teal-50 border border-teal-100 rounded-full flex items-center justify-center text-2xl font-extrabold text-teal-600 shadow-sm mx-auto group-hover:scale-105 transition-transform duration-300">
                      {doc.name?.charAt(0) || "D"}
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                        {doc.name}
                      </h3>

                      <p className="text-teal-600 text-xs font-bold uppercase tracking-wider mt-1">
                        {doc.specialty}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-500 font-semibold border-t border-slate-50 pt-4 text-left">
                      {doc.yearsExperience && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Experience:</span>
                          <span className="text-slate-700">
                            {doc.yearsExperience} years
                          </span>
                        </div>
                      )}

                      {doc.licenseNumber && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">License:</span>
                          <span className="text-slate-700">
                            {doc.licenseNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/50 border-t border-slate-50">
                    <Button
                      onClick={() => handleBookAppointment(doc)}
                      className="w-full text-xs py-2.5"
                    >
                      Book Consultation
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      <BookAppointmentModal
        doctor={selectedDoctor}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => console.log("Appointment booked successfully")}
      />

      <footer className="bg-white border-t border-slate-100 py-10 text-center text-slate-400 text-xs font-semibold">
        <p>&copy; {new Date().getFullYear()} MediLink. All rights reserved.</p>
      </footer>
    </div>
  );
}