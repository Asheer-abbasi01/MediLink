import React from "react";
import doc1 from "../assets/Doctors/doc1.jpg";
import doc2 from "../assets/Doctors/doc2.jpg";
import doc3 from "../assets/Doctors/doc3.jpg";
import doc4 from "../assets/Doctors/doc4.jpg";

export default function Doctors() {
  const doctors = [
    { img: doc1, name: "Dr. Sara Khan", specialty: "Cardiologist" },
    { img: doc2, name: "Dr. Ali Raza", specialty: "Neurologist" },
    { img: doc3, name: "Dr. Hina Malik", specialty: "Pediatrician" },
    { img: doc4, name: "Dr. Ahmed Shah", specialty: "Orthopedic" },
    // Add more doctors as needed
  ];

  return (
    <div className="w-full flex flex-col items-center bg-slate-50 text-slate-800 min-h-screen">
      
      {/* Page Header */}
      <section className="w-full bg-white py-16 shadow-sm">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 text-center">
          Our Doctors
        </h1>
        <p className="text-slate-600 mt-4 text-center max-w-2xl mx-auto">
          Meet our verified specialists. Book appointments and consult with top healthcare professionals in Pakistan.
        </p>
      </section>

      {/* Search / Filter */}
      <section className="w-full max-w-6xl px-6 mt-12">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Search by name or specialty"
            className="w-full md:w-1/2 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition">
            Search
          </button>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="w-full max-w-6xl px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doc, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden border border-slate-200"
          >
            <img
              src={doc.img}
              alt={doc.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-blue-700">{doc.name}</h3>
              <p className="text-slate-600 mt-1">{doc.specialty}</p>
              <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-700 transition">
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="w-full bg-blue-700 py-16 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Looking for a Specialist?</h2>
        <p className="text-white mb-6 max-w-2xl mx-auto text-lg">
          Our platform connects you instantly with verified doctors across Pakistan.
        </p>
        <button className="bg-white text-blue-700 font-bold px-10 py-4 rounded-xl shadow hover:bg-gray-100 transition">
          Get Started
        </button>
      </section>

    </div>
  );
}
